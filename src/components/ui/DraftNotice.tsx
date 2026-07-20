export function DraftNotice({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-accent/40 bg-accent/5 px-2.5 py-1 font-mono text-xs uppercase tracking-widest text-accent">
      {children}
    </span>
  );
}
