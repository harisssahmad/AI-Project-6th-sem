import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SubmitForm from "./SubmitForm";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <div className="main-heading">
            <h1 className="dm-mono-medium">
                pl<span className="dm-mono-medium-italic">AI</span>giarism
            </h1>
            <p className="main-desc dm-mono-regular">
                Your AI code checker / plagiarism detector.
            </p>
        </div>
        <SubmitForm />
    </React.StrictMode>
);
reportWebVitals();
