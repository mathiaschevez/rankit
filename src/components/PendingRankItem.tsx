'use client';

// import { SelectPendingRankItem } from "@/server/db/schema";
// import Image from "next/image";
// import { Button } from "./ui/button";
// import { deletePendingRankItem, insertRankItems } from "@/server/queries";
// import { useRouter } from "next/navigation";
// import { useSelector } from "@/redux/store";

// { pendingRankItem, index, rankingUserId }: { pendingRankItem: SelectPendingRankItem, index: number, rankingUserId: string }

export default function PendingRankItem() {
  // const router = useRouter();
  // const user = useSelector(state => state.user)

  // function handleAcceptRankItem(pendingRankItem: SelectPendingRankItem) {
  //   insertRankItems([{
  //     name: pendingRankItem.name,
  //     fileName: pendingRankItem.fileName,
  //     imageKey: pendingRankItem.imageKey,
  //     imageUrl: pendingRankItem.imageUrl,
  //     rankingId: pendingRankItem.rankingId,
  //   }]).then(() => {
  //     deletePendingRankItem(pendingRankItem.id).then(() => router.refresh());
  //   })
  // }

  // function handleDeclineRankitem(id: number) {
  //   deletePendingRankItem(id).then(() => router.refresh());
  // }

  return (
    <div className='flex w-full h-20 items-center gap-4'>
      Pending rank item
      {/* <div>{index}</div>
      <Image alt="rankItemImage" src={pendingRankItem.imageUrl} width={50} height={50} />
      <div className='text-xl flex-1'>{pendingRankItem.name}</div>
      {user.user?.userId === rankingUserId ? <div className="flex gap-4">
        <Button onClick={() => handleDeclineRankitem(pendingRankItem.id)}>Decline</Button>
        <Button onClick={() => handleAcceptRankItem(pendingRankItem)}>Accept</Button>
      </div> : <i className="text-slate-500">Pending</i>} */}
    </div>
  )
}