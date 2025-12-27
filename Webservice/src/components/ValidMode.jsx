import { useParams } from "react-router-dom";

export default function ValidMode({ children }) {
  const { mode } = useParams();
  const valid = ["tutorial", "challenge"];

  if (!valid.includes(mode)) {
    return <div>Page not found</div>;
  }

  return children;
}
