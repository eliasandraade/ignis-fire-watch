import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '@/types/domain';

interface UserCtx {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  isGestor: boolean;
  isAdmin: boolean;
  hasRole: (r: UserRole) => boolean;
}

const UserContext = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);

  const setProfile = (p: UserProfile) => setProfileState(p);
  const clearProfile = () => setProfileState(null);
  const isGestor = profile?.role === 'gestor' || profile?.role === 'admin' || profile?.role === 'analista' || profile?.role === 'campo';
  const isAdmin = profile?.role === 'admin';
  const hasRole = (r: UserRole) => profile?.role === r;

  return (
    <UserContext.Provider value={{ profile, setProfile, clearProfile, isGestor, isAdmin, hasRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
