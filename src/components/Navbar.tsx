import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'

export default function Navbar() {

  return (
    <div className="flex justify-between h-16 items-center px-4 border-b">
      <Link href='/'>Rankit</Link>
      <div className='flex self-end h-full items-center gap-6'>
        <button className='bg-slate-800 rounded-lg p-2'>
          <BellIcon className='size-6' />
        </button>
        <SignedIn>
          <Link href='/create' className='py-2 px-6 bg-blue-800 rounded'>Create</Link>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9"
              }
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <div className="bg-blue-600 md:py-2 md:px-4 py-1 px-2 md:text-lg text-sm rounded text-white cursor-pointer">Sign In</div>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  )
}

