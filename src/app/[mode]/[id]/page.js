export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return (
    <div>
      <div className="header">{mode} - Level {id}</div>
    </div>
  );
}
