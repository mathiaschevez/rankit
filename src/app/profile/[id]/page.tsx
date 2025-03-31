import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { fetchUserRankings } from "../../api/rankings";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, Edit, ImagePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timeSince } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser } from "@/app/api/users";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const userId = (await params).id;
  const user = await (await clerkClient()).users.getUser(userId);
  const isOwnProfile = (await currentUser())?.id === userId;

  const userImage = user?.hasImage ? user.imageUrl : '';
  const fallbackInitials = user?.firstName?.charAt(0) ?? '' + user?.lastName?.charAt(0) ?? '';

  const userDetails = await fetchUser(userId);
  const userRankings = await fetchUserRankings(userId);

  return (
    <div className="dark min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <BackButton text="Back" />
      </div>
      {/* Banner */}
      <div className="relative">
        <div className="h-48 w-full overflow-hidden bg-gray-800 sm:h-64 md:h-80">
          {userImage ? (
            <Image
              src={userImage}
              alt="Profile banner"
              className="h-full w-full object-cover"
              fill
            />
          ) : (
            <ImagePlus className="h-5 w-5 text-gray-400" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-60"></div>
        </div>
      </div>
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
          <div className="ml-36 flex flex-col justify-between sm:ml-40 sm:flex-row sm:items-end">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold sm:text-3xl">{user?.fullName}</h1>
              <p className="text-gray-400">@{user.username}</p>
            </div>
            {isOwnProfile && (
              <Link href={`/profile/${userId}/edit`}>
                <Button className="bg-[#005CA3] hover:bg-[#004a82]">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="mb-8 mt-6">
          <p className="mb-4 text-gray-300">{userDetails?.bio ?? ''}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{userRankings.length}</span>
            <span className="text-gray-400">Rankings</span>
          </div>
          {/* <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{userDetails}</span>
            <span className="text-gray-400">Contributions</span>
          </div> */}
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{userDetails?.followers ?? 0}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1 font-semibold text-white">{userDetails?.following ?? 0}</span>
            <span className="text-gray-400">Following</span>
          </div>
        </div>
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
          <TabsContent value="created">
            <h2 className="mb-4 text-xl font-semibold">Rankings Created by {isOwnProfile ? "You" : user.fullName}</h2>
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
                        fill
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