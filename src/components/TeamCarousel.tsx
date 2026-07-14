// =============================================================
// TeamCarousel.tsx — Carousel automatique « Notre Équipe de Direction »
// Palette AFD : #36A2E0 (afd-400), #1F6FA8 (afd-600), #EAF6FD (afd-50)
//
// Fonctionnalités :
//   - Défilement continu de droite vers la gauche (CSS animation)
//   - Pause automatique au survol de la souris
//   - Reprise automatique à la sortie du survol
//   - Responsive : 1 carte (mobile) → 2 cartes (tablette) → 3-4 cartes (desktop)
//   - Effet fondu sur les bords gauche et droit
//   - Duplication des cartes pour un rendu infini sans clignotement
//   - S'adapte automatiquement au nombre d'enregistrements dans membres_equipe
// =============================================================

import { useRef } from 'react';
import { TeamMember } from '../types';

// ─── Props du composant ────────────────────────────────────────
interface TeamCarouselProps {
  /** Liste des membres récupérée depuis membres_equipe */
  members: TeamMember[];
}

// ─── Fonction utilitaire : dégradé d'avatar selon le genre ────
function avatarGradient(gender: string): string {
  return gender === 'femme'
    ? 'from-afd-400 to-afd-600'   // bleu clair → bleu foncé
    : 'from-afd-500 to-afd-700';  // bleu moyen → bleu très foncé
}

// ─── Composant principal ───────────────────────────────────────
export default function TeamCarousel({ members }: TeamCarouselProps) {
  // Référence sur la piste de défilement pour contrôler l'animation
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplication de la liste pour créer un défilement infini fluide :
  // On concatène la liste deux fois afin que la boucle ne montre
  // jamais un espace vide à la fin de la première passe.
  const displayedMembers = [...members, ...members];

  // ── Pause au survol ────────────────────────────────────────
  function handleMouseEnter() {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
    }
  }

  // ── Reprise à la sortie de la souris ──────────────────────
  function handleMouseLeave() {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'running';
    }
  }

  // ── Cas où l'équipe est vide : pas de rendu ────────────────
  if (members.length === 0) return null;

  return (
    // Conteneur principal avec effet de fondu sur les bords
    <div
      className="relative w-full overflow-hidden team-carousel-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Carousel de l'équipe de direction"
    >
      {/* ── Masque de fondu gauche — effet premium ────────────── */}
      <div className="team-carousel-fade team-carousel-fade--left" aria-hidden="true" />

      {/* ── Piste de défilement infinie ───────────────────────── */}
      <div
        ref={trackRef}
        className="team-carousel-track"
        // La durée dépend du nombre de membres pour garder
        // une vitesse perçue constante quelle que soit la taille de l'équipe
        style={{ animationDuration: `${members.length * 6}s` }}
      >
        {displayedMembers.map((member, index) => (
          <MemberCard
            key={`${member.id}-${index}`}
            member={member}
          />
        ))}
      </div>

      {/* ── Masque de fondu droit — effet premium ─────────────── */}
      <div className="team-carousel-fade team-carousel-fade--right" aria-hidden="true" />
    </div>
  );
}

// ─── Carte individuelle d'un membre ───────────────────────────
interface MemberCardProps {
  member: TeamMember;
}

function MemberCard({ member }: MemberCardProps) {
  // Initiale du nom pour l'avatar par défaut
  const initiale = member.name.charAt(0).toUpperCase();

  return (
    <article className="team-carousel-card group">
      {/* ── Photo ou avatar généré ──────────────────────────── */}
      <div className="team-carousel-card__avatar-wrapper">
        {member.photo_url ? (
          // Photo réelle si disponible dans membres_equipe
          <img
            src={member.photo_url}
            alt={`Photo de ${member.name}`}
            className="team-carousel-card__photo"
            loading="lazy"
          />
        ) : (
          // Avatar avec initiale et dégradé AFD si pas de photo
          <div
            className={`team-carousel-card__avatar bg-gradient-to-br ${avatarGradient(member.gender)}`}
            aria-label={`Avatar de ${member.name}`}
          >
            <span className="team-carousel-card__initiale">{initiale}</span>
          </div>
        )}
      </div>

      {/* ── Informations du membre ──────────────────────────── */}
      <div className="team-carousel-card__body">
        {/* Nom */}
        <h3 className="team-carousel-card__name">{member.name}</h3>

        {/* Fonction / Rôle */}
        <p className="team-carousel-card__role">{member.role}</p>

        {/* Description courte */}
        {member.description && (
          <p className="team-carousel-card__description">{member.description}</p>
        )}

        {/* Badge de genre — cohérent avec la palette AFD */}
        <span
          className={`team-carousel-card__badge ${
            member.gender === 'femme'
              ? 'team-carousel-card__badge--femme'
              : 'team-carousel-card__badge--homme'
          }`}
          aria-label={`Genre : ${member.gender}`}
        >
          {member.gender === 'femme' ? '♀ Femme' : '♂ Homme'}
        </span>
      </div>
    </article>
  );
}
