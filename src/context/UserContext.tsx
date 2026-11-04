import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '@/types/domain';
import { isApiEnabled, SESSION_EXPIRED_EVENT } from '@/services/api/client';
import { fetchMe, clearSession, getSavedUser } from '@/services/api/authService';
import { adaptApiUser } from '@/services/adapters/authAdapter';

interface UserCtx {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;

  // Role checks (exact)
  isPublic:     boolean;
  isFieldAgent: boolean;
  isGestor:     boolean;
  isOrgao:      boolean;
  isAdmin:      boolean;

  // Access helpers (compostos)
  canAccessGestorPanel: boolean;
  canAccessAdminPanel:  boolean;
  canAccessWarRoom:     boolean;

  hasRole: (r: UserRole) => boolean;
}

const UserContext = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  // Restore the saved profile synchronously: on a page reload the route guards
  // run before /auth/me answers, and an empty profile sent every reload to the
  // login screen. The token is still verified below (and by every API call);
  // a rejected token clears the session and the guards redirect.
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    if (!localStorage.getItem('ignis_token')) return null;
    const saved = getSavedUser();
    return saved ? adaptApiUser(saved) : null;
  });

  const setProfile   = (p: UserProfile) => setProfileState(p);
  const clearProfile = () => setProfileState(null);

  useEffect(() => {
    const onExpired = () => setProfileState(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('ignis_token');
    if (!token) return;

    if (isApiEnabled()) {
      fetchMe()
        .then(user => setProfileState(adaptApiUser(user)))
        .catch(() => { clearSession(); setProfileState(null); });
    }
  }, []);

  const role = profile?.role ?? null;

  // Exact role checks
  const isPublic     = role === 'publico';
  const isFieldAgent = role === 'campo';
  const isGestor     = role === 'gestor';
  const isOrgao      = role === 'orgao' || role === 'analista';
  const isAdmin      = role === 'admin';

  // canAccessGestorPanel: gestor, orgao/analista, admin — NOT campo, NOT publico
  const canAccessGestorPanel = isGestor || isOrgao || isAdmin;

  // canAccessAdminPanel: somente admin
  const canAccessAdminPanel = isAdmin;

  // canAccessWarRoom: todos exceto publico
  const canAccessWarRoom = isGestor || isOrgao || isAdmin || isFieldAgent;

  const hasRole = (r: UserRole) => profile?.role === r;

  return (
    <UserContext.Provider value={{
      profile, setProfile, clearProfile,
      isPublic, isFieldAgent, isGestor, isOrgao, isAdmin,
      canAccessGestorPanel, canAccessAdminPanel, canAccessWarRoom,
      hasRole,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
