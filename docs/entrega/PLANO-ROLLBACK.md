# IGNIS Orbital — Plano de Rollback e Contingência

**FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026**  
**Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

---

## Cenário 1 — API Railway indisponível

**Impacto:** Dados reais (áreas protegidas, incidentes, denúncias) não carregam.  
**Comportamento:** Frontend cai automaticamente para mocks locais (`VITE_USE_API=false`).  
**Ação do usuário:** Nenhuma — fallback é silencioso.  
**Ação do demonstrador:** Mencionar que "quando a API está disponível, os dados são reais; agora estamos em modo demonstrativo offline".

### Para verificar se a API está online:
```
https://ignis-api-production.up.railway.app/health
→ {"status":"ok"} = online
```

### Para forçar modo mock localmente:
```env
VITE_USE_API=false
```

---

## Cenário 2 — Vercel principal indisponível

**URL alternativa disponível:**  
`https://ignis-fire-watch-main.vercel.app`

Ambas as URLs estão configuradas no CORS do Railway e no Vercel.

---

## Cenário 3 — Token expirado / sessão perdida

**Sintoma:** Ao recarregar `/gestor`, redireciona para `/select-profile`.  
**Causa:** Token JWT expirou (validade: 480 minutos).  
**Solução:** Fazer login novamente com as credenciais em LINKS-E-CREDENCIAIS.md.

---

## Cenário 4 — Mapa não carrega (Leaflet/tiles)

**Causa provável:** Provedor de tiles OpenStreetMap indisponível ou CDN bloqueado.  
**Ação:** Mencionar que o mapa usa OpenStreetMap e que as geometrias das áreas protegidas são PostGIS reais — se os tiles não renderizarem, os polígonos ainda estão no banco.

---

## Cenário 5 — Build com erro TypeScript

**Para verificar:**
```bash
cd ignis-fire-watch-main
npm run build
```

**Último build limpo em:** 2026-05-31 (commit master)  
**TypeScript errors:** 0  
**npm audit:** 3 vulnerabilidades moderate (esbuild dev — não afeta produção)

---

## Rollback de Deploy (Frontend)

O Vercel mantém histórico de deploys. Para reverter:

1. Acesse https://vercel.com/dashboard
2. Selecione o projeto `ignis-fire-watch`
3. Deployments → selecione o deploy anterior → "Promote to Production"

---

## Rollback de Deploy (Backend Railway)

Railway mantém histórico de deploys. Para reverter:

1. Acesse https://railway.app
2. Selecione o projeto `ignis-orbital`
3. Service → Deployments → selecione deploy anterior → "Rollback"

---

## Backup das Credenciais de Demonstração

Ver `LINKS-E-CREDENCIAIS.md` — credenciais estão no seed demonstrativo do banco.  
Se o seed precisar ser reexecutado:

```bash
cd ignis-orbital-api
python -m app.db.seed
```

---

## Contato e Responsáveis

| | |
|---|---|
| **Elias Sales de Freitas** | RM561257 |
| **João Vitor Bernardo** | RM566427 |
| **Turma** | ADS — FIAP GS 2026 |

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*
