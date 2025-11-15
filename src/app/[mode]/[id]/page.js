import Gauss from "@/components/Level_2_gauss";

export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div>
      <div className="header">{mode} - Level {id}</div>
      {mode === 'challenge' && id == 2 && (<Gauss />) }
    </div>
  );
}

