import "../styles/globals.css";
import '../styles/LearningPage.css';
import { PrimeReactProvider } from "primereact/api";
import "katex/dist/katex.min.css";
import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
        
export const metadata = {
  title: "Understand the Matrix",
  description: "A learning platform for matrix equations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='theme-green'>
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
