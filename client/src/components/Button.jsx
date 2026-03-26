import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  // main-primary btn
  const primaryClasses =
    "cursor-pointer bg-blue-600 hover:bg-accentHover text-white font-semibold py-3.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2";

  // secondary btns
  const secondaryClasses =
    "cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-6 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2";

  // cancel/close btns
  const ternaryClasses =
    "cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center";

  let appliedClasses = "";
  if (variant === "primary") appliedClasses = primaryClasses;
  else if (variant === "secondary") appliedClasses = secondaryClasses;
  else if (variant === "ternary") appliedClasses = ternaryClasses;

  return (
    <button className={`${appliedClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
