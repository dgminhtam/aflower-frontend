import { NextResponse } from 'next/server'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function GET() {
  // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
  const { isAuthenticated } = await auth()

  // Protect the route by checking if the user is signed in
  if (!isAuthenticated) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Use `currentUser()` to get the Backend API User object
  const user = await currentUser()

  // Add your Route Handler's logic with the returned `user` object

  return NextResponse.json({ user: user }, { status: 200 })
}