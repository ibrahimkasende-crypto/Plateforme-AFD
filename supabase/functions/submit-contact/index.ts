// Deploy with Supabase CLI. Secrets are supplied by the platform runtime:
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must never be exposed to Vite.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') ?? '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  honeypot?: unknown;
};

function asText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Méthode non autorisée.' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const payload = await request.json() as ContactPayload;
    const name = asText(payload.name, 200);
    const email = asText(payload.email, 254).toLowerCase();
    const subject = asText(payload.subject, 200);
    const message = asText(payload.message, 5000);
    if (asText(payload.honeypot, 100)) return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(JSON.stringify({ error: 'Veuillez vérifier les informations saisies.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const url = Deno.env.get('SUPABASE_URL');
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceRole) throw new Error('Configuration serveur incomplète.');
    const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
    const { error } = await supabase.from('messages').insert({ name, email, subject: subject || null, message, status: 'unread' });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Le message ne peut pas être envoyé pour le moment.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
