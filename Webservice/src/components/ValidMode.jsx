import { useParams } from "react-router-dom";
import Header from "./Header";

export default function ValidMode({ children }) {
  const { mode } = useParams();
  const valid = ["tutorial", "challenge"];

  if (!valid.includes(mode)) {
    return <div>
      <Header />
      <div>Page not found</div>
    </div>;
  }

  return children;
}
