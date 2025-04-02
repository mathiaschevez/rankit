"use client";

import { removeSavedRanking, saveRanking } from "@/app/api/users";
import { Button } from "./ui/button";
import { MongoUser } from "@/redux/user";
import { useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export default function SaveRankingButton({ userDetails, rankingId }: { userDetails: MongoUser, rankingId: string }) {
  const [rankingSaved, setRankingSaved] = useState(userDetails.savedRankings?.includes(rankingId));
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSaveRanking() {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await saveRanking(userDetails.userId, rankingId);
      setRankingSaved(true);
    } catch (error) {
      console.error("Failed to save ranking:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleSavedRankingRemoval() {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await removeSavedRanking(userDetails.userId, rankingId);
      setRankingSaved(false);
    } catch (error) {
      console.error("Failed to remove saved ranking:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Button
      className="bg-[#005CA3] hover:bg-[#004a82] p-3 rounded-lg disabled:opacity-50"
      onClick={rankingSaved ? handleSavedRankingRemoval : handleSaveRanking}
      disabled={isProcessing}
    >
      {rankingSaved ? <>
        <IoIosHeart /> Unsave
      </> : <>
        <IoIosHeartEmpty /> Save
      </>}
    </Button>
  );
}
