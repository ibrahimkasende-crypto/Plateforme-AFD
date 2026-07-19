export function integrityLabel(status: string | null | undefined): string {
  switch (status) {
    case "cryptographically_verified":
      return "Intégrité cryptographique vérifiée";
    case "signature_valid_but_untrusted":
      return "Signature numérique vérifiée (certificat non de confiance)";
    case "signature_invalid":
      return "Signature numérique invalide";
    case "modified_after_signature":
      return "Document modifié après signature";
    case "unsigned":
      return "Document non signé";
    case "document_non_verifie":
      return "Document non vérifié";
    case "document_necessitant_verification":
      return "Document nécessitant une vérification";
    case "document_suspect":
      return "Document suspect";
    case "document_rejete":
      return "Document rejeté";
    case "verification_unavailable":
    default:
      return "Vérification d’intégrité indisponible";
  }
}
