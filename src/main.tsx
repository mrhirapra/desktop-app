import "./App.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SplashScreen from "./SplashScreen";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <SplashScreen>
            <App />
        </SplashScreen>
    </React.StrictMode>,
);
