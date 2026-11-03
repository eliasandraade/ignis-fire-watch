# ignis-fire-watch — Estratégia de branches (Railway-only)

Data: 03/11/2026. Hospedagem **exclusiva no Railway**, por decisão do proprietário. A versão anterior deste documento (Sprint 0.1, com a Vercel) está no histórico do Git.
Nenhuma branch, configuração do GitHub ou projeto externo foi alterado por esta preparação.

## 1. Fatos (levantados na Sprint 0.1, somente leitura)

| Item | Evidência |
|---|---|
| Branch padrão do GitHub | `main` |
| `main` | 13 commits de 30/05 a 02/06/2025, gerados pelo Lovable (`gpt-engineer-app[bot]`), último `02df1fb` |
| `master` | o código atual, destino de todos os PRs da Sprint 0 em diante |
| Ancestral comum | **Nenhum** (`git merge-base origin/main origin/master` vazio): são históricos independentes |
| Proteção de branch | Nenhuma |
| Vercel (legado) | Dois projetos ainda ligados ao repositório: `ignis-fire-watch` (publicava `master`) e `ignis-fire-watch-main` |

## 2. Modelo alvo

| Branch | Papel | Quem altera | Deploy |
|---|---|---|---|
| `master` | integração (default) | PRs com CI verde | Railway **staging** (serviço `web`, *Wait for CI*) |
| `production` | o que está em produção | **somente** o workflow *Promover para produção* (fast-forward de um commit de `master` com CI aprovada, após aprovação do environment `production`) | Railway **production** (*Wait for CI*) |
| `main` | snapshot Lovable de 2025 | ninguém | nenhum |
| tag `archive/lovable-main-2025` | preservação imutável de `main` | — | nenhum |

O backend segue o mesmo modelo, com `main` no lugar de `master` (`ignis-orbital-api/.railway/railway.ts`, `BRANCHES`).

## 3. Passos do proprietário (sem force-push, sem perda de histórico)

1. **Desligar a Vercel.**
   - Este branch reduz o `vercel.json` a `{"git": {"deploymentEnabled": false}}`. A partir do merge, nenhum push publica na Vercel.
   - Em seguida, desconectar o repositório dos dois projetos Vercel, ou excluí-los. Depois disso, o `vercel.json` pode ser apagado num PR.
2. **Preservar `main`** com uma tag imutável. A tag não dispara nenhum deploy:
   ```bash
   git tag archive/lovable-main-2025 origin/main
   git push origin archive/lovable-main-2025
   ```
3. **Trocar a branch padrão do GitHub para `master`** (*Settings → Branches*). Não move código.
4. **Rulesets:**
   - `master`: exigir PR e os checks `CI / Typecheck, lint, testes e build`, `CI / Imagem Railway (nginx, SPA, healthcheck)` e `CI / npm audit`;
   - `production`: bloquear force-push e exclusão, restringir atualizações (bypass só para *GitHub Actions* e o proprietário) e exigir os mesmos checks.
5. **Environment `production`** (*Settings → Environments*), com *Required reviewers* = proprietário. O workflow de promoção espera essa aprovação.
6. **Primeira promoção:** disparar *Promover para produção*. Ele cria `production` no HEAD de `master` homologado em staging.
7. Opcional e futuro, para adotar o nome `main`:
   1. renomear `main` → `legacy/lovable-main` pela interface do GitHub;
   2. renomear `master` → `main` (o GitHub redireciona os PRs e mantém o histórico);
   3. **no mesmo momento**, atualizar `BRANCHES.staging.web` em `railway.ts`, o gatilho `push` da CI e o `SOURCE_BRANCH` do `promote.yml`.

**Não fazer:**
- force-push em qualquer branch;
- merge com `--allow-unrelated-histories`;
- apagar `main` sem a tag do passo 2;
- `git push` manual em `production`;
- retroceder `production` para fazer rollback. O rollback é o *Redeploy* da versão anterior no Railway.
