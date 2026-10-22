import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Valtioneuvoston PTS & IES - Päätöksentekojärjestelmä',
  description:
    'Valtioneuvoston sähköinen päätöksenteko (PTS), istuntosovellus (IES) ja VAHVA-asianhallinta.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                Valtioneuvoston kanslia (VNK)
              </span>
              <span>•</span>
              <span>PTS / IES Päätöksentekosovellusten prototyyppi</span>
            </div>
            <div className="text-slate-400">
              Yhteensopiva Vercel Serverless -pilven kanssa • Selaintallennus & BroadcastChannel
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
