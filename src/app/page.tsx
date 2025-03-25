import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { fetchRankings } from "./api/rankings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rankings = await fetchRankings();

  return (
    <div className="p-4">
      <Header text='Rankings' />
      <div className="flex flex-wrap items-center justify-center md:justify-normal w-full gap-4">
        {rankings.map((ranking) =>
          <Link
            key={ranking._id}
            href={`/ranking/${ranking._id}`}
          >
            <Card className="flex flex-col border-2 w-[300px] h-[330px] p-4 gap-4 items-center justify-between">
              {ranking.coverImageUrl && <Image
                alt={ranking.title}
                className="rounded-md h-[200px] w-[250px]"
                src={ranking.coverImageUrl}
                width={250}
                height={200}
              />}
              <div className="w-full">
                <div className="font-bold text-xl">{ranking.title}</div>
                {ranking.collaborative && <i className="text-blue-500">Collaborative</i>}
              </div>
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