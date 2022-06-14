import React, { Fragment } from "react";
import { useDropdown } from "./dropdown-context";

const List = ({ children }) => {
  const { show } = useDropdown();

  return (
    <Fragment>
      {show && (
        <div className="absolute top-full left-0 w-full bg-white shadow-sm z-20">
          {children}
        </div>
      )}
    </Fragment>
  );
};

export default List;
