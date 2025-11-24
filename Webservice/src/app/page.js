import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header></Header>
      <MainContent></MainContent>
      <StartButton></StartButton>
    </div>
  );
}

function Header() {
  return (<div className="header"> Understand the Matrix</div>);
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
      <Link href={`/tutorial`}>
        <button className="button"> Start Learning </button>
      </Link>
    </div>
  );
}