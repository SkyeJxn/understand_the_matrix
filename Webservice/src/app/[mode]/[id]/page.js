import { TutorialLevel } from "@/components/TutorialLevel";
import Gauss from "@/components/Level_2_gauss";

export const dynamic = "force-dynamic";

export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div>
      <div className="header">{mode} - Level {id}</div>
      {mode === 'tutorial' && (<TutorialLevel level_id={id}/>)}
      {mode === 'challenge' && id == 2 && (<Gauss />) }
    </div>
  );
}