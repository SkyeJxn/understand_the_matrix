import LevelOverview from "@/components/LevelOverview";
import Link from "next/link";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function LearningPage({ params }) {
  let { mode } = await params;
  return (
    <div>
      <Header>
        <label className="switch">
          <Link href={`/${mode === "tutorial" ? "challenge" : "tutorial"}`}>
            <input type="checkbox" checked={mode === "challenge"} readOnly></input>
            <span className="slider round"></span>
          </Link>
        </label>
        <div>{mode}s</div>
      </Header>
      <LevelOverview mode={`${mode}`}></LevelOverview>
    </div>
  );
}
