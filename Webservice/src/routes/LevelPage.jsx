import { useParams } from "react-router-dom";
import { Badge } from "primereact/badge";
import { LevelRenderer } from "@/components/LevelRenderer";
import Header from "../components/Header";
import { Footer } from "../components/Footer";

export default function LevelPage() {
  const { mode, id } = useParams();
  return (
    <div style={{height: '100vh',display: 'flex',flexDirection: 'column', overflow: 'hidden'}}>
      <Header>{mode}<Badge value={id} style={{background: 'var(--color4)',}}/></Header>
      <LevelRenderer />
      <Footer/>
    </div>
  );
}
