import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

export default function Navbar() {
  return (
    <div className="flex justify-between h-16 items-center">
      Rankit
      <SignedIn>
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
  )
}

