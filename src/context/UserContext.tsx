import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '@/types/domain';

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
  const [profile, setProfileState] = useState<UserProfile | null>(null);

  const setProfile  = (p: UserProfile) => setProfileState(p);
  const clearProfile = () => setProfileState(null);

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
