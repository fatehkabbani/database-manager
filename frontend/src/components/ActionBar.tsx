import { Button } from '@/components/ui/button'
import { File , Table ,Codepen, Settings} from "lucide-react"
 function ActionBar() {
  return (
      <div className="h-full flex flex-col items-center justify-between bg-background">
          <div className="flex flex-col items-center mt-4">
            <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
              <File />
            </Button>
          <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
            <Table />
          </Button>
          <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
            <Codepen />
          </Button>
          </div>
          <div>
            <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
              <Settings />
            </Button>
          </div>
        </div>
  )
}
export  {ActionBar}
