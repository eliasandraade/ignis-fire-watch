# ignis-fire-watch — Divergência `main` × `master` e estratégia de alinhamento

Data: 03/11/2026 (Sprint 0.1). Análise somente leitura. **Nenhuma branch, configuração do GitHub ou projeto Vercel foi alterado.**

## 1. Fatos

| Item | Evidência |
|---|---|
| Branch padrão do GitHub | `main` (`gh api repos/eliasandraade/ignis-fire-watch --jq .default_branch`) |
| `main` | 13 commits, 30/05–02/06/2025, gerados pelo Lovable (`gpt-engineer-app[bot]`), último `02df1fb` |
| `master` | 42 commits a partir de 27/05/2026, último `e56d02f`. É o código atual e o destino dos PRs #1–#3 (mergeados) e #4 (aberto) |
| Ancestral comum | **Nenhum.** `git merge-base origin/main origin/master` vazio: são históricos independentes |
| Proteção de branch | Nenhuma (`branches/main/protection` → 404 "Branch not protected") |
| Vercel | Dois projetos ligados ao repositório: `ignis-fire-watch` e `ignis-fire-watch-main` |
| Deploys de produção registrados no GitHub | `Production – ignis-fire-watch` em `2a298fd` (commit de `master`, 31/05/2026) e um `Production` antigo em `c2370b1` (também em `master`). Nenhum deploy de produção registrado para `ignis-fire-watch-main` |
| Branch de produção de cada projeto Vercel | **Não confirmado**: a leitura do projeto exige autorização de escopo do time na Vercel. Pela evidência acima, `ignis-fire-watch` publica `master`. O nome de `ignis-fire-watch-main` sugere a branch `main` (inferência) |

## 2. Riscos

1. **Deploy acidental:** se `ignis-fire-watch-main` publica `main`, qualquer push em `main` (por exemplo, um "alinhamento" feito com merge) gera um deploy de produção num domínio público.
2. **Confusão de PRs:** a branch padrão define a base de novos PRs. Um PR aberto contra `main` mistura o código atual com o snapshot Lovable.
3. **Perda de histórico:** `git push --force` em `main`, ou apagar `main`, destrói o histórico do Lovable sem backup.
4. **Merge de históricos não relacionados:** `--allow-unrelated-histories` misturaria duas bases de código incompatíveis.

## 3. Estratégia recomendada (sem perda de histórico, sem deploy acidental)

Execução pelo proprietário (envolve configurações do GitHub e da Vercel):

1. **Confirmar na Vercel** a *Production Branch* e os domínios de `ignis-fire-watch` e `ignis-fire-watch-main`. Anotar qual domínio é o oficial.
2. **Preservar `main`** com uma tag imutável. Isso não dispara deploy de branch:
   ```bash
   git tag archive/lovable-main-2025 origin/main
   git push origin archive/lovable-main-2025
   ```
3. **Trocar a branch padrão do GitHub para `master`** (Settings → Branches). Não move código e não dispara deploy.
4. Se o projeto `ignis-fire-watch-main` publica `main` e não é usado, **desligar o deploy automático** ou arquivar o projeto na Vercel *antes* de qualquer mudança em `main`.
5. **Proteger `master`:** exigir PR, os checks `CI / Typecheck, lint, testes e build` e `CI / npm audit`, além de revisão.
6. Opcional, para adotar o nome `main` no futuro, numa janela combinada:
   1. renomear `main` → `legacy/lovable-main` pela interface do GitHub;
   2. renomear `master` → `main` pela interface (o GitHub redireciona os PRs e mantém o histórico);
   3. **no mesmo momento**, atualizar a *Production Branch* da Vercel para `main` e o gatilho `push: branches` do `.github/workflows/ci.yml`.

   Renomear não dispara build. O primeiro deploy só acontece no próximo push.

**Não fazer:** force-push em `main`, merge com `--allow-unrelated-histories`, apagar `main` sem a tag do passo 2.
