export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black px-2 py-1 text-xs font-semibold uppercase text-white">
      {children}
    </div>
  );
}
