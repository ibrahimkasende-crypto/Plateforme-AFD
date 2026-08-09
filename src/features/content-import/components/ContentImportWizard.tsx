"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  FileUp,
  Loader2,
  XCircle,
} from "lucide-react";
import { analyzeContentImportAction } from "@/features/content-import/actions/analyze-content-import";
import { publishContentImportAction } from "@/features/content-import/actions/publish-content-import";
import { ENTITY_LABELS } from "@/features/content-import/field-catalog";
import {
  CONTENT_IMPORT_STEPS,
  type ContentEntityType,
  type ContentImportAnalysis,
  type ContentImportWizardStep,
  type ExtractedContentField,
} from "@/features/content-import/types";
import { cn } from "@/lib/utils";

type Props = {
  entityType: ContentEntityType;
  cancelHref: string;
};

function ConfidenceIcon({ confidence }: { confidence: ExtractedContentField["confidence"] }) {
  if (confidence === "recognized") {
    return <CheckCircle2 className="size-4 text-emerald-600" aria-label="Reconnu" />;
  }
  if (confidence === "uncertain") {
    return <AlertTriangle className="size-4 text-amber-500" aria-label="Doute" />;
  }
  return <XCircle className="size-4 text-slate-400" aria-label="Non trouvé" />;
}

export function ContentImportWizard({ entityType, cancelHref }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<ContentImportWizardStep>("import");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ContentImportAnalysis | null>(null);
  const [fields, setFields] = useState<ExtractedContentField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [publishNow, setPublishNow] = useState(true);
  const [pending, startTransition] = useTransition();

  const label = ENTITY_LABELS[entityType];
  const stepIndex = CONTENT_IMPORT_STEPS.findIndex((s) => s.id === step);

  const stats = useMemo(() => {
    const recognized = fields.filter((f) => f.confidence === "recognized").length;
    const uncertain = fields.filter((f) => f.confidence === "uncertain").length;
    const missing = fields.filter((f) => f.confidence === "missing").length;
    return { recognized, uncertain, missing };
  }, [fields]);

  function updateField(key: string, value: string) {
    setFields((prev) =>
      prev.map((f) =>
        f.key === key
          ? {
              ...f,
              value,
              confidence: value.trim()
                ? f.confidence === "missing"
                  ? "uncertain"
                  : f.confidence
                : "missing",
            }
          : f,
      ),
    );
  }

  function runAnalyze() {
    if (!file) {
      setError("Choisissez un fichier à importer.");
      return;
    }
    setError(null);
    setStep("analyse");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("entityType", entityType);
      fd.set("file", file);
      const result = await analyzeContentImportAction(fd);
      if (!result.ok) {
        setError(result.error);
        setStep("import");
        return;
      }
      setAnalysis(result.analysis);
      setFields(result.analysis.fields);
      setStep("extraction");
    });
  }

  function goCorrection() {
    setStep("correction");
  }

  function runPublish() {
    setError(null);
    setStep("publication");
    startTransition(async () => {
      const map: Record<string, string> = {};
      for (const f of fields) map[f.key] = f.value;
      const fd = new FormData();
      fd.set("entityType", entityType);
      fd.set("fieldsJson", JSON.stringify(map));
      fd.set("publishNow", publishNow ? "1" : "0");
      const result = await publishContentImportAction(fd);
      if (!result.ok) {
        setError(result.error);
        setStep("correction");
        return;
      }
      router.push(result.redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Import intelligent — {label}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Aucune donnée n’est publiée sans votre validation finale.
        </p>
      </div>

      <ol className="flex flex-wrap gap-2">
        {CONTENT_IMPORT_STEPS.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              i <= stepIndex
                ? "bg-[var(--afd-blue)] text-white"
                : "bg-slate-100 text-slate-500",
            )}
          >
            {s.order}. {s.label}
          </li>
        ))}
      </ol>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {step === "import" ? (
        <div className="space-y-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl bg-slate-50 px-6 py-10 text-center transition hover:bg-[#eaf5fd]">
            <FileUp className="size-8 text-[var(--afd-blue)]" aria-hidden />
            <span className="text-sm font-medium text-slate-800">
              Déposer un PDF, Word, Excel, image ou TXT
            </span>
            <span className="text-xs text-slate-500">
              PowerPoint / ZIP : convertissez en PDF pour de meilleurs résultats
            </span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {file ? (
            <p className="text-sm text-slate-700">
              Fichier sélectionné : <strong>{file.name}</strong> (
              {(file.size / 1024).toFixed(0)} Ko)
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!file || pending}
              onClick={runAnalyze}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--afd-blue)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Lancer l’analyse
            </button>
            <a
              href={cancelHref}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Annuler
            </a>
          </div>
        </div>
      ) : null}

      {step === "analyse" ? (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-700">
          <Loader2 className="size-5 animate-spin text-[var(--afd-blue)]" />
          Analyse OCR / extraction en cours…
        </div>
      ) : null}

      {(step === "extraction" || step === "correction") && analysis ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <p>
              <strong>{analysis.fileName}</strong> · {analysis.provider} ·{" "}
              {analysis.language} · {analysis.processingMs} ms
            </p>
            <p className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="size-3.5" /> {stats.recognized} reconnu
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600">
                <AlertTriangle className="size-3.5" /> {stats.uncertain} doute
              </span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <XCircle className="size-3.5" /> {stats.missing} non trouvé
              </span>
            </p>
            {analysis.warnings.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-700">
                {analysis.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Aperçu avant import
            </h2>
            {fields.map((field) => (
              <label key={field.key} className="block space-y-1">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <ConfidenceIcon confidence={field.confidence} />
                  {field.label}
                </span>
                {field.key.includes("description") ||
                field.key === "contenu" ||
                field.key === "objectifs" ||
                field.key.startsWith("resultats") ||
                field.key === "long_description" ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                ) : (
                  <input
                    value={field.value}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  />
                )}
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
            />
            Publier immédiatement sur le site public (sinon brouillon / inactif)
          </label>

          <div className="flex flex-wrap gap-3">
            {step === "extraction" ? (
              <button
                type="button"
                onClick={goCorrection}
                className="rounded-lg bg-[var(--afd-blue)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Vérifier / corriger
              </button>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={runPublish}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Valider et créer
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep("import")}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            >
              Recommencer
            </button>
          </div>
        </div>
      ) : null}

      {step === "publication" ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-sm text-emerald-800">
          <Loader2 className="size-5 animate-spin" />
          Création en cours et mise à jour du site public…
        </div>
      ) : null}
    </div>
  );
}
