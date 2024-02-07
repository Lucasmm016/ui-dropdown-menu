# Dropdown menu component for React

### Dependencies

- tailwind-merge

```
npm install tailwind-merge
```

### Usage

```typescript
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>
    <button>
      <ChevronDown />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-32 text-sm">
    <DropdownMenuItem>
      Account settings
    </DropdownMenuItem>
    <DropdownMenuItem>
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
