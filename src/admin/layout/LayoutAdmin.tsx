// =============================================================
// LayoutAdmin — Mise en page commune de l'espace administrateur
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
// Le rouge est conservé pour le bouton de déconnexion (signalétique).
// =============================================================

import { ReactNode } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

interface PropsLayoutAdmin {
    /** Contenu de la page à afficher dans la zone principale */
    children: ReactNode;
}

/**
 * LayoutAdmin — Composant de mise en page pour l'espace administrateur.
 *
 * Structure :
 * ┌─────────────────────────────────────────┐
 * │  Barre latérale  │  En-tête             │
 * │  (navigation)    │  ──────────────────  │
 * │                  │  Contenu de la page  │
 * └─────────────────────────────────────────┘
 */
export default function LayoutAdmin({ children }: PropsLayoutAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
}
