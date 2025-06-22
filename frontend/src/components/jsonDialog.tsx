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
import { useState } from "react";
import { CheckIcon, Clipboard } from "lucide-react";
export function JsonDialog({
  trigger,
  jsonData,
}: {
  trigger: ReactNode
  jsonData: object
}) {
  let [copy, iscopied] = useState<boolean>(false);
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
        <div className="relative">
          <Button
            variant="icon"
            className="absolute top-3 right-1 z-10 text-white bg-transparent hover:bg-black/80 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
              iscopied(true);
              setTimeout(() => {
                iscopied(false);
              }, 2000);
            }}>
            {copy ? <CheckIcon className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
          </Button>
          <SyntaxHighlighter
            language="json"
            style={nightOwl}
            wrapLines={true}
            showLineNumbers={true}
            customStyle={{ paddingTop: "2.5rem" }}
          >
            {JSON.stringify(jsonData, null, 2)}
          </SyntaxHighlighter>
        </div>


        <DialogFooter>

          <DialogClose asChild>
            <Button variant="destructive">Close</Button>
          </DialogClose>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
