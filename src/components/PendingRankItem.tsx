'use client';

import Image from "next/image";
import { RankItemType } from "./EditRankingForm";
import { Check, X } from "lucide-react";

export default function PendingRankItem({ rankItem, isCreator }: { rankItem: RankItemType, isCreator: boolean }) {
  function handleAcceptRankItem() {
    console.log('accept');
  }

  function handleDeclineRankitem() {
    console.log('decline');
  }

  return (
    <div
      key={rankItem._id}
      className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all hover:border-[#005CA3]/30"
    >
      {/* <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#005CA3]/10 text-lg font-bold text-[#4a9ede]">
        {index}
      </div> */}
      <div className="hidden h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-800 sm:block">
        <Image src={rankItem.imageUrl} alt={rankItem.name} className="h-full w-full object-cover" height={100} width={100} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-medium">{rankItem.name}</h3>
      </div>
      {isCreator && <div className={`flex ml-auto items-center rounded-full py-1 px-1 gap-3`}>
        <button
          className={`p-2 rounded-full font-bold text-xl items-center gap-2 flex`}
          onClick={handleAcceptRankItem}
        >
          <Check className={`size-4`} strokeWidth={6} />
        </button>
        <button
          className={`p-2 rounded-full font-bold flex items-center gap-2`}
          onClick={handleDeclineRankitem}
        >
          <X className={`size-4`}  strokeWidth={6} />
        </button>
      </div>}
    </div>
  )
}