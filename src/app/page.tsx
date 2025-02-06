import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { getRankings } from "@/server/queries";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rankings = await getRankings();

  return (
    <div className="px-4">
      <Navbar />
      <Header text='Rankings' />
      <div className="flex w-full gap-4">
        {rankings.map((ranking) =>
          <Link
            key={ranking.id}
            href={`/ranking/${ranking.id}`}
          >
            <Card className="flex flex-col justify-center border-2 w-[300px] h-[330px] p-4 gap-4 items-center">
              {ranking.coverImageUrl && <Image
                alt='coverImg'
                src={ranking.coverImageUrl}
                width={250}
                height={250}
              />}
              <div className="text-left w-full font-bold text-xl">{ranking.title}</div>
            </Card>
          </Link>)}
      </div>
    </div>
  );
}

function Header({ text }: { text: string }) {
  return (
    <div className="text-3xl font-semibold mb-4">{text}</div>
  )
}