import type {
  Enquete,
  OptionQuestion,
  QuestionEnquete,
} from "@/features/enquetes/types";
import { withClient } from "./client";

export async function getPublicSurveyBySlug(slug: string): Promise<
  | (Enquete & {
      questions: (QuestionEnquete & { options: OptionQuestion[] })[];
    })
  | null
> {
  const safeSlug = slug.trim();
  if (!safeSlug) return null;

  return withClient(null, async (supabase) => {
    const { data, error } = await supabase
      .from("enquetes")
      .select("*")
      .eq("slug", safeSlug)
      .eq("statut", "publiee")
      .eq("visibilite", "publique")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const { data: questions } = await supabase
      .from("questions_enquete")
      .select("*")
      .eq("enquete_id", data.id)
      .order("ordre", { ascending: true });

    const questionIds = (questions ?? []).map((q) => q.id);
    const { data: options } =
      questionIds.length > 0
        ? await supabase
            .from("options_questions")
            .select("*")
            .in("question_id", questionIds)
            .order("ordre", { ascending: true })
        : { data: [] as OptionQuestion[] };

    const optionsByQuestion = new Map<string, OptionQuestion[]>();
    for (const option of options ?? []) {
      const list = optionsByQuestion.get(option.question_id) ?? [];
      list.push(option as OptionQuestion);
      optionsByQuestion.set(option.question_id, list);
    }

    return {
      ...(data as Enquete),
      questions: ((questions ?? []) as QuestionEnquete[]).map((question) => ({
        ...question,
        configuration:
          question.configuration &&
          typeof question.configuration === "object" &&
          !Array.isArray(question.configuration)
            ? question.configuration
            : {},
        options: optionsByQuestion.get(question.id) ?? [],
      })),
    };
  });
}
