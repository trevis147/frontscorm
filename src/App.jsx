import React, { useEffect, useState } from "react";
import ScormProvider from "react-scorm-provider";
import Player from "./player";

const App = () => {
  const [startUrl, setStartUrl] = useState("");
  const [sco, setSco] = useState(null);

  useEffect(() => {
    window.API = "/static/conduta/imsmanifest.xml"
    fetch("/static/conduta/imsmanifest.xml")
      .then((response) => response.text())
      .then((manifestContent) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(manifestContent, "text/xml");
        const resources = xmlDoc.getElementsByTagName("resource");
        const indexResource = resources[0];

        if (indexResource) {
          const indexUrl = indexResource.getAttribute("href");
          const manifestBaseUrl = "http://localhost:3000/static/conduta/";
          const indexFullPath = new URL(indexUrl, manifestBaseUrl).toString();
          setStartUrl(indexFullPath);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o manifest:", error);
      });
  }, []);

  const handleScoInitialized = (sco) => {
    debugger;
    setSco(sco);
  };

  return (
    <>
      <ScormProvider
        debug={true}
        version="1.2"
        manifestUrl={"/static/conduta/imsmanifest.xml"}
        onScoInitialized={handleScoInitialized}
      >
        <Player sco={sco} startUrl={startUrl} />
      </ScormProvider>
    </>
  );
};

export default App;
