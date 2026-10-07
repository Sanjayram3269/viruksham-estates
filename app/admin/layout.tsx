export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
