import { NavBar } from "@/components/layout/NavBar";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "WC26 Tahmin | 2026 FIFA Dünya Kupası Simülasyonu",
	description:
		"48 takımı gruplardan finale simüle et, şampiyonunu seç ve tahmin kartını arkadaşlarınla paylaş. 2026 FIFA Dünya Kupası tahmin oyunu.",
	appleWebApp: {
		title: "WC26 Tahmin",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='tr' className={`${manrope.variable} h-full antialiased`}>
			<body className='min-h-full flex flex-col bg-surface-soft'>
				<NavBar />
				<main className='flex-1'>{children}</main>
			</body>
		</html>
	);
}
