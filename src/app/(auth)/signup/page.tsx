
import { redirect } from 'next/navigation';

// This page is no longer used for public signup.
// It is kept to prevent breaking any existing links, but immediately redirects.
// The new company creation page is at /admin/create-company
export default function SignupPage() {
  redirect('/login');
}
