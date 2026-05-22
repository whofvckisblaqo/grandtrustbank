'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth({ redirectIfUnauthenticated = false } = {}) {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        if (redirectIfUnauthenticated) router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch session');
      const data = await res.json();
      setUser(data.user);
      setAccounts(data.accounts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [redirectIfUnauthenticated, router]);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const primaryAccount = accounts.find(a => a.isPrimary) || accounts[0] || null;

  return { user, accounts, primaryAccount, loading, error, refetch: fetchMe, logout };
}
