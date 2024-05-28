import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-tailwind/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
const GOOGLE_CLIENT_ID=import.meta.env.VITE_GOOGLE_CLIENT_ID;
import "./index.css";
import ErrorBoundary from "./components/ErrorBounderies.tsx";
import { persistor, store } from "./service/redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
    <ThemeProvider>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
        </GoogleOAuthProvider>
      </Provider>
    </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
