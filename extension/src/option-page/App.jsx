import React, {useEffect, useState} from "react";
import Permissions from "./Permissions";
import NavBar from "./NavBar";
import ConnectionChecker from "./ConnectionChecker";
import voice from "../services/voiceService";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  useEffect(() => {
  	(async()=>{
  		const {state} = await voice.permissionGranted;
  		setLoading(false);
  	if (state == 'granted') {
  		setPermissionGranted(true);
  	} else {
  		setPermissionGranted(false);
  	}
  	})()
  }, [])
  return (
    <>
      <NavBar />
      {!loading && permissionGranted ? <ConnectionChecker /> : <Permissions />}
    </>
  );
}
