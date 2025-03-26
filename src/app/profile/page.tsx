import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "../api/users";
import { fetchUserRankings } from "../api/rankings";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await currentUser();
  const userImage = user?.hasImage ? user.imageUrl : undefined;
  const fallbackInitials = user?.firstName?.charAt(0) ?? '' + user?.lastName?.charAt(0) ?? '';
  const userBio = (await fetchUser(user?.externalId ?? ''))?.bio ?? undefined;
  const userRankings = await fetchUserRankings(user?.externalId ?? '');

  return (
    <div className="flex flex-col gap-8 p-4 lg:px-20">
      <div className="flex flex-col sm:flex-row gap-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={userImage} />
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{user?.firstName}</h1>
        {userBio && <p>{userBio}</p>}
        <div className="md:ml-auto">
          <SignOutButton />
        </div>
      </div>
      <div className="font-bold text-3xl">Rankings</div>
      <div>
        {userRankings.map(ranking => (
          <div key={ranking._id} className="grid grid-rows-2 md:grid-rows-1 md:flex md:justify-between">
            <div className="h-24 md:h-auto md:flex-1 flex flex-col md:justify-around">
              {ranking.collaborative && <i className="text-blue-500">Collaborative</i>}
              <div className="text-xl font-bold">{ranking.title}</div>
              <Link href={`/ranking/${ranking._id}`}>
                <Button className='bg-slate-800 hover:bg-slate-700 text-white'>View List</Button>
              </Link>
            </div>
            <div className='relative w-full h-[200px] md:h-[200px] lg:h-[300px] md:w-[300px] lg:w-[500px] row-start-1 md:mx-0 mx-auto'>
              <Image
                className="rounded-lg"
                src={ranking.coverImageUrl}
                alt={ranking.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}