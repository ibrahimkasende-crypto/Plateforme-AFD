// Script historique retiré de l'exécution.
// Les migrations versionnées dans supabase/migrations sont l'unique méthode
// autorisée. Aucune URL ni clé ne doit être inscrite dans ce fichier.
const supabase = null;

async function migrate() {
    throw new Error('migrate.mjs est désactivé : appliquez les migrations Supabase versionnées après sauvegarde et validation du schéma.');
    console.log('🚀 Démarrage de la migration AFD...\n');

    // 1. site_settings
    console.log('📌 1. Table site_settings...');
    const { error: e1 } = await supabase.from('site_settings').upsert([
        { key: 'founded_year', value: '2019' },
        { key: 'experience_years', value: '7' },
        { key: 'active_projects', value: '10' },
        { key: 'provinces_count', value: '12' },
        { key: 'beneficiaries', value: '50000' },
        { key: 'address', value: 'Kinshasa Songololo 145' },
    ], { onConflict: 'key' });
    if (e1) console.error('  ❌ Erreur site_settings:', e1.message);
    else console.log('  ✅ site_settings OK');

    // 2. team_members
    console.log('📌 2. Table team_members...');
    const { error: e2 } = await supabase.from('team_members').upsert([
        { name: 'Marie Kabamba', role: 'Présidente', description: 'Leader visionnaire avec 20 ans d\'expérience dans le développement communautaire et la défense des droits des femmes.', gender: 'femme', order: 1 },
        { name: 'Jeanne Mukendi', role: 'Directrice Exécutive', description: 'Experte en gestion de projets humanitaires et développement durable en contexte de crise.', gender: 'femme', order: 2 },
        { name: 'Grace Tshilombo', role: 'Coordinatrice des Programmes', description: 'Spécialiste en santé maternelle et infantile avec 12 ans d\'expérience terrain.', gender: 'femme', order: 3 },
        { name: 'Espérance Nsimba', role: 'Responsable Communication', description: 'Journaliste et militante pour les droits des femmes et l\'égalité des genres.', gender: 'femme', order: 4 },
        { name: 'Patience Kalala', role: 'Coordinatrice VBG/PSA/HS', description: 'Experte en protection et réponse aux violences basées sur le genre dans les zones de conflit.', gender: 'femme', order: 5 },
        { name: 'Claudine Mwanza', role: 'Responsable Finances', description: 'Comptable certifiée avec expertise en gestion financière des ONG humanitaires.', gender: 'femme', order: 6 },
        { name: 'Yvette Bolamba', role: 'Coordinatrice WASH', description: 'Ingénieure sanitaire spécialisée dans les projets eau, hygiène et assainissement.', gender: 'femme', order: 7 },
        { name: 'Solange Luboya', role: 'Responsable Plaidoyer', description: 'Avocate engagée dans la défense des droits des femmes et des enfants en RDC.', gender: 'femme', order: 8 },
        { name: 'Anastasie Ngandu', role: 'Coordinatrice Éducation', description: 'Pédagogue et spécialiste en alphabétisation et scolarisation des filles en milieu rural.', gender: 'femme', order: 9 },
        { name: 'Denise Kitenge', role: 'Responsable Urgences Humanitaires', description: 'Coordinatrice humanitaire avec 10 ans d\'expérience dans la réponse aux crises en RDC.', gender: 'femme', order: 10 },
        { name: 'Rosalie Mutombo', role: 'Coordinatrice Cluster Nutrition', description: 'Nutritionniste engagée dans la lutte contre la malnutrition infantile en zones d\'urgence.', gender: 'femme', order: 11 },
        { name: 'Jean-Paul Lukusa', role: 'Responsable Logistique', description: 'Expert logistique avec expérience dans les opérations humanitaires en zones reculées.', gender: 'homme', order: 12 },
        { name: 'Pierre Mbuyi', role: 'Responsable IT', description: 'Ingénieur informatique assurant la transformation numérique de l\'organisation.', gender: 'homme', order: 13 },
    ]);
    if (e2) console.error('  ❌ Erreur team_members:', e2.message, '(table peut ne pas encore exister)');
    else console.log('  ✅ team_members OK');

    // 3. partners
    console.log('📌 3. Table partners...');
    const { error: e3 } = await supabase.from('partners').upsert([
        { name: 'UNICEF', category: 'international', order: 1 },
        { name: 'ONU Femmes', category: 'international', order: 2 },
        { name: 'USAID', category: 'international', order: 3 },
        { name: 'Union Européenne', category: 'international', order: 4 },
        { name: 'OMS', category: 'international', order: 5 },
        { name: 'UNHCR', category: 'international', order: 6 },
        { name: 'Gouvernement RDC', category: 'gouvernement', order: 7 },
        { name: 'Centre Carter', category: 'ong', order: 8 },
        { name: 'Expertise France', category: 'international', order: 9 },
    ]);
    if (e3) console.error('  ❌ Erreur partners:', e3.message, '(table peut ne pas encore exister)');
    else console.log('  ✅ partners OK');

    // 4. clusters
    console.log('📌 4. Table clusters...');
    const { error: e4 } = await supabase.from('clusters').upsert([
        { name: 'Cluster Protection', type: 'cluster', description: 'Coordination des interventions de protection des civils, des femmes et des enfants dans les zones de crise.', icon: 'shield', order: 1 },
        { name: 'Cluster Santé', type: 'cluster', description: 'Coordination des services de santé d\'urgence, y compris la santé reproductive et maternelle.', icon: 'heart-pulse', order: 2 },
        { name: 'Cluster Éducation', type: 'cluster', description: 'Coordination des activités d\'éducation en situations d\'urgence et de maintien de la scolarisation.', icon: 'book-open', order: 3 },
        { name: 'Cluster WASH', type: 'cluster', description: 'Coordination des interventions eau, hygiène et assainissement dans les zones affectées.', icon: 'droplet', order: 4 },
        { name: 'Cluster Nutrition', type: 'cluster', description: 'Coordination de la réponse nutritionnelle pour lutter contre la malnutrition aiguë sévère.', icon: 'apple', order: 5 },
        { name: 'GT Santé Sexuelle et Reproductive (SSR)', type: 'working_group', description: 'Groupe de travail assurant l\'accès aux soins de santé sexuelle et reproductive en situation d\'urgence.', icon: 'activity', order: 6 },
        { name: 'GT Violences Basées sur le Genre (VBG)', type: 'working_group', description: 'Groupe de travail coordonnant la prévention et la réponse aux violences basées sur le genre.', icon: 'shield-alert', order: 7 },
        { name: 'GT Logistique', type: 'working_group', description: 'Groupe de travail assurant la coordination logistique pour la livraison de l\'aide humanitaire.', icon: 'truck', order: 8 },
    ]);
    if (e4) console.error('  ❌ Erreur clusters:', e4.message, '(table peut ne pas encore exister)');
    else console.log('  ✅ clusters OK');

    // 5. Update VBG program
    console.log('📌 5. Mise à jour programme VBG...');
    const { error: e5 } = await supabase
        .from('programs')
        .update({
            title: 'Lutte contre les violences basées sur le genre (VBG/PSA/HS)',
            description: 'Prévenir et répondre aux violences sexuelles, psychosociales et basées sur le genre faites aux femmes et aux filles.',
        })
        .eq('slug', 'lutte-violences-genre');
    if (e5) console.error('  ❌ Erreur VBG update:', e5.message);
    else console.log('  ✅ Programme VBG mis à jour');

    // 6. Add new programs
    console.log('📌 6. Ajout des nouveaux programmes urgences...');
    const newPrograms = [
        {
            title: 'Préparation et réponse aux urgences sanitaires',
            slug: 'urgences-sanitaires',
            description: 'Préparer et répondre aux épidémies et pandémies affectant les communautés vulnérables.',
            long_description: 'Ce programme renforce la capacité de préparation et de réponse rapide aux urgences sanitaires incluant les épidémies (Ebola, choléra, rougeole, mpox) et pandémies. Il inclut la surveillance épidémiologique, la vaccination d\'urgence, la gestion des cas, et la communication des risques auprès des communautés.',
            icon: 'activity',
            color: 'red',
            order: 8,
        },
        {
            title: 'Renforcement des capacités du système de santé',
            slug: 'renforcement-systeme-sante',
            description: 'Renforcer les structures de santé et former le personnel médical dans les zones de crise.',
            long_description: 'Ce programme accompagne le renforcement du système de santé par la formation des agents de santé, la réhabilitation des structures sanitaires, l\'approvisionnement en médicaments essentiels et l\'amélioration de la chaîne de froid.',
            icon: 'stethoscope',
            color: 'teal',
            order: 9,
        },
        {
            title: 'Humanisation des soins',
            slug: 'humanisation-soins',
            description: 'Promouvoir une approche centrée sur la dignité humaine dans la dispensation des soins de santé.',
            long_description: 'Ce programme œuvre pour l\'humanisation des soins de santé en favorisant le respect de la dignité des patients, l\'écoute active, la confidentialité et le soutien psychosocial. Il forme les soignants aux approches centrées sur la personne et au respect des droits des patients.',
            icon: 'hand-heart',
            color: 'purple',
            order: 10,
        },
    ];

    for (const prog of newPrograms) {
        const { error } = await supabase.from('programs').upsert(prog, { onConflict: 'slug' });
        if (error) console.error(`  ❌ Erreur programme "${prog.title}":`, error.message);
        else console.log(`  ✅ Programme "${prog.title}" OK`);
    }

    console.log('\n🏁 Migration terminée !');
    console.log('\n⚠️  IMPORTANT: Les tables site_settings, team_members, partners, clusters');
    console.log('   doivent être créées manuellement via le SQL Editor du dashboard Supabase.');
    console.log('   Le fichier SQL est disponible dans : supabase/migrations/20260223_update_afd_tables.sql');
}

migrate().catch(console.error);
