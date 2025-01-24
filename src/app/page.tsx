import { getRankings } from "@/server/queries";

export default async function Home() {
  const rankings = await getRankings();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <NavBar />
      {rankings.map((ranking) =>
        <div
          key={ranking.id}
          className='border border-white'
        >
          {ranking.name}
        </div>)
      }
    </div>
  );
}

function NavBar() {
  return (
    <div>Nav</div>
  )
}