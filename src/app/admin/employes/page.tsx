import { redirect } from "next/navigation";

/** Alias demandé : /admin/employes → personnel RH */
export default function EmployesIndexRedirect() {
  redirect("/admin/rh/personnel");
}
