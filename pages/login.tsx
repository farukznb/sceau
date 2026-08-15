import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      // In production, use secure httpOnly cookies (server-set)
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-1">Se connecter</h1>
        <p className="text-sm text-gray-500 mb-6">Accédez à votre espace Marque / Influenceur</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <span>Ou avec </span>
          <button
            onClick={() => (window.location.href = '/api/auth/oauth?provider=instagram')}
            className="ml-2 underline"
          >
            Instagram
          </button>
          <span className="mx-1">·</span>
          <button
            onClick={() => (window.location.href = '/api/auth/oauth?provider=tiktok')}
            className="underline"
          >
            TikTok
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          En continuant, vous acceptez les CGU et la Politique de confidentialité.
        </p>
      </div>
    </div>
  );
}
