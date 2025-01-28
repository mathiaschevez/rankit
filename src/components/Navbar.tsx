import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <div className="flex justify-between h-16 items-center">
      Rankit
      <div className='flex self-end items-center gap-6'>
        <SignedIn>
          <Link href='/create' className='py-2 px-6 bg-blue-600 rounded'>Create</Link>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9"
              }}
            }
          />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <div className="bg-blue-600 py-2 px-4 rounded text-white cursor-pointer">Sign In</div>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  )
}

