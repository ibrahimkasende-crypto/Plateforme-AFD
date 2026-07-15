# Tests RLS à exécuter

Exécuter ces scénarios sur une instance de préproduction après les migrations Phase 4.

| Profil | Autorisé | Refusé |
| --- | --- | --- |
| Visiteur | Lecture contenu actif/publié ; soumission publique limitée | Brouillons, demandes, écritures de contenu |
| Éditeur | Contenus autorisés | Rôles, profils, paiements |
| Communication | Actualités et médias | Paramètres critiques, utilisateurs |
| Suivi-évaluation | Statistiques et rapports autorisés | Rôles et paiements |
| Finance lecture | Lecture des données financières autorisées | Modification de paiements et utilisateurs |
| Super admin | Rôles, profils, paramètres | Aucun contournement de la validation métier |

Vérifier aussi : insertions avec statut interne forcé, champs trop longs, fichiers interdits, accès aux rapports privés, URL signées expirées et tentatives d’écriture avec clé anon.
