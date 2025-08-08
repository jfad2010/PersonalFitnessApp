import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GymTrack AI',
  description: 'Track sessions and get AI coaching',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <div className="max-w-5xl mx-auto p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">GymTrack AI</h1>
            <a className="underline" href="/coach">AI Coach</a>
          </header>
          {children}
        </div>
              <script>
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        </script>
      </body>
    </html>
  );
}
