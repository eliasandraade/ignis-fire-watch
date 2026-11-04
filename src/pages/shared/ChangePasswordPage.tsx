import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, LogOut, Orbit } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { changeOwnPassword, clearSession, saveSession } from '@/services/api/authService';
import { adaptApiUser, getRouteForRole } from '@/services/adapters/authAdapter';
import { Callout, Field, Spinner } from '@/components/admin/ui';
import { errorMessage } from '@/lib/apiErrors';

const MIN = 12;

export default function ChangePasswordPage() {
  const { profile, setProfile, clearProfile } = useUser();
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const forced = profile?.mustChangePassword === true;
  const mismatch = confirm.length > 0 && confirm !== next;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return;
    setSaving(true);
    setError(null);
    try {
      const session = await changeOwnPassword(current, next);
      saveSession(session);
      const updated = adaptApiUser(session.user);
      setProfile(updated);
      navigate(getRouteForRole(updated.role), { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    clearSession();
    clearProfile();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-void)', padding: 16 }}>
      <main className="ig-panel" style={{ width: 'min(440px, 100%)', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span className="ig-brand-mark"><Orbit size={18} /></span>
          <div>
            <div className="ig-brand-name">IGNIS Orbital</div>
            <div className="ig-brand-sub">by Andrade Systems</div>
          </div>
        </div>
        <h1 style={{ fontSize: 20, margin: '0 0 6px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <KeyRound size={18} /> {forced ? 'Defina sua senha' : 'Trocar senha'}
        </h1>
        <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--text-lo)', lineHeight: 1.5 }}>
          {forced
            ? 'Sua conta usa uma senha provisória. Para continuar, escolha uma senha pessoal. As outras sessões abertas serão encerradas.'
            : 'Ao trocar a senha, as outras sessões abertas com a senha anterior são encerradas.'}
        </p>
        <form onSubmit={e => void submit(e)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label={forced ? 'Senha provisória' : 'Senha atual'}>
            <input className="ig-input" type="password" value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" required />
          </Field>
          <Field label="Nova senha" hint={`Pelo menos ${MIN} caracteres, com variedade. Senhas conhecidas são recusadas.`}>
            <input className="ig-input" type="password" value={next} onChange={e => setNext(e.target.value)} autoComplete="new-password" minLength={MIN} required />
          </Field>
          <Field label="Confirme a nova senha" error={mismatch ? 'As senhas não coincidem.' : undefined}>
            <input className="ig-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" aria-invalid={mismatch} required />
          </Field>
          {error && <Callout tone="err">{error}</Callout>}
          <button type="submit" className="ig-btn primary" disabled={saving || mismatch || next.length < MIN}>
            {saving && <Spinner />} Salvar nova senha
          </button>
          <button type="button" className="ig-btn ghost" onClick={forced ? logout : () => navigate(-1)}>
            {forced ? <><LogOut size={15} /> Sair</> : 'Cancelar'}
          </button>
        </form>
      </main>
    </div>
  );
}
