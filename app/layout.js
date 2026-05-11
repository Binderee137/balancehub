import "./globals.css";

export const metadata = {
  title: "BalanceHub — AI Хоол & Дасгалын Төлөвлөгч",
  description: "Монголын анхны AI хоол, дасгалын хувийн төлөвлөгч. Таны биед тохирсон хоол, дасгалын төлөвлөгөөг автоматаар үүсгэнэ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
