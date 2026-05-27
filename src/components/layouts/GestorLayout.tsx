import { Outlet } from 'react-router-dom';
import { GestorSidebar } from '@/components/shared/GestorSidebar';
import { GestorTopbar } from '@/components/shared/GestorTopbar';

export function GestorLayout() {
  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-void)',
    }}>
      <GestorSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <GestorTopbar />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-deep)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
