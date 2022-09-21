import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./sign_in";

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(<App></App>);