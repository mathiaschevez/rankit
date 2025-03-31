'use client';

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function BackButton({ text }: { text: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="flex items-center text-gray-400 hover:text-white"
      onClick={() => router.back()}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {text}
    </Button>
  )
}