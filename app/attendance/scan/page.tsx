'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '@/lib/supabaseClient';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
}

export default function ScanQRCodePage() {
  const qrRegionId = 'qr-scanner';
  const html5QrcodeScanner = useRef<Html5Qrcode | null>(null);

  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    html5QrcodeScanner.current = new Html5Qrcode(qrRegionId);

    const config = { fps: 10, qrbox: 250 };

    html5QrcodeScanner.current
      .start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          setScannedCode(decodedText);

          // Stop scanning
          html5QrcodeScanner.current?.stop().catch(console.error);

          // Fetch student from Supabase
          const { data, error } = await supabase
            .from('Students')
            .select('id, first_name, last_name')
            .eq('attendance_token', decodedText)
            .single();

          if (error) {
            setErrorMsg('Student not found!');
            setStudent(null);
          } else {
            setStudent(data);
            setErrorMsg('');
            // TODO: register attendance automatically
            // await supabase.from('Attendance').insert({ student_id: data.id, date: new Date() });
          }
        },
        (errorMessage) => {
          console.log('QR scan error:', errorMessage);
        }
      )
      .catch((err) => console.error('Unable to start scanning:', err));

    return () => {
      html5QrcodeScanner.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Scan Student QR Code</h1>

      <div
        id={qrRegionId}
        className="w-full max-w-md aspect-square bg-white rounded shadow-md"
      />

      {scannedCode && !student && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">
          {errorMsg || 'Looking up student...'}
        </div>
      )}

      {student && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded text-center">
          Student Found! <br />
          <strong>
            {student.first_name} {student.last_name}
          </strong>
        </div>
      )}
    </div>
  );
}
