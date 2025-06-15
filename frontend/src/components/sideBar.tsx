
import {
  Zap,
  Grid3X3,
  Star,
  Lock,
  Code
} from "lucide-react"
import { Button } from '@/components/ui/button'
import { QueryFile } from '@/components/items/queryFile'
function setActiveQuery(QueryNumber: number) {
  console.log(`Setting query ${QueryNumber} as active`);

}
function SideBar() {
  return (
    <div className="h-full bg-background flex flex-col w-full">
      <div className="p-0 flex-1">
        <div className="flex items-center justify-between gap-1 mb-4">
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Zap className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Lock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="cursor-pointer p-2 hover:bg-accent rounded-md transition-colors">
            <Code className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1 w-full">
          <QueryFile queryNumber={1} isActive={true} onClose={() => { }} onClick={() => setActiveQuery(1)} />
          <QueryFile queryNumber={2} isActive={false} onClose={() => { }} onClick={() => setActiveQuery(2)} />
        </div>
      </div>

    </div>
  )
}
export { SideBar }
