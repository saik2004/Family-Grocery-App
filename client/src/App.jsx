import { useState } from "react";
import RoleSelect from "./Components/RoleSelect";
import MomView from "./Components/MomView";
import DadView from "./Components/DadView";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  const chooseRole = (r) => {
    localStorage.setItem("role", r);
    setRole(r);
  };

  const resetRole = () => {
    localStorage.removeItem("role");
    setRole(null);
  };

  if (!role) return <RoleSelect onChoose={chooseRole} />;
  if (role === "mom") return <MomView onReset={resetRole} />;
  return <DadView onReset={resetRole} />;
}