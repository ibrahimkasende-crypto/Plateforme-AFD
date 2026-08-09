import Link from "next/link";
import { saveEventArchive } from "@/features/event-archives/actions/manage-event-archive";
import type { AdminEventArchive } from "@/lib/queries/admin/event-archives";
import type { InterventionDomain } from "@/config/intervention-domains";

const inputClass =
  "min-h-11 w-full rounded-lg border border-[var(--admin-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20";

const labelClass = "block space-y-1.5";
const labelTextClass = "text-sm font-semibold text-[var(--admin-text)]";

function imageSrcForForm(image: NonNullable<AdminEventArchive["bibliotheque_images"]>[number]) {
  return image.local_asset_path ?? image.public_url ?? "";
}

function imagesValue(item?: AdminEventArchive | null): string {
  return (item?.bibliotheque_images ?? [])
    .map((image) =>
      [
        imageSrcForForm(image),
        image.title ?? "",
        image.caption ?? "",
        image.alt_text ?? "",
      ].join("|"),
    )
    .join("\n");
}

export function EventArchiveForm({
  domains,
  item,
}: {
  domains: InterventionDomain[];
  item?: AdminEventArchive | null;
}) {
  const relatedSlug = item?.actualites?.slug ?? "";

  return (
    <form
      action={saveEventArchive}
      className="grid gap-5 rounded-2xl border border-[var(--admin-border)] bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="space-y-5">
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span className={labelTextClass}>Titre</span>
              <input
                required
                name="titre"
                defaultValue={item?.titre ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Slug</span>
              <input
                required
                name="slug"
                defaultValue={item?.slug ?? ""}
                placeholder="archive-evenement"
                className={inputClass}
              />
            </label>
          </div>

          <label className={labelClass}>
            <span className={labelTextClass}>Domaine d’intervention</span>
            <select
              required
              name="domaine_slug"
              defaultValue={item?.domaine_slug ?? domains[0]?.slug ?? ""}
              className={inputClass}
            >
              {domains.map((domain) => (
                <option key={domain.slug} value={domain.slug}>
                  {domain.title}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            <span className={labelTextClass}>Résumé</span>
            <textarea
              name="resume"
              defaultValue={item?.resume ?? ""}
              className={`${inputClass} min-h-24`}
            />
          </label>

          <label className={labelClass}>
            <span className={labelTextClass}>Description complète</span>
            <textarea
              name="description"
              defaultValue={item?.description ?? ""}
              className={`${inputClass} min-h-36`}
            />
          </label>
        </section>

        <section className="space-y-4 border-t border-[var(--admin-border)] pt-5">
          <h2 className="text-base font-bold text-[var(--admin-text)]">
            Date, heure et localisation
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              <span className={labelTextClass}>Date</span>
              <input
                type="date"
                name="date_evenement"
                defaultValue={item?.date_evenement ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Heure début</span>
              <input
                type="time"
                name="heure_debut"
                defaultValue={item?.heure_debut?.slice(0, 5) ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Heure fin</span>
              <input
                type="time"
                name="heure_fin"
                defaultValue={item?.heure_fin?.slice(0, 5) ?? ""}
                className={inputClass}
              />
            </label>
          </div>

          <label className={labelClass}>
            <span className={labelTextClass}>Lieu exact / structure</span>
            <input
              name="lieu_nom"
              defaultValue={item?.lieu_nom ?? ""}
              placeholder="Site CECA-20 MAKOKO, Centre de santé SALAMA..."
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span className={labelTextClass}>Adresse</span>
              <input name="adresse" defaultValue={item?.adresse ?? ""} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Localité</span>
              <input name="localite" defaultValue={item?.localite ?? ""} className={inputClass} />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Territoire</span>
              <input
                name="territoire"
                defaultValue={item?.territoire ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Province</span>
              <input name="province" defaultValue={item?.province ?? ""} className={inputClass} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              <span className={labelTextClass}>Latitude</span>
              <input
                type="number"
                step="0.0000001"
                name="latitude"
                defaultValue={item?.latitude ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              <span className={labelTextClass}>Longitude</span>
              <input
                type="number"
                step="0.0000001"
                name="longitude"
                defaultValue={item?.longitude ?? ""}
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 border-t border-[var(--admin-border)] pt-5">
          <h2 className="text-base font-bold text-[var(--admin-text)]">
            Images et relations
          </h2>
          <label className={labelClass}>
            <span className={labelTextClass}>Image de couverture</span>
            <input
              name="cover_image_url"
              defaultValue={item?.cover_image_url ?? ""}
              placeholder="/assets/Banque des images AFD - Classees/..."
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Galerie</span>
            <textarea
              name="image_lines"
              defaultValue={imagesValue(item)}
              placeholder="URL ou chemin local | Titre | Légende | Texte alternatif"
              className={`${inputClass} min-h-44 font-mono text-[12px]`}
            />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Ajouter des images</span>
            <input
              name="archive_files"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="block w-full rounded-lg border border-dashed border-[var(--admin-border)] bg-white px-3 py-3 text-sm"
            />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Slug de l’article lié</span>
            <input
              name="related_article_slug"
              defaultValue={relatedSlug}
              placeholder="urgence-ituri-deplaces-ceca-20-makoko-mambasa"
              className={inputClass}
            />
          </label>
        </section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <section className="space-y-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)] p-4">
          <h2 className="text-base font-bold text-[var(--admin-text)]">Publication</h2>
          <label className={labelClass}>
            <span className={labelTextClass}>Statut</span>
            <select name="statut" defaultValue={item?.statut ?? "brouillon"} className={inputClass}>
              <option value="brouillon">Brouillon</option>
              <option value="en_revision">En révision</option>
              <option value="approuve">Approuvé</option>
              <option value="programme">Programmé</option>
              <option value="publie">Publié</option>
              <option value="depublie">Dépublié</option>
              <option value="archive">Archivé</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--admin-text)]">
            <input name="publie" type="checkbox" defaultChecked={item?.publie ?? false} />
            Publier sur le site
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--admin-text)]">
            <input name="featured" type="checkbox" defaultChecked={item?.featured ?? false} />
            Mettre en avant
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)] p-4">
          <h2 className="text-base font-bold text-[var(--admin-text)]">Classement</h2>
          <label className={labelClass}>
            <span className={labelTextClass}>Tags</span>
            <textarea
              name="tags"
              defaultValue={(item?.tags ?? []).join(", ")}
              placeholder="WASH, Mambasa, sensibilisation"
              className={`${inputClass} min-h-24`}
            />
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)] p-4">
          <h2 className="text-base font-bold text-[var(--admin-text)]">SEO</h2>
          <input
            name="seo_title"
            defaultValue={item?.seo_title ?? ""}
            placeholder="Titre SEO"
            className={inputClass}
          />
          <textarea
            name="seo_description"
            defaultValue={item?.seo_description ?? ""}
            placeholder="Description SEO"
            className={`${inputClass} min-h-24`}
          />
        </section>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            type="submit"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[var(--admin-primary)] px-4 text-sm font-bold text-white"
          >
            Enregistrer
          </button>
          <Link
            href="/admin/publications/archives"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[var(--admin-border)] px-4 text-sm font-semibold"
          >
            Annuler
          </Link>
        </div>
      </aside>
    </form>
  );
}
