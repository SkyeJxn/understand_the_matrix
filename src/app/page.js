import LevelOverview from "./components/LevelOverview";

export default function Home() {
  return (
    <div>
      <Header></Header>
      <MainContent></MainContent>
      <StartButton></StartButton>
      <LevelOverview></LevelOverview>
    </div>
  );
}

function Header() {
  return (<div id="landing_header"> Understand the Matrix</div>);
}

function MainContent() {
  return (
    <div className="body">
      <p> Welcome to understand the matrix, a matrix equations learning platform.</p>
    </div>
  );
}

function StartButton() {
  return (
    <div>
      <button className="button"> Start Learning </button>
    </div>
  );
}
