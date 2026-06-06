import React from "react";
import Introduction from "../components/Introduction.jsx";
import Purpose from "../components/Purpose.jsx";
import Share from "../components/Share.jsx";
import Gamification from "../components/Gamification.jsx";
import Equipe from "../components/Equipe.jsx";

export default function Welcome() {
  return (
    <main>
      <Introduction />
      <Purpose />
      <Share />
      <Gamification />
      <Equipe />
    </main>
  );
}
