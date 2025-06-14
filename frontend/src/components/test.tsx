import { File, Database } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Button
} from "@/components/ui/button"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Button variant="outline" className="h-4 w-4">
          <Database className="h-4 w-4" />
        </Button>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Button variant="outline" className="h-4 w-4">
          <File className="h-4 w-4" />
        </Button>
      </ToggleGroupItem>

    </ToggleGroup>
  )
}
