import React, { useEffect } from "react";
import { withScorm } from "react-scorm-provider";

const Player = ({ sco, startUrl }) => {
  useEffect(() => {
    console.log(sco);
    if (sco && sco.apiConnected) {
      const api = sco.getAPI();
      const success = api.Initialize("");

      if (success) {
        const lessonLocation = api.GetValue("cmi.core.lesson_location");
        console.log("Lesson Location:", lessonLocation);
      } else {
        console.error("Failed to initialize the SCORM API");
      }
    }
  }, [sco]);

  const getStatus = () => {
    const iframe = document.getElementById('scormPlay');
    console.log(iframe)
    debugger
      // Acesso ao evento n.SCORM.data.get dentro do iframe
      iframe.contentWindow.n.SCORM.data.get();
  };

  return (
    <div>
      <h2>Player</h2>
      <iframe
        id="scormPlay"
        src={startUrl}
        title="SCORM Player"
        width="800"
        height="600"
      />
      <button onClick={getStatus}>teste</button>
    </div>
  );
};

export default withScorm()(Player);
