
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, ImagePlus, X, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { SignOutButton } from "@clerk/nextjs"
import { MongoUser } from "@/redux/user"

export default function EditProfileForm({ userDetails }: { userDetails: MongoUser }) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // Form state
  const [username, setUsername] = useState(userDetails.userName ?? '')
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Original values for comparison
  // const [originalUsername, setOriginalUsername] = useState("")

  // Username validation
  // const [usernameError, setUsernameError] = useState("")
  // const [usernameAvailable, setUsernameAvailable] = useState(true)
  // const [checkingUsername, setCheckingUsername] = useState(false)

  // Refs for file inputs
  const bannerFileInputRef = useRef<HTMLInputElement>(null)
  const profileFileInputRef = useRef<HTMLInputElement>(null)

  // Handle banner image upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle profile image upload
  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Check username availability
  // const checkUsername = (username: string) => {

  // }

  // Handle username change with debounce
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!userDetails.displayName.trim()) {
      toast({
        title: "Error",
        description: "Display name is required",
        variant: "destructive",
      })
      return
    }

    // if (!username.trim() || !usernameAvailable) {
    //   toast({
    //     title: "Error",
    //     description: usernameError || "Please enter a valid username",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // Simulate saving
    setSaving(true)

    // In a real app, you would send this data to your API
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })

      // Update original username after successful save
      // setOriginalUsername(username)
    }, 1500)
  }

  return (
    <div className="dark min-h-screen bg-gray-950 text-gray-100">
      {/* Back button */}
      <div className="mx-auto max-w-3xl px-4 py-4">
        <Button variant="ghost" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="banner-image">Banner Image</Label>
            <div className="flex flex-col items-center justify-center">
              {bannerImage ? (
                <div className="relative mb-4 w-full">
                  <div className="aspect-[3/1] w-full overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src={bannerImage || "/placeholder.svg"}
                      alt="Banner preview"
                      className="h-full w-full object-cover"
                      fill
                    />
                  </div>
                  <div className="absolute right-2 top-2 flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-700 bg-gray-800/80 text-white hover:bg-gray-700"
                      onClick={() => bannerFileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setBannerImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="mb-4 flex aspect-[3/1] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 p-6 transition-colors hover:border-[#005CA3] hover:bg-gray-800"
                >
                  <ImagePlus className="mb-2 h-10 w-10 text-gray-500" />
                  <p className="text-center text-sm text-gray-400">
                    Click to upload a banner image
                    <br />
                    <span className="text-xs">PNG, JPG or GIF, 1200×400 recommended</span>
                  </p>
                </div>
              )}
              <input
                ref={bannerFileInputRef}
                id="banner-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </div>
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Image</Label>
            <div className="flex items-center space-x-4">
              {profileImage ? (
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-gray-800">
                    <AvatarImage src={profileImage} alt="Profile preview" className="object-cover" />
                    <AvatarFallback className="bg-[#003b69] text-xl text-white">
                      {/* {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")} */}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-2 -top-2 flex space-x-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full border-gray-700 bg-gray-800/80 text-white hover:bg-gray-700"
                      onClick={() => profileFileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => setProfileImage(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 w-24 rounded-full border-2 border-dashed border-gray-700 bg-gray-800/50"
                  onClick={() => profileFileInputRef.current?.click()}
                >
                  <ImagePlus className="h-8 w-8 text-gray-500" />
                </Button>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-400">Upload a profile picture. Square images work best.</p>
              </div>
              <input
                ref={profileFileInputRef}
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileUpload}
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center justify-between">
              <span>Username</span>
              {/* {checkingUsername ? (
                <span className="flex items-center text-xs text-gray-400">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Checking availability...
                </span>
              ) : username && username !== originalUsername ? (
                usernameAvailable ? (
                  <span className="flex items-center text-xs text-green-500">
                    <Check className="mr-1 h-3 w-3" />
                    Username available
                  </span>
                ) : (
                  <span className="text-xs text-red-500">{usernameError}</span>
                )
              ) : null} */}
            </Label>
            <div className="flex items-center">
              <span className="flex h-10 items-center rounded-l-md border border-r-0 border-gray-700 bg-gray-800 px-3 text-sm text-gray-400">
                @
              </span>
              <Input
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="username"
                className="rounded-l-none border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                required
              />
            </div>
            <p className="text-xs text-gray-400">This will be your unique identifier on the platform.</p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself"
              className="min-h-[100px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your location (optional)"
              className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#005CA3] hover:bg-[#004a82]"
              // disabled={saving || checkingUsername || (username !== originalUsername && !usernameAvailable)}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
      <div className="mb-6 flex justify-center">
        <SignOutButton>
          <Button className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700">
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  )
}

