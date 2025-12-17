import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PrimeReactProvider } from "primereact/api";
import App from './app.jsx'
import "./styles/globals.css";
import './styles/LearningPage.css';
import "katex/dist/katex.min.css";
import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
        
export const metadata = {
  title: "Understand the Matrix",
  description: "A learning platform for matrix equations.",
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </BrowserRouter>
)
