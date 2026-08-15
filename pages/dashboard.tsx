import { signOut, useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="p-6">Loading...</p>;
  }

  if (!session) {
    return <p className="p-6">You are not signed in.</p>;
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="mb-6">Signed in as {session.user?.email}</p>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="px-4 py-2 bg-slate-900 text-white rounded-md"
      >
        Sign Out
      </button>
    </main>
  );
}
