import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { usePageView } from '../hooks/usePageView';
import PageView from "./components/pageView";

export const metadata: Metadata = {

	title: {
		default: "tadeasfort.com",
		template: "%s | tadeasfort.com",
	},
	description: "Data engineer at day, web developer at night.",
	openGraph: {
		title: "tadeasfort.com",
		description:
			"Data engineer at day, web developer at night.",
		url: "https://tadeasfort.com",
		siteName: "tadeasfort.com",
		images: [
			{
				url: "https://chronark.com/og.png",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Tadeas Fort",
		card: "summary_large_image",
	},
	icons: {
		shortcut: "/favicon.png",
	},
};
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
  });
  
  const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
  });
  
  export default function RootLayout({
	children,
  }: {
	children: React.ReactNode;
  }) {
	return (
	  <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
		<head>
		  <Analytics />
		</head>
		<body
		  className={`bg-black ${
			process.env.NODE_ENV === "development" ? "debug-screens" : undefined
		  }`}
		>
		  <PageView /> {/* use the component here */}
		  {children}
		</body>
	  </html>
	);
  }
  