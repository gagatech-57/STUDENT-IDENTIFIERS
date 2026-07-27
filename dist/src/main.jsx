/**
 * Main Entry Point for React Application
 */

import { App } from "./App.jsx";

const rootElement = document.getElementById("root");
if (rootElement) {
    const ReactDOMObj = typeof ReactDOM !== "undefined" ? ReactDOM : (window.ReactDOM || {});
    if (ReactDOMObj.createRoot) {
        const root = ReactDOMObj.createRoot(rootElement);
        root.render(<App />);
    }
}
