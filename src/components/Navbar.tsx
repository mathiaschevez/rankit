import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 px-4 py-3">
      <div className="mx-auto flex items-center justify-between">
        <Link href='/'><span className="text-xl font-bold text-[#005CA3]">rankit</span></Link>
        <div className='flex self-end h-full items-center gap-6'>
          <SignedIn>
            <Link href='/create'>
              <Button className="bg-[#005CA3] hover:bg-[#004a82]">
                <Plus className="mr-1 h-4 w-4" />
                Create
              </Button>
            </Link>
            <button className="bg-[#005CA3] hover:bg-[#004a82] p-2 rounded-lg">
              <BellIcon className='size-6' />
            </button>
            <ProfileLink />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <div className="bg-blue-800 hover:bg-blue-700  md:py-2 md:px-4 py-1 px-2 md:text-lg text-sm rounded text-white cursor-pointer">Sign In</div>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

async function ProfileLink() {
  const user = await currentUser();
  const userImage = user?.hasImage ? user.imageUrl : undefined;
  const fallbackInitials = user?.firstName?.charAt(0) ?? '' + user?.lastName?.charAt(0) ?? '';

  return (
    <Link href='/profile' className=''>
      <Avatar>
        <AvatarImage src={userImage} />
        <AvatarFallback>{fallbackInitials}</AvatarFallback>
      </Avatar>
    </Link>
  )
}

{/* <UserButton
  appearance={{
    elements: {
      userButtonAvatarBox: "w-9 h-9"
    }
  }}
/> */}
