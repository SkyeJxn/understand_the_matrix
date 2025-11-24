import LevelOverview from "@/components/LevelOverview";
import './LearningPage.css'
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LearningPage({ params }) {
  let { mode } = params;
  return (
    <div>
      <div className="header">
        <label className="switch">
          <Link href={`/${mode === "tutorial" ? "challenge" : "tutorial"}`}>
            <input type="checkbox" checked={mode === "challenge"} readOnly></input>
            <span className="slider round"></span>
          </Link>
        </label>
        <div>{mode}s</div>
      </div>
      <LevelOverview mode={`${mode}`}></LevelOverview>
    </div>
  );
}
