import { TutorialLevel } from "@/components/TutorialLevel";

export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div>
      <div className="header">{mode} - Level {id}</div>
      {mode === 'tutorial' && (<TutorialLevel level_id={id}></TutorialLevel>)}
    </div>
  );
}
