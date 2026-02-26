// Required by next-intl when using localized not-found pages.
// This is a minimal root layout that passes children through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
