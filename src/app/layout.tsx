import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "오진우 — Fullstack Developer",
  description:
    "코드를 쓰는 건 사람, 속도를 내는 건 AI. Claude Code를 도구로 쓰는 풀스택 개발자 오진우의 포트폴리오입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${spaceGrotesk.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
