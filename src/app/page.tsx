import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the resident login page by default.
  redirect('/login/resident');
}
