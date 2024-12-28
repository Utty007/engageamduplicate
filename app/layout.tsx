import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'EngageAm',
  description:
    'EngageAm is a peer engagement for social media plaforms and enable users to get enagagement on their accounts.',
  keywords: 'social media, engagement, likes, comment, followers',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="./favicon.ico" />
        <meta property="og:site_name" content="EngageAm" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <main className="">
          <Toaster />
          <div className="">{children}</div>
        </main>
      </body>
    </html>
  );
}
