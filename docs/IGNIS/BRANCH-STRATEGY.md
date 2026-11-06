# ignis-fire-watch — Estratégia de branches (Railway-only)

Data: 03/11/2026. Hospedagem **exclusiva no Railway**, por decisão do proprietário. A versão anterior deste documento (Sprint 0.1, com a Vercel) está no histórico do Git.

## 1. Fatos (levantados na Sprint 0.1, somente leitura)

| Item | Evidência |
|---|---|
| Branch padrão do GitHub | `main` |
| `main` | 13 commits de 30/05 a 02/06/2025, gerados pelo Lovable (`gpt-engineer-app[bot]`), último `02df1fb` |
| `master` | o código atual, destino de todos os PRs da Sprint 0 em diante |
| Ancestral comum | **Nenhum** (`git merge-base origin/main origin/master` vazio): são históricos independentes |
| Vercel (legado) | Dois projetos ainda ligados ao repositório: `ignis-fire-watch` (publicava `master`) e `ignis-fire-watch-main` |

## 2. Modelo alvo

| Branch | Papel | Quem altera | Deploy |
|---|---|---|---|
| `master` | integração | PRs com CI verde | Railway **staging** (serviço `web`, *Wait for CI*) |
| `production` | o que está em produção | **somente** o workflow *Promover para produção*, disparado por tag `promote/*` (fast-forward de um commit de `master` com CI aprovada, após aprovação do environment `production`) | Railway **production** (*Wait for CI*) |
| `main` | snapshot Lovable de 2025, branch padrão do GitHub | ninguém (ruleset) | nenhum |
| tag `archive/lovable-main-2025` | preservação imutável de `main` | — | nenhum |

O backend segue o mesmo modelo, com `main` no lugar de `master` (`ignis-orbital-api/.railway/railway.ts`, `BRANCHES`).

## 3. Estado em 05/11/2026

Conferido no GitHub e no Git:

- `master` é ancestral de toda a pilha (`master` → #4 → #6 → #7 → #8 → `staging`); `main` não é ancestral de nada dela.
- `main` permanece como branch padrão. **A troca não é necessária para promover**: o `promote.yml` dispara por uma tag `promote/*` no commit a promover, pois um `push` lê o workflow do próprio commit. O `workflow_dispatch` continua no arquivo, mas o GitHub só o oferece para workflows presentes no branch padrão.
- Tag `archive/lovable-main-2025` criada em `02df1fb`. `main` não foi alterado.
- Environment `production` e rulesets aplicados nos dois repositórios (RAILWAY-DEPLOYMENT §6).

### Promover

Depois do merge do PR #8 em `master` e com a CI de push verde em `M_WEB`:

```bash
git tag promote/AAAAMMDD-HHMM "$M_WEB"
git push origin promote/AAAAMMDD-HHMM
```

O job espera a aprovação do proprietário no environment `production`. Antes de publicar, ele recusa o commit que não estiver em `master`, que não tiver CI de push aprovada ou que não seja fast-forward de `production`.

Testado em 05/11/2026 com uma tag em commit fora de `master`: o job ficou em `waiting` no environment, com zero etapas executadas. A execução foi cancelada e a tag, apagada. O push real em `production` só será exercitado na primeira promoção.

### Decisões em aberto

1. **Vercel.** Os dois projetos ainda recebem eventos do repositório, e `ignis-fire-watch.vercel.app` e `ignis-fire-watch-main.vercel.app` respondem 200, com a versão da entrega acadêmica (`docs/archive/entrega-academica/`). Essa versão chama `ignis-api-production.up.railway.app`, que hoje responde 404. O merge do #8 leva a `master` o `vercel.json` que desliga novos deploys por Git. Desconectar ou excluir os projetos depende de o proprietário confirmar que a entrega acadêmica não precisa mais ficar no ar.
2. **Branch padrão.** Trocar para `master` é opcional. O motivo seria alinhar os padrões do GitHub (base de novos PRs, página inicial do repositório), não o workflow. Se decidir trocar, adote `master` em *Settings → Branches*; nenhum código se move.
3. Opcional e futuro, para adotar o nome `main`:
   1. renomear `main` → `legacy/lovable-main` pela interface do GitHub;
   2. renomear `master` → `main` (o GitHub redireciona os PRs e mantém o histórico);
   3. **no mesmo momento**, atualizar `BRANCHES.staging.web` em `railway.ts`, o gatilho `push` da CI, o `SOURCE_BRANCH` do `promote.yml` e o ruleset.

**Não fazer:**
- force-push em qualquer branch;
- merge com `--allow-unrelated-histories`;
- apagar `main` sem a tag do passo 2;
- `git push` manual em `production`;
- retroceder `production` para fazer rollback. O rollback é o *Redeploy* da versão anterior no Railway.
