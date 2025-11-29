import { TutorialLevel } from "@/components/TutorialLevel";
import Gauss from "@/components/Level_2_gauss";
import Header from "@/components/Header";
import { Badge } from "primereact/badge";

export const dynamic = "force-dynamic";

export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div>
      <Header>{mode}<Badge value={id} style={{background: 'var(--color4)',}}/></Header>
      {mode === 'tutorial' && (<TutorialLevel level_id={id}/>)}
      {mode === 'challenge' && id == 2 && (<Gauss />) }
    </div>
  );
}