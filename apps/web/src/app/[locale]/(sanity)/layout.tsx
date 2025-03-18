export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
