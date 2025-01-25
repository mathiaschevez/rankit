import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-24 w-24"><Loader /></div>
    </div>
  )
}