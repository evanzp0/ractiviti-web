import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Button } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import App from './app'

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);