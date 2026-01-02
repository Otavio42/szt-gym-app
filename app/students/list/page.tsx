'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  membership_type: string;
  belt: string;
  active: boolean;
  start_date: string;
  notes: string | null;
}

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  // --- SESSION CHECK ---
  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch students
      const { data, error } = await supabase
        .from('Students')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setStudents(data);
      }

      setLoading(false);
    };

    checkSessionAndFetch();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading students...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Student List</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Belt</th>
              <th className="px-4 py-2 text-left">Membership</th>
              <th className="px-4 py-2 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                    <Link href={`/students/${s.id}`} className="text-blue-600 hover:underline">
                    {s.first_name} {s.last_name}
                    </Link>
                </td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone || '-'}</td>
                <td className="px-4 py-2">{s.belt}</td>
                <td className="px-4 py-2">{s.membership_type}</td>
                <td className="px-4 py-2">{s.active ? 'Yes' : 'No'}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
