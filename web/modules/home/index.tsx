import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Button } from '@mui/material';

function App() {
    return (
        <Button variant="contained" color="primary">
            你好，世界
        </Button>
    );
}

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(<App />);