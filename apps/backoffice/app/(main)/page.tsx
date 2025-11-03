import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>
  }
  const user = await currentUser()

  // Use `user` to render user details or create UI elements
  return <div>Welcome, {user?.firstName ?? 'Guest'}!</div>
}