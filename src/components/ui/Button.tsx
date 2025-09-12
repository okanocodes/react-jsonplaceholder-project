import React from "react";

type ButtonProps = {
  kind?: "primary" | "edit" | "delete";
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "submit" | "reset";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  kind = "primary",
  children,
  onClick,
  type,
  ...rest
}: ButtonProps) {
  // if type is not provided, default to "button"
  // if type is submit class should be submit-btn
  // if type is reset class should be reset-btn
  // if type is button class should be btn
  // write a function that returns the correct class based on the type
  // use the function to set the className of the button

  function getButtonClass(type: ButtonProps["kind"]) {
    switch (type) {
      case "edit":
        return "bg-yellow-400 text-warning-content shadow-sm shadow-yellow-500 border-transparent hover:bg-yellow-500 ";
      case "delete":
        return "btn-error";
      case "primary":
      default:
        return "btn-success";
    }
  }

  return (
    <button
      className={`btn ${getButtonClass(kind)} flex items-center gap-1`}
      onClick={onClick}
      {...rest}
      type={type || "button"} // default to "button" if type is not provided
    >
      {children}
    </button>
  );
}
