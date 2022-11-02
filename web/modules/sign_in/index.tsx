import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {store} from './service/login_store';
import { Provider } from 'react-redux'
import App from "./container/sign_in";

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);