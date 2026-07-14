import { useEffect } from 'react';
import { supabase } from './lib/supabase';

export function testSupabase() {
  async function run() {
    const { data: projs, error: e1 } = await supabase.from('projets').select('*').eq('active', true);
    console.log('Test Projets:', { projs, e1 });
    const { data: prog, error: e2 } = await supabase.from('programmes').select('*').eq('active', true);
    console.log('Test Programmes:', { prog, e2 });
    const { data: act, error: e3 } = await supabase.from('actualites').select('*').eq('published', true);
    console.log('Test Actualites:', { act, e3 });
  }
  run();
}
