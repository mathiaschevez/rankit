import { InfinityLoader } from "@/components/Loaders";


export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-24 w-24"><InfinityLoader /></div>
    </div>
  )
}