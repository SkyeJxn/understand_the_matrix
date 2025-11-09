import LevelOverview from "@/components/LevelOverview";
import Link from "next/link";

export default async function LearningPage({ params }) {
  let { mode } = await params;
  return (
    <div>
      <div className="header">{mode}s</div>
      <LevelOverview></LevelOverview>
    </div>
  );
}
