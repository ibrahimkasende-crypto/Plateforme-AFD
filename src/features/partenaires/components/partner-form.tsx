import { savePartner, uploadPartnerLogo } from "@/features/partenaires/actions/manage-partner";

type PartnerFormValues = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  acronyme?: string | null;
  category?: string | null;
  website_url?: string | null;
  description?: string | null;
  logo_url?: string | null;
  order?: number | null;
  active?: boolean | null;
  publie?: boolean | null;
  mise_en_avant?: boolean | null;
};

export function PartnerForm({ partner }: { partner?: PartnerFormValues }) {
  return (
    <div className="space-y-8">
      <form action={savePartner} className="space-y-4">
        {partner?.id ? <input type="hidden" name="id" value={partner.id} /> : null}
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nom</span>
          <input
            required
            name="name"
            defaultValue={partner?.name ?? ""}
            className="w-full rounded border p-3"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Slug</span>
          <input
            name="slug"
            defaultValue={partner?.slug ?? ""}
            placeholder="organisation-partenaire"
            className="w-full rounded border p-3"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Acronyme</span>
          <input
            name="acronyme"
            defaultValue={partner?.acronyme ?? ""}
            className="w-full rounded border p-3"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Catégorie</span>
          <select
            name="category"
            defaultValue={partner?.category ?? ""}
            className="w-full rounded border p-3"
          >
            <option value="">Partenaire</option>
            <option value="gouvernement">Institutionnel</option>
            <option value="international">International</option>
            <option value="ong">ONG</option>
            <option value="technique">Technique</option>
            <option value="financier">Financier</option>
            <option value="humanitaire">Humanitaire</option>
            <option value="communautaire">Communautaire</option>
            <option value="reseau">Réseau ou cluster</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Site web (vérifié uniquement)</span>
          <input
            name="website_url"
            type="url"
            defaultValue={partner?.website_url ?? ""}
            placeholder="https://"
            className="w-full rounded border p-3"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea
            name="description"
            defaultValue={partner?.description ?? ""}
            className="min-h-28 w-full rounded border p-3"
            placeholder="Laisser vide si non vérifiée"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">URL du logo</span>
          <input
            name="logo_url"
            defaultValue={partner?.logo_url ?? ""}
            className="w-full rounded border p-3"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Ordre d’affichage</span>
          <input
            name="order"
            type="number"
            min={0}
            defaultValue={partner?.order ?? 0}
            className="w-full rounded border p-3"
          />
        </label>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input name="active" type="checkbox" defaultChecked={partner?.active ?? true} />
            Actif
          </label>
          <label className="inline-flex items-center gap-2">
            <input name="publie" type="checkbox" defaultChecked={partner?.publie ?? true} />
            Publié
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              name="mise_en_avant"
              type="checkbox"
              defaultChecked={partner?.mise_en_avant ?? false}
            />
            Mise en avant
          </label>
        </div>
        <button
          type="submit"
          className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
        >
          Enregistrer
        </button>
      </form>

      {partner?.id ? (
        <form action={uploadPartnerLogo} className="space-y-3 rounded border bg-white p-4">
          <input type="hidden" name="id" value={partner.id} />
          <h2 className="text-sm font-semibold">Importer un logo</h2>
          <input name="logo" type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" required />
          <button type="submit" className="rounded border px-4 py-2 text-sm">
            Remplacer le logo
          </button>
          {partner.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.logo_url}
              alt={`Aperçu ${partner.name}`}
              className="mt-3 max-h-24 w-auto object-contain"
            />
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
