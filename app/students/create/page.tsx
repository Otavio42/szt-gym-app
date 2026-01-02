'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CreateStudentPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipType, setMembershipType] = useState('unlimited');
  const [belt, setBelt] = useState('white');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- SESSION CHECK ---
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login'); // redirect if not logged in
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleCreate = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstName || !lastName || !email) {
      setErrorMsg('First name, last name, and email are required.');
      return;
    }

    const { error } = await supabase.from('Students').insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        membership_type: membershipType,
        belt,
        notes: notes || null,
      },
    ]);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Student created successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMembershipType('unlimited');
      setBelt('white');
      setNotes('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Student</h1>

        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm mb-4">{successMsg}</p>}

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={membershipType}
          onChange={(e) => setMembershipType(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="unlimited">Unlimited</option>
          <option value="3x_week">3x per week</option>
          <option value="2x_week">2x per week</option>
          <option value="casual">Casual</option>
        </select>

        <select
          value={belt}
          onChange={(e) => setBelt(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="brown">Brown</option>
          <option value="black">Black</option>
          <option value="coral">Coral</option>
        </select>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Create Student
        </button>
      </div>
    </div>
  );
}
