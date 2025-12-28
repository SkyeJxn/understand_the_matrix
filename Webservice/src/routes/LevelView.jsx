import LevelOverview from "@/components/LevelOverview";
import Header from "@/components/Header";
import { useParams, useNavigate } from "react-router-dom";

export default function LevelView() {
  let { mode } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <Header>
        <label className="switch">
          <input 
            aria-label="Switch between tutorial and challenge modes"
            type="checkbox" 
            checked={mode === "challenge"} 
            onChange={() =>
              navigate(`/${mode === "tutorial" ? "challenge" : "tutorial"}`)
            }
          />
          <span className="slider round"></span>
        </label>
        <div>{mode}s</div>
      </Header>
      <LevelOverview ></LevelOverview>
    </div>
  );
}
