'use client';

import { SelectPendingRankItem } from "@/server/db/schema";
import Image from "next/image";
import { Button } from "./ui/button";
import { deletePendingRankItem, insertRankItems } from "@/server/queries";
import { useRouter } from "next/navigation";

export default function PendingRankItem({ pendingRankItem, index, userId, rankingUserId }: { pendingRankItem: SelectPendingRankItem, index: number, userId: string, rankingUserId: string }) {
  const router = useRouter();

  function handleAcceptRankItem(pendingRankItem: SelectPendingRankItem) {
    insertRankItems([{
      name: pendingRankItem.name,
      fileName: pendingRankItem.fileName,
      imageKey: pendingRankItem.imageKey,
      imageUrl: pendingRankItem.imageUrl,
      rankingId: pendingRankItem.rankingId,
    }]).then(() => {
      deletePendingRankItem(pendingRankItem.id).then(() => router.refresh());
    })
  }

  function handleDeclineRankitem(id: number) {
    deletePendingRankItem(id).then(() => router.refresh());
  }

  return (
    <div className='flex w-full h-20 items-center gap-4'>
      <div>{index}</div>
      <Image alt="rankItemImage" src={pendingRankItem.imageUrl} width={50} height={50} />
      <div className='text-xl flex-1'>{pendingRankItem.name}</div>
      {userId === rankingUserId ? <div className="flex gap-4">
        <Button onClick={() => handleDeclineRankitem(pendingRankItem.id)}>Decline</Button>
        <Button onClick={() => handleAcceptRankItem(pendingRankItem)}>Accept</Button>
      </div> : <i className="text-slate-500">Pending</i>}
    </div>
  )
}