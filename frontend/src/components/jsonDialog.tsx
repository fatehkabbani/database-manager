import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ReactNode } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';


export function JsonDialog({
  trigger,
  jsonData,
}: {
  trigger: ReactNode
  jsonData: object
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>JSON Viewer</DialogTitle>
          <DialogDescription>
            Click outside or press ESC to close.
          </DialogDescription>
        </DialogHeader>
          <SyntaxHighlighter language="json" style={nightOwl} wrapLines={true} showLineNumbers={true}>
            {JSON.stringify(jsonData, null, 2)}
          </SyntaxHighlighter>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
