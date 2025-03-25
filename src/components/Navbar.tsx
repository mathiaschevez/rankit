import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default async function Navbar() {
  return (
    <div className="flex justify-between h-16 items-center px-4 border-b">
      <Link href='/'>Rankit</Link>
      <div className='flex self-end h-full items-center gap-6'>
        <SignedIn>
        <Link href='/create' className='py-2 px-6 bg-blue-800 hover:bg-blue-700 rounded'>Create</Link>
        <button className='bg-slate-800 hover:bg-slate-700 rounded-lg p-2'>
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
