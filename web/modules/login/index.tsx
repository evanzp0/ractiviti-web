import * as React from "react";
import * as ReactDOM from "react-dom/client";

const Login: React.FC = () => {
    return <h1>My React Login</h1>
} 

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(<Login />);