import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { getRankings } from "@/server/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rankings = await getRankings();

  return (
    <div className="px-4">
      <Navbar />
      <Header text='Rankings' />
      <div className="flex w-full">
        {rankings.map((ranking) =>
          <Link
            key={ranking.id}
            href={`/ranking/${ranking.id}`}
          >
            <Card className="border-2 w-72 h-72 p-4">
              {ranking.title}
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