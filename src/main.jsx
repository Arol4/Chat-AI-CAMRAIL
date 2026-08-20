import React from 'react'
import ReactDOM from 'react-dom/client'
import keycloak from "./services/keycloak";
import App from './App'
import './index.css'


keycloak
  .init({
    onLoad: "login-required",
    pkceMethod: "S256",
  })
  .then((authenticated) => {
    console.log("Authentifié :", authenticated);

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Erreur Keycloak :", error);
  });