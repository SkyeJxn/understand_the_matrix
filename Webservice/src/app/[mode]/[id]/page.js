import Header from "@/components/Header";
import { Badge } from "primereact/badge";
import { LevelRenderer } from "@/components/LevelRenderer";

export const dynamic = "force-dynamic";

export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div style={{height: '100vh',display: 'flex',flexDirection: 'column', overflow: 'hidden'}}>
      <Header>{mode}<Badge value={id} style={{background: 'var(--color4)',}}/></Header>
      <LevelRenderer mode={mode} level_id={id}/>
    </div>
  );
}