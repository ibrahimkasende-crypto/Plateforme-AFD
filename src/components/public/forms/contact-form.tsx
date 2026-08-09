"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  checkboxClassName,
  errorClassName,
  fieldClassName,
  formClassName,
  formShellClassName,
  labelClassName,
  submitClassName,
  textareaClassName,
} from "@/components/ui/form-styles";
import { submitContactAction } from "@/features/contact/actions/submit-contact";

const REQUEST_TYPES = [
  { value: "", label: "Sélectionner (facultatif)" },
  { value: "information", label: "Demande d’information" },
  { value: "partenariat", label: "Partenariat" },
  { value: "adhesion", label: "Adhésion" },
  { value: "don", label: "Don / soutien" },
  { value: "autre", label: "Autre" },
] as const;

const formSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis").max(120),
  email: z.string().trim().email("Adresse e-mail invalide"),
  phone: z.string().trim().max(40).optional(),
  organisation: z.string().trim().max(200).optional(),
  requestType: z.string().trim().max(80).optional(),
  province: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(3, "Le sujet est requis").max(200),
  message: z.string().trim().min(10, "Le message est requis").max(5000),
  consent: z.boolean().refine((value) => value === true, {
    message: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organisation: "",
      requestType: "",
      province: "",
      subject: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await submitContactAction({
        ...values,
        consent: true,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset();
    });
  }

  return (
    <div className={formShellClassName} data-disable-water-effect="">
      <form onSubmit={handleSubmit(onSubmit)} className={formClassName} noValidate>
        <div className="sr-only" aria-hidden>
          <label htmlFor="contact-website">Site web</label>
          <input
            id="contact-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClassName}>
              Nom complet
            </label>
            <input
              id="contact-name"
              type="text"
              className={fieldClassName}
              {...register("name")}
            />
            {errors.name ? (
              <p className={errorClassName}>{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClassName}>
              E-mail
            </label>
            <input
              id="contact-email"
              type="email"
              className={fieldClassName}
              {...register("email")}
            />
            {errors.email ? (
              <p className={errorClassName}>{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelClassName}>
              Téléphone{" "}
              <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              className={fieldClassName}
              {...register("phone")}
            />
          </div>
          <div>
            <label htmlFor="contact-organisation" className={labelClassName}>
              Organisation{" "}
              <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
            </label>
            <input
              id="contact-organisation"
              type="text"
              className={fieldClassName}
              {...register("organisation")}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-request-type" className={labelClassName}>
              Type de demande{" "}
              <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
            </label>
            <select
              id="contact-request-type"
              className={fieldClassName}
              {...register("requestType")}
            >
              {REQUEST_TYPES.map((item) => (
                <option key={item.value || "none"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contact-province" className={labelClassName}>
              Province{" "}
              <span className="font-normal text-[var(--afd-muted)]">(facultatif)</span>
            </label>
            <input
              id="contact-province"
              type="text"
              className={fieldClassName}
              {...register("province")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelClassName}>
            Sujet
          </label>
          <input
            id="contact-subject"
            type="text"
            className={fieldClassName}
            {...register("subject")}
          />
          {errors.subject ? (
            <p className={errorClassName}>{errors.subject.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClassName}>
            Message
          </label>
          <textarea
            id="contact-message"
            rows={6}
            className={textareaClassName}
            {...register("message")}
          />
          {errors.message ? (
            <p className={errorClassName}>{errors.message.message}</p>
          ) : null}
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--afd-muted)]">
          <input type="checkbox" className={checkboxClassName} {...register("consent")} />
          <span>
            J’accepte que l’AFD traite mes données pour répondre à ma demande.{" "}
            <Link
              href="/politique-confidentialite"
              className="font-semibold text-[var(--afd-blue)] underline-offset-2 hover:underline"
            >
              Politique de confidentialité
            </Link>
          </span>
        </label>
        {errors.consent ? (
          <p className={errorClassName}>{errors.consent.message}</p>
        ) : null}

        <button type="submit" disabled={pending} className={submitClassName}>
          {pending ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </form>
    </div>
  );
}
