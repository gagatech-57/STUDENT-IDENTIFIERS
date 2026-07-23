/**
 * Main React Application Entry Point
 * Imports modular App component and mounts to DOM root
 */

import { App } from "./src/App.jsx";

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
