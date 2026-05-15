import { redirect } from 'next/navigation';

export default function Index() {
  // Auth check happens client-side via useCurrentUser. Send everyone to /login
  // first; if signed in, /login redirects on to /dashboard.
  redirect('/login');
}
