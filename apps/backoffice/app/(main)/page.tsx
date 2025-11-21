import { auth, currentUser } from '@clerk/nextjs/server';
import { getClerkToken } from '../api/auth/action';

export default async function Page() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>
  }
  const user = await currentUser()
  const token = getClerkToken();

  // Use `user` to render user details or create UI elements
  return <div>
    <h1>Welcome, {user?.firstName ?? 'Guest'}!</h1>
    <h2>Token</h2>
    <p>{token}</p>
  </div>
}