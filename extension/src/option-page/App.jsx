import React from "react";
import Permissions from "./Permissions";
import NavBar from "./NavBar";
import ConnectionChecker from "./ConnectionChecker";
import voice from "../services/voiceService";

export default function App() {
  return (
    <>
      <NavBar />
      {voice.permissionGranted() ? <ConnectionChecker /> : <Permissions />}
    </>
  );
}
