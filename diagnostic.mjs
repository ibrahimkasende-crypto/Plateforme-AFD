// Script historique désactivé : ne pas enregistrer les URL ou clés Supabase
// dans le dépôt. Utiliser les outils Supabase authentifiés localement.
const supabase = null;
throw new Error('diagnostic.mjs est désactivé. Utilisez Supabase CLI avec les variables locales non versionnées.');

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
