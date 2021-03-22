import React from "react";
import "./Button.css";

const Button = ({ onClick, disabled, children }) => {
  return (
    <button disabled={disabled} onClick={onClick} className="button-container">
      {children}
    </button>
  );
};

export { Button };
