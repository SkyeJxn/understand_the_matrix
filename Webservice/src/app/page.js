import Link from "next/link";
import { Button } from 'primereact/button';
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header home={true}>Understand the Matrix</Header>
      <MainContent></MainContent>
    </div>
  );
}

function MainContent() {
  return (
    <div className="main_content">
      <p>Welcome to understand the matrix, a matrix equations learning platform.</p>
      <StartButton></StartButton>
    </div>
  );
}

function StartButton() {
  return (
    <div>
      <Link href={`/tutorial`}>
        <Button className="start_btn" label="Start Learning" outlined/>
      </Link>
    </div>
  );
}