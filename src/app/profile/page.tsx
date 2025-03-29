import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUserRankings } from "../api/rankings";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timeSince } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilePage() {
  const user = await currentUser();
  const userImage = user?.hasImage ? user.imageUrl : '';
  const fallbackInitials = user?.firstName?.charAt(0) ?? '' + user?.lastName?.charAt(0) ?? '';
  // const userBio = (await fetchUser(user?.externalId ?? ''))?.bio ?? undefined;
  const userRankings = await fetchUserRankings(user?.externalId ?? '');

  return (
    <div className="dark min-h-screen bg-gray-950 text-gray-100">
      {/* Back button */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Button variant="ghost" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Banner */}
      <div className="relative">
        <div className="h-48 w-full overflow-hidden bg-gray-800 sm:h-64 md:h-80">
          <Image
            src={userImage}
            alt="Profile banner"
            className="h-full w-full object-cover"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-60"></div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative -mt-20 mb-6">
          {/* Profile Image */}
          <div className="absolute -top-16 left-0 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-950 sm:h-36 sm:w-36">
            <Avatar className="h-full w-full">
              <AvatarImage src={userImage} alt={user?.fullName ?? fallbackInitials} className="h-full w-full object-cover" />
              <AvatarFallback className="bg-[#003b69] text-2xl text-white">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info and Stats */}
          {/* <div className="ml-36 flex flex-col justify-between sm:ml-40 sm:flex-row sm:items-end">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold sm:text-3xl">{user?.fullName}</h1>
              <p className="text-gray-400">@{user.username}</p>
            </div>
            {isOwnProfile && (
              <Button className="bg-[#005CA3] hover:bg-[#004a82]">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div> */}
        </div>
        {/* Bio and Additional Info */}
        {/* <div className="mb-8 mt-6">
          <p className="mb-4 text-gray-300">{user.bio}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {user.location && (
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {user.location}
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Joined {user.joinedDate}
            </div>
          </div>
        </div> */}
        {/* Stats - Compact Version */}
        {/* <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{user.stats.rankings}</span>
            <span className="text-gray-400">Rankings</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{user.stats.contributions}</span>
            <span className="text-gray-400">Contributions</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{user.stats.followers}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{user.stats.following}</span>
            <span className="text-gray-400">Following</span>
          </div>
        </div> */}
        <div className="mb-6 flex justify-center">
          <SignOutButton>
            <Button className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
        {/* Rankings Tabs */}
        <Tabs defaultValue="created" className="mb-12">
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="created" className="data-[state=active]:bg-[#005CA3] data-[state=active]:text-white">
              Created Rankings
            </TabsTrigger>
            <TabsTrigger
              value="contributed"
              className="data-[state=active]:bg-[#005CA3] data-[state=active]:text-white"
            >
              Contributed Rankings
            </TabsTrigger>
          </TabsList>

          {/* Created Rankings Tab */}
          <TabsContent value="created">
            {/* <h2 className="mb-4 text-xl font-semibold">Rankings Created by {isOwnProfile ? "You" : user.name}</h2> */}

            {userRankings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userRankings.map((ranking) => (
                  <div
                    key={ranking._id}
                    className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all hover:border-[#005CA3]/50 hover:shadow-md hover:shadow-[#005CA3]/10"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
                      <Image
                        src={ranking.coverImageUrl}
                        alt={ranking.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold text-gray-100">{ranking.title}</h3>
                        {ranking.collaborative && <Badge variant="blue">Collaborative</Badge>}
                      </div>
                      <p className="text-sm text-gray-400">{timeSince(ranking._id)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
                <p className="text-gray-400">No rankings created yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Contributed Rankings Tab */}
          <TabsContent value="contributed">
            {/* <h2 className="mb-4 text-xl font-semibold">
              Rankings {isOwnProfile ? "You've" : `${user.name} Has`} Contributed To
            </h2> */}

            {/* {contributedRankings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {contributedRankings.map((ranking) => (
                  <div
                    key={ranking.id}
                    className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all hover:border-[#005CA3]/50 hover:shadow-md hover:shadow-[#005CA3]/10"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
                      <img
                        src={ranking.image || "/placeholder.svg"}
                        alt={ranking.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold text-gray-100">{ranking.title}</h3>
                        {ranking.collaborative && <Badge variant="blue">Collaborative</Badge>}
                      </div>
                      <p className="text-sm text-gray-400">{ranking.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
                <p className="text-gray-400">No contributions yet.</p>
              </div>
            )} */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}