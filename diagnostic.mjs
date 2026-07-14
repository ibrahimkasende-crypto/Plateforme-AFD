// Diagnostic sur le bon projet Supabase (celui du .env)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://uazdlascrmkwhylwwqrx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhemRsYXNjcm1rd2h5bHd3cXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTQ0NjcsImV4cCI6MjA4NzAzMDQ2N30.TdiAy-S7I3EOiX7BdYQqvsRUqzjlMRmYkkM905zJS3I'
);

const tables = [
    'programmes', 'projets', 'actualites', 'galerie',
    'membres_equipe', 'parametres_site', 'partenaires',
    'membres', 'dons', 'messages', 'clusters',
    // Essayons aussi les anciens noms au cas où
    'programs', 'projects', 'news', 'gallery', 'partners', 'site_settings', 'team_members'
];

console.log('=== Diagnostic projet: uazdlascrmkwhylwwqrx ===\n');

for (const table of tables) {
    const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

    if (error) {
        console.log(`❌ ${table.padEnd(22)} ${error.code} — ${error.message}`);
    } else {
        console.log(`✅ ${table.padEnd(22)} ${count ?? data?.length} ligne(s)  | 1er enreg: ${JSON.stringify(data?.[0])?.slice(0, 60) || 'vide'}`);
    }
}

console.log('\nDiagnostic terminé.');
