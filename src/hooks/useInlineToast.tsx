import { useEffect, useState } from 'react';
import { Callout } from '@/components/admin/ui';

/** Transient confirmation in the corner; announced to screen readers. */
export function useInlineToast() {
  const [toast, setToast] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  const node = toast ? (
    <div className="ig-toast" role="status" aria-live="polite">
      <Callout tone={toast.tone}>{toast.text}</Callout>
    </div>
  ) : null;
  return { show: setToast, node };
}
