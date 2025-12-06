import { TutorialLevel } from "@/components/TutorialLevel";
import Gauss from "@/components/Level_2_gauss";
import Header from "@/components/Header";
import { Badge } from "primereact/badge";
import { ChallengeLevel } from "@/components/ChallengeLevel";

export const dynamic = "force-dynamic";

export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div style={{height: '100vh',display: 'flex',flexDirection: 'column', overflow: 'hidden'}}>
      <Header>{mode}<Badge value={id} style={{background: 'var(--color4)',}}/></Header>
      {mode === 'tutorial' && (<TutorialLevel level_id={id}/>)}
      {mode === 'challenge' && (<ChallengeLevel level_id={id}/>)}
      {mode === 'challenge' && id == 2 && (<Gauss />) }

    </div>
  );
}