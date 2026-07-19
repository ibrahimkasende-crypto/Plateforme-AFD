# Rapport de tests — préparation production

**Date :** 2026-07-19

| Contrôle | Résultat |
|----------|----------|
| typecheck | **OK** (exit 0) |
| lint | **OK** (0 erreurs, 20 warnings) |
| test:unit | **OK** 41/41 |
| test:integration | Script absent — N/A |
| test:rls (`AFD_REQUIRE_RLS=1`) | **OK** 3/3 (via `.env.local` → projet `qsyvkaxlwxbhuphvctpl`) |
| test:e2e:operationnel | **OK** 11/11 (session antérieure, Chrome système) |
| test:accessibility | Script absent — N/A |
| test:visual | Script absent — N/A |
| build | **OK** (exit 0) |
| npm audit --omit=dev | Parse incomplet — à relancer manuellement |

**Note :** les tests RLS locaux ne certifient pas encore ADF_BD (`ndkcywqihtnuoydwicrq`) tant que `.env.local` pointe ailleurs.
