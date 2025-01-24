import { getRankings } from '@/server/queries'
import React from 'react'

export default async function Rankings() {
  const rankings = await getRankings();

  return rankings ? rankings.map((ranking) =>
    <div
      key={ranking.id}
      className='border border-white'
    >
      {ranking.name}
    </div>
  ) : <></>
}