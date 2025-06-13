import { IconFile , IconTable ,IconBrandCodepen , IconSettings} from '@tabler/icons-react';
import { Button } from '@/components/ui/button'

 function ActionBar() {
  return (
      <div className="h-full flex flex-col items-center justify-between bg-background">
          <div className="flex flex-col items-center mt-4">
            <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
            <IconFile />
          </Button>
          <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
            <IconTable />
          </Button>
          <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
            <IconBrandCodepen />
          </Button>
          </div>
          <div>
            <Button className=" mb-2 rounded-0 cursor-pointer" size='lg' variant='icon'>
              <IconSettings />
            </Button>
          </div>
        </div>
  )
}
export default ActionBar
