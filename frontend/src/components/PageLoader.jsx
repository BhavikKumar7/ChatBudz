import { LoaderIcon } from 'lucide-react'

const PageLoader = () => {
  return (
    <div>
        <div className="min-h-screen flex items-center justify-center">
            <LoaderIcon className="animate-spin size-10 text-primary" />
        </div>
    </div>
  )
}

export default PageLoader