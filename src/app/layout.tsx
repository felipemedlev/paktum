// Required by next-intl: minimal root layout shell that lets the [locale] layout
// do the real work (html lang, body classes, providers, etc.)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
