import classNames from "classnames";
import React from "react";

const Modal = ({ children, visible }) => {
  return (
    <div
      className={classNames(
        "absolute top-0 right-0 w-screen h-screen bg-black/50 flex items-center justify-center",
        { hidden: !visible }
      )}
    >
      {children}
    </div>
  );
};

export default Modal;
