import './globals.css';
import type { Metadata } from 'next';
import ThemeToggle from '../components/ThemeToggle';

export const metadata: Metadata = {
  title: 'GymTrack AI',
  description: 'Track sessions and get AI coaching',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#111' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-5xl mx-auto p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">GymTrack AI</h1>
            <div className="flex items-center gap-2">
              <a className="underline" href="/coach">AI Coach</a>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </div>

        {/* PWA SW registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
