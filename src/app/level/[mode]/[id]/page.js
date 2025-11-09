export default async function LevelPage({ params }) {
  const { mode, id } = await params;
  return <h1>{mode} – Level {id}</h1>;
}
