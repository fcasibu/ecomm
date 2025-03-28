import { runPostLogin } from '@/features/auth/lib/run-post-login';
import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  const user = await currentUser();

  if (user && !user.privateMetadata.onboardingCompleted) {
    await runPostLogin(user.id);
  }

  return <div>Dashboard</div>;
}
