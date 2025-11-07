import "./globals.css";

export const metadata = {
  title: "Understand the Matrix",
  description: "A learning platform for matrix equations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
