"use client"

import { FormEvent, createContext, useContext, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"

interface IDropdownMenuContext {
  active: boolean,
  setActive: (active: boolean) => void,
  triggerElement?: HTMLElement,
  setTriggerElement: (element: HTMLElement) => void
}

const DropdownMenuContext = createContext<IDropdownMenuContext>({} as IDropdownMenuContext)

export function DropdownMenu({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(false)
  const [triggerElement, setTriggerElement] = useState<HTMLElement>()

  return (
    <DropdownMenuContext.Provider value={{ active, setActive, triggerElement, setTriggerElement }}>
      <div>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children }: { children?: React.ReactNode }) {
  const { active, setActive, setTriggerElement } = useContext(DropdownMenuContext)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current as HTMLElement | null
    if (element && setTriggerElement)
      setTriggerElement(element.lastChild as HTMLElement)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef])

  function handleClick() {
    if (setActive)
      setActive(!active)
  }

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
  gap = 5
}: {
  children?: React.ReactNode,
  className?: string,
  align?: "start" | "center" | "end",
  gap?: number
}) {
  const { active, setActive, triggerElement } = useContext(DropdownMenuContext)
  const modalRef = useRef(null)
  const [elementSize, setElementSize] = useState<{
    x: number,
    y: number,
    w: number,
    h: number
  }>()

  function setSize(e?: UIEvent | boolean) {
    const elementRef = modalRef.current as HTMLElement | null

    if (triggerElement && elementRef) {
      var calc = false
      if (e) {
        if (active) {
          calc = true
        }
      } else {
        calc = true
      }

      if (calc) {
        const element = {
          w: elementRef.offsetWidth,
          h: elementRef.offsetHeight
        }
        const windowSize = {
          w: window.innerWidth,
          h: window.innerHeight
        }
        var size = {
          x: triggerElement.offsetLeft,
          y: triggerElement.offsetTop,
          w: triggerElement.offsetWidth,
          h: triggerElement.offsetHeight
        }

        if (align == "center") {
          if (size.x < (element.w / 2) - (size.w / 2))
            size.x = element.w / 2 - (size.w / 2)
        } else {
          if (size.x < element.w - size.w)
            size.x = element.w - size.w
        }

        if (align == "end") {
          if (windowSize.w < size.x + size.w)
            size.x = windowSize.w - size.w
        } else if (align == "center") {
          if (windowSize.w < size.x + (size.w / 2) + (element.w / 2))
            size.x = windowSize.w - (size.w / 2) - (element.w / 2)
        } else {
          if (windowSize.w < size.x + element.w)
            size.x = windowSize.w - element.w
        }

        setElementSize(size)
      }
    }
  }

  useEffect(() => {
    setSize()

    window.addEventListener('resize', setSize)
    return () => window.removeEventListener('resize', setSize)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerElement, active])

  function handleClick(e: FormEvent) {
    const target = e.target as HTMLElement
    const element = modalRef.current as HTMLElement | null
    if (modalRef.current && !element?.contains(target)) {
      setActive(false)
    }
  }

  return (
    <>
      {active && (
        <div onClick={handleClick}>
          <div className="z-40 fixed top-0 left-0 w-screen h-screen overflow-auto"></div>

          <div
            ref={modalRef}
            className={twMerge(
              "z-50 fixed max-w-full bg-white dark:bg-zinc-950 border border-zinc-400 dark:border-zinc-800 p-1 rounded-lg flex flex-col items-start",
              className
            )}
            style={{
              top: (elementSize?.y || 0) + (elementSize?.h || 0) + (gap || 0),
              left: elementSize?.x || 0,
              transform: align == "center" ? `translateX(calc(-50% + ${(elementSize?.w || 0) / 2}px))`
                : align == "end" ? `translateX(calc(-100% + ${elementSize?.w || 0}px))`
                  : "translate(0)"
            }}
          >
            {children}
          </div>

        </div>
      )
      }
    </>
  )
}

export function DropdownMenuItem({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode,
  className?: string
} & React.HTMLAttributes<HTMLButtonElement>) {
  const { setActive } = useContext(DropdownMenuContext)
  const { onClick: onClickProp, ...restProps } = props

  return (
    <button
      className={twMerge(
        "w-full text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded",
        className
      )}
      onClick={onClickProp ? (event) => { setActive(false); onClickProp(event) } : () => setActive(false)}
      {...restProps}
    >
      {children}
    </button>
  )
}
