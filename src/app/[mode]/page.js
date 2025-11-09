import LevelOverview from "@/components/LevelOverview";
import Link from "next/link";

export default async function LearningPage({ params }) {
  let { mode } = await params;
  return (
    <div>
      <h1>{mode} mode</h1>
      <LevelOverview></LevelOverview>
    </div>
  );
}
