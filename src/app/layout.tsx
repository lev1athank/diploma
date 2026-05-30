import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TECHFORGE",
  description: "Экосистема вашего цифрового превосходства",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#111317]">
        <header className="size-4 w-full h-16 backdrop-blur-lg border-b border-gray-600 text-gray-400 flex items-center justify-between px-16">
          <nav className="flex gap-8 items-center">
            <Link href={"/"} className="text-blue-400">TECHFORGE</Link>
            <Link href={"/Configurator"} >Конфигурация</Link>
            <Link href={"/WorkplaceOrganization"}>Организация рабочего места</Link>
            <Link href={"/Maintenance"}>Техническое обслуживание</Link>
          </nav>
          <div className="flex gap-8 items-center">
            <span >Вход</span>
            <span className="text-black px-6 py-2 bg-blue-400">Начать сейчас</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
