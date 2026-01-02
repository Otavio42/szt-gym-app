'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut(); // log the user out
      router.push('/login');         // redirect to login page
    };

    signOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-700 text-lg">Logging out...</p>
    </div>
  );
}
