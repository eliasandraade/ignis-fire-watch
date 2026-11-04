# IGNIS — Documentação (frontend)

O índice completo da Sprint 0 fica no repositório do backend (IGNIS Core):
**[ignis-orbital-api/docs/IGNIS/README.md](https://github.com/eliasandraade/ignis-orbital-api/blob/audit/ignis-sprint-0/docs/IGNIS/README.md)**

Admin Cockpit e profissionalização (branch `feat/ignis-admin-cockpit`): ver
[PRODUCT-PROFESSIONALIZATION.md](https://github.com/eliasandraade/ignis-orbital-api/blob/feat/ignis-admin-cockpit/docs/IGNIS/PRODUCT-PROFESSIONALIZATION.md),
[ADMIN-COCKPIT.md](https://github.com/eliasandraade/ignis-orbital-api/blob/feat/ignis-admin-cockpit/docs/IGNIS/ADMIN-COCKPIT.md),
[ADMIN-SECURITY-REVIEW.md](https://github.com/eliasandraade/ignis-orbital-api/blob/feat/ignis-admin-cockpit/docs/IGNIS/ADMIN-SECURITY-REVIEW.md) e
[ADMIN-VALIDATION-GUIDE.md](https://github.com/eliasandraade/ignis-orbital-api/blob/feat/ignis-admin-cockpit/docs/IGNIS/ADMIN-VALIDATION-GUIDE.md).

Neste repositório:
- [FRONTEND-INVENTORY.md](FRONTEND-INVENTORY.md): telas, rotas, matriz de rastreabilidade de dados, estados das ações e verificação.
- [BRANCH-STRATEGY.md](BRANCH-STRATEGY.md): divergência `main` × `master` (históricos sem ancestral comum) e alinhamento seguro.

Atenção: o desenvolvimento ativo deste repositório está na branch **`master`**. A branch padrão `main` contém um snapshot antigo (ver AUDIT-REPORT X-01).

Comandos de verificação:

```bash
npm ci --ignore-scripts && npm run typecheck && npm run lint && npm test && npm run build
```
