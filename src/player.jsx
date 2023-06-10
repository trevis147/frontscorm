import React, { useEffect } from "react";
import { withScorm } from "react-scorm-provider";

const Player = ({ sco, startUrl }) => {
  const getStatus = () => {
    const url = startUrl;
    const windowName = "MinhaJanelaSuspensa";
    const windowFeatures = "width=500,height=400";

    const popupWindow = window.open(url, windowName, windowFeatures);
    debugger;
    popupWindow.API = sco.api;
    const checkAPI = setInterval(() => {
      if (popupWindow && popupWindow.API) {
        clearInterval(checkAPI);

        const scormAPI = popupWindow.API;
        // Agora você pode usar o objeto scormAPI para interagir com o SCORM dentro da janela aberta

        // Exemplo de uso:
        const lessonLocation = scormAPI.LMSGetValue("cmi.core.lesson_location");
        const score = scormAPI.LMSGetValue("cmi.core.score.raw");

        console.log("Lesson Location:", lessonLocation);
        console.log("Score:", score);
      }
    }, 500);
  };

  return (
    <div>
      <h2>Player</h2>

      <button onClick={getStatus}>teste</button>
    </div>
  );
};

export default withScorm()(Player);
