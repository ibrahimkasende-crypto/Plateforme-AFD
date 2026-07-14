import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TAILLE_MAX_MO = 5;
const TAILLE_MAX_OCTETS = TAILLE_MAX_MO * 1024 * 1024;

// Retire accents, espaces, et tout caractère non alphanumérique pour produire
// un nom de fichier propre et compatible URL (évite les %20 et bugs d'affichage).
function nettoyerNomFichier(nom: string): string {
    const nettoye = nom
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()
        .slice(0, 60);
    return nettoye || 'image';
}

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    dossier?: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
}

export default function ImageUploader({
    value,
    onChange,
    bucket = 'gallery',
    dossier,
    label,
    required = false,
    placeholder = 'https://...',
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [enUpload, setEnUpload] = useState(false);
    const [erreurUpload, setErreurUpload] = useState<string | null>(null);

    async function gererFichierChoisi(e: React.ChangeEvent<HTMLInputElement>) {
        const fichier = e.target.files?.[0];
        if (!fichier) return;

        setErreurUpload(null);

        if (fichier.size > TAILLE_MAX_OCTETS) {
            setErreurUpload(
                `Fichier trop lourd (${(fichier.size / 1024 / 1024).toFixed(1)} Mo). Limite : ${TAILLE_MAX_MO} Mo.`
            );
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        // Construire un chemin unique sans espaces ni caractères spéciaux
        const partsFichier = fichier.name.split('.');
        const ext = (partsFichier.length > 1
            ? (partsFichier.pop() ?? 'jpg')
            : 'jpg'
        ).toLowerCase().replace(/[^a-z0-9]/g, '');
        const nomNettoye = nettoyerNomFichier(partsFichier.join('.'));
        const cheminFichier = `${dossier ? dossier + '/' : ''}${Date.now()}-${nomNettoye}.${ext || 'jpg'}`;

        setEnUpload(true);

        const { error } = await supabase.storage
            .from(bucket)
            .upload(cheminFichier, fichier);

        if (error) {
            setErreurUpload(`Échec de l'import : ${error.message}`);
            setEnUpload(false);
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(cheminFichier);
        onChange(data.publicUrl);
        setEnUpload(false);
        if (inputRef.current) inputRef.current.value = '';
    }

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="flex gap-2">
                {/* Champ URL éditable — saisie manuelle ou rempli automatiquement après upload */}
                <input
                    type="url"
                    required={required}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-afd-400"
                />

                {/* Bouton d'import depuis l'ordinateur */}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={enUpload}
                    title="Importer une image depuis votre ordinateur"
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-afd-50 dark:hover:bg-afd-900/20 hover:border-afd-400 hover:text-afd-600 dark:hover:text-afd-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                >
                    {enUpload ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline text-sm">Import...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            <span className="hidden sm:inline text-sm">Importer</span>
                        </>
                    )}
                </button>

                {/* Input fichier caché */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={gererFichierChoisi}
                />
            </div>

            {/* Message d'erreur upload */}
            {erreurUpload && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{erreurUpload}</p>
            )}

            {/* Aperçu — masqué si l'URL ne charge pas (onError) */}
            {value && (
                <img
                    key={value}
                    src={value}
                    alt="Aperçu"
                    className="mt-2 h-24 w-auto rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            )}
        </div>
    );
}
