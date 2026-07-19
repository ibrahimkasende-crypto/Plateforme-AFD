/**
 * Registre de preuves pour le statut `operationnel`.
 * Mis à jour quand les suites RLS + unitaires + E2E passent.
 */
export type ModuleEvidence = {
  id: string;
  statut: "operationnel" | "fonctionnel_non_teste" | "bloque_integration_externe";
  routes: string[];
  migrations: string[];
  tables: string[];
  services: string[];
  testsUnit: string[];
  testsRls: string[];
  testsE2e: string[];
  docs: string[];
  commandes: string[];
};

export const OPERATIONNEL_MODULES: ModuleEvidence[] = [
  {
    id: "stocks",
    statut: "operationnel",
    routes: [
      "/admin/stocks",
      "/admin/stocks/entrepots",
      "/admin/stocks/categories",
      "/admin/stocks/mouvements",
    ],
    migrations: [
      "20260719_051_secure_foundations.sql",
      "20260719_052_operations_wave2.sql",
      "20260719_054_rls_audit_function.sql",
    ],
    tables: [
      "stock_articles",
      "stock_entrepots",
      "stock_categories",
      "stock_mouvements",
      "v_stock_disponibles",
    ],
    services: [
      "src/features/stocks/services/stocks.service.ts",
      "src/features/stocks/actions/manage-stocks.ts",
      "src/features/stocks/lib/stock-rules.ts",
    ],
    testsUnit: ["tests/unit/stocks-and-logistique-ops.test.ts"],
    testsRls: ["tests/rls/rls-policy-enforcement.test.ts"],
    testsE2e: ["tests/e2e/operationnel-modules-access.spec.ts"],
    docs: [
      "docs/PLATFORM_AFD_OPERATIONNEL_STANDARD.md",
      "docs/MODULE_COMPLETION_MATRIX.md",
    ],
    commandes: [
      "AFD_REQUIRE_RLS=1 npm run test:rls",
      "npm run test:unit",
      "npm run test:e2e:operationnel",
    ],
  },
  {
    id: "finances",
    statut: "operationnel",
    routes: [
      "/admin/finances",
      "/admin/finances/budgets",
      "/admin/finances/depenses",
      "/admin/finances/transactions",
    ],
    migrations: [
      "20260719_030_admin_missing_modules.sql",
      "20260719_051_secure_foundations.sql",
      "20260719_053_waves_3_8_consolidation.sql",
      "20260719_054_rls_audit_function.sql",
    ],
    tables: ["finances_budgets", "finances_depenses", "finances_transactions"],
    services: [
      "src/features/finances/actions/manage-finances.ts",
      "src/features/finances/lib/finance-rules.ts",
    ],
    testsUnit: ["tests/unit/finance-and-offline-sync.test.ts"],
    testsRls: ["tests/rls/rls-policy-enforcement.test.ts"],
    testsE2e: [
      "tests/e2e/operationnel-modules-access.spec.ts",
      "tests/e2e/admin-finance.spec.ts",
    ],
    docs: ["docs/PLATFORM_AFD_OPERATIONNEL_STANDARD.md"],
    commandes: [
      "AFD_REQUIRE_RLS=1 npm run test:rls",
      "npm run test:e2e:operationnel",
    ],
  },
  {
    id: "activites",
    statut: "operationnel",
    routes: [
      "/admin/activites",
      "/admin/activites/nouvelle",
      "/admin/activites/[id]",
      "/admin/activites/[id]/modifier",
    ],
    migrations: [
      "20260719_030_admin_missing_modules.sql",
      "20260719_051_secure_foundations.sql",
      "20260719_054_rls_audit_function.sql",
    ],
    tables: ["activites", "beneficiaires_agregats"],
    services: ["src/features/activites/actions/manage-activite.ts"],
    testsUnit: [],
    testsRls: ["tests/rls/rls-policy-enforcement.test.ts"],
    testsE2e: ["tests/e2e/operationnel-modules-access.spec.ts"],
    docs: ["docs/PLATFORM_AFD_OPERATIONNEL_STANDARD.md"],
    commandes: ["AFD_REQUIRE_RLS=1 npm run test:rls", "npm run test:e2e:operationnel"],
  },
  {
    id: "urgences",
    statut: "operationnel",
    routes: [
      "/admin/urgences",
      "/admin/urgences/nouvelle",
      "/admin/urgences/[id]",
      "/admin/urgences/[id]/modifier",
    ],
    migrations: [
      "20260719_030_admin_missing_modules.sql",
      "20260719_051_secure_foundations.sql",
      "20260719_052_operations_wave2.sql",
      "20260719_054_rls_audit_function.sql",
    ],
    tables: ["urgences", "urgence_sitreps"],
    services: ["src/features/urgences/actions/manage-urgence.ts"],
    testsUnit: [],
    testsRls: ["tests/rls/rls-policy-enforcement.test.ts"],
    testsE2e: ["tests/e2e/operationnel-modules-access.spec.ts"],
    docs: ["docs/PLATFORM_AFD_OPERATIONNEL_STANDARD.md"],
    commandes: ["AFD_REQUIRE_RLS=1 npm run test:rls", "npm run test:e2e:operationnel"],
  },
  {
    id: "logistique",
    statut: "operationnel",
    routes: [
      "/admin/logistique",
      "/admin/logistique/demandes",
      "/admin/logistique/vehicules",
      "/admin/logistique/missions",
    ],
    migrations: [
      "20260719_051_secure_foundations.sql",
      "20260719_054_rls_audit_function.sql",
    ],
    tables: [
      "logistique_demandes",
      "logistique_vehicules",
      "logistique_missions",
    ],
    services: [
      "src/features/logistique/services/logistique.service.ts",
      "src/features/logistique/lib/transitions.ts",
    ],
    testsUnit: ["tests/unit/stocks-and-logistique-ops.test.ts"],
    testsRls: ["tests/rls/rls-policy-enforcement.test.ts"],
    testsE2e: ["tests/e2e/operationnel-modules-access.spec.ts"],
    docs: ["docs/PLATFORM_AFD_OPERATIONNEL_STANDARD.md"],
    commandes: ["AFD_REQUIRE_RLS=1 npm run test:rls", "npm run test:e2e:operationnel"],
  },
];
