
import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { AuthProvider } from '@/components/shared/AuthProvider';
import { BillingProvider } from '@/hooks/use-billing';

export const metadata: Metadata = {
  title: 'BrightEco Pay for Schools',
  description: 'Clean, reliable solar energy for educational institutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <BillingProvider>
              {children}
              <Toaster />
            </BillingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
