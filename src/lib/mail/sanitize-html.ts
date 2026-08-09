/**
 * Sanitisation HTML des emails (Phase 2 lecture).
 * Bloque scripts, iframes, objets, embeds, formulaires et handlers JS.
 */
const FORBIDDEN_TAGS =
  /<\/?(?:script|iframe|object|embed|form|link|meta|base|svg|math)[^>]*>/gi;
const EVENT_HANDLERS = /\son[a-z]+\s*=\s*(['"]).*?\1/gi;
const JS_URLS = /(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi;
const DATA_SCRIPT = /(href|src)\s*=\s*(['"])\s*data:text\/html[^'"]*\2/gi;

export function sanitizeEmailHtml(html: string): string {
  return html
    .replace(FORBIDDEN_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JS_URLS, '$1="#"')
    .replace(DATA_SCRIPT, '$1="#"');
}

/** Images distantes désactivées par défaut (proxy / consentement ultérieur). */
export function stripRemoteImages(html: string): string {
  return html.replace(
    /<img\b[^>]*\bsrc\s*=\s*(['"])https?:\/\/[^'"]*\1[^>]*>/gi,
    '<span data-blocked-image="1">[Image distante bloquée]</span>',
  );
}
