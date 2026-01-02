import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  try {
    const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const { token } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // service role key, never exposed to client
    );

    // Find student by token
    const { data: student, error } = await supabase
      .from('Students')
      .select('id, first_name, last_name')
      .eq('attendance_token', token)
      .single();

    if (error || !student) {
      return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: 'Attendance registered', student }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/register-attendance' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
