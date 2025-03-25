import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "../api/users";
import { fetchUserRankings } from "../api/rankings";
import { SignOutButton } from "@clerk/nextjs";

export default async function ProfilePage() {
  const user = await currentUser();
  const userImage = user?.hasImage ? user.imageUrl : undefined;
  const fallbackInitials = user?.firstName?.charAt(0) ?? '' + user?.lastName?.charAt(0) ?? '';
  const userBio = (await fetchUser(user?.externalId ?? ''))?.bio ?? undefined;
  const userRankings = await fetchUserRankings(user?.externalId ?? '');

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={userImage} />
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{user?.firstName}</h1>
        {userBio && <p>{userBio}</p>}
        <div className="ml-auto">
          <SignOutButton />
        </div>
      </div>
      <div>
        {userRankings.map(ranking => (
          <div key={ranking._id}>{ranking.title}</div>
        ))}
      </div>
    </div>
  )
}