import { getRankings } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rankings = await getRankings();

  return (
    <div className="">
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