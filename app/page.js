'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import Klarmeldt from '../components/Klarmeldt';

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!prof) {
        await supabase.auth.signOut();
        router.replace('/login');
        return;
      }

      setProfile(prof);

      if (prof.role === 'haandvaerker') {
        const { data: con } = await supabase
          .from('contractors')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setContractor(con);
      }

      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: '#F8FAFC',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #22D3EE, #3B82F6)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 14,
          }}>K</div>
          <div style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>Indlæser...</div>
        </div>
      </div>
    );
  }

  return <Klarmeldt profile={profile} contractor={contractor} onLogout={handleLogout} />;
}
