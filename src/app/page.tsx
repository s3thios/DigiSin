import { redirect } from 'next/navigation';

export default function Home() {
  // For now, redirect to the resident dashboard.
  // Authentication logic will be added later.
  redirect('/resident/dashboard');
}
