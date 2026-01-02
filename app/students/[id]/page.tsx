'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import QRCode from 'react-qr-code';

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
  created_at: string;
  updated_at: string;
}

export default function StudentDetailPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const params = useParams(); // contains { id }

  useEffect(() => {
    const fetchStudent = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('Students')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        setErrorMsg(error.message);
      } else {
        setStudent(data);
      }
      setLoading(false);
    };

    fetchStudent();
  }, [params.id, router]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (errorMsg) return <p className="p-6 text-red-500">{errorMsg}</p>;
  if (!student) return <p className="p-6">Student not found</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        {student.first_name} {student.last_name}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Phone:</strong> {student.phone || '-'}
        </p>
        <p>
          <strong>Belt:</strong> {student.belt}
        </p>
        <p>
          <strong>Membership:</strong> {student.membership_type}
        </p>
        <p>
          <strong>Active:</strong> {student.active ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Start Date:</strong> {student.start_date}
        </p>
        <p>
          <strong>Notes:</strong> {student.notes || '-'}
        </p>

        <div className="pt-6 border-t text-center">
          <p className="font-semibold mb-2">Attendance QR Code</p>

          <div className="inline-block bg-white p-2">
            <QRCode
              value={student.attendance_token}
              size={160}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Scan to register attendance
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Created at: {student.created_at}, Updated at: {student.updated_at}
        </p>
      </div>
    </div>
  );
}
