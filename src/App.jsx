import React, { useEffect, useState } from "react";
import ScormProvider from "react-scorm-provider";
import Player from "./player";

const App = () => {
  const [startUrl, setStartUrl] = useState("");
  const [sco, setSco] = useState(null);

  useEffect(() => {
    window.API = 'https://scorm2.vercel.app/imsmanifest.xm'
    
    fetch("https://scorm2.vercel.app/imsmanifest.xml")
      .then((response) => response.text())
      .then((manifestContent) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(manifestContent, "text/xml");
        const resources = xmlDoc.getElementsByTagName("resource");
        debugger
        const indexResource = resources[0]; 

        if (indexResource) {
          const indexUrl = indexResource.getAttribute("href");
          const manifestBaseUrl = "https://scorm2.vercel.app/"; 
          const indexFullPath = new URL(indexUrl, manifestBaseUrl).toString();
          setStartUrl(indexFullPath);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o manifest:", error);
      });
  }, []);

  const handleScoInitialized = (sco) => {
    debugger
    setSco(sco);
  };

  return (
    <>
      <h1>We've got a connection just by including ScormProvider!</h1>
      <p>
        I'm a child with no access to the ScormProvider's props. But the
        ScoLearner component is enhanced with withScorm()!
      </p>
      <ScormProvider
        manifestUrl={"https://scorm2.vercel.app/imsmanifest.xml"}
        onScoInitialized={handleScoInitialized}
      >
        <Player sco={sco} startUrl={startUrl} />
      </ScormProvider>
    </>
  );
};

export default App;
