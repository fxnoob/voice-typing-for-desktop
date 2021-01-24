import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { checkConnectionSR } from "../services/socketClient";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [connected, setConneted] = useState(false);
  useEffect(() => {
    const { listen, emit } = checkConnectionSR();
    emit("connected");
    listen(() => {
      setConneted(true);
      setLoading(false);
    });
  }, []);
  return (
    <div style={{ maxWidth: "40rem", textAlign: "center", margin: 'auto' }}>
      {loading ? (
        <Alert severity="info">connecting to the Desktop App...</Alert>
      ) : connected ? (
        <Alert severity="success">
          Connected to the Desktop App. Operate it from there.
        </Alert>
      ) : (
        ""
      )}
    </div>
  );
}
