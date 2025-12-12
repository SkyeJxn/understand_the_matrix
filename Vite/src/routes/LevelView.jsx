import LevelOverview from "@/components/LevelOverview";
import Header from "@/components/Header";
import { useParams, Link } from "react-router-dom";

export default function LevelView() {
  let { mode } = useParams();
  return (
    <div>
      <Header>
        <label className="switch">
          <Link to={`/${mode === "tutorial" ? "challenge" : "tutorial"}`}>
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
