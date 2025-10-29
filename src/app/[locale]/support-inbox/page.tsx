import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SupportInboxPage from '@/components/SupportChat/SupportInboxPage';

export default async function SupportInbox() {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    console.log('[SupportInbox] No session found, redirecting to login');
    redirect('/login');
  }

  // Check if user is instructor or admin
  const userRole = (session.user as any)?.role;
  console.log('[SupportInbox] User role:', userRole);
  console.log('[SupportInbox] Full session:', JSON.stringify(session.user, null, 2));

  if (userRole !== 'instructor' && userRole !== 'admin') {
    console.log('[SupportInbox] Access denied. User role is not instructor or admin. Redirecting...');
    redirect('/my-learning');
  }

  console.log('[SupportInbox] Access granted. Rendering SupportInboxPage');
  return <SupportInboxPage />;
}
