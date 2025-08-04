
// This layout can be used to further protect admin routes in the future.
// For now, it simply renders its children.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
