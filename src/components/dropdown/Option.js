import React from "react";
import { useDropdown } from "./dropdown-context";

const Option = (props) => {
  const { onClick } = props;
  const { setShow } = useDropdown();
  const handleClick = () => {
    // khi click vào nếu có onClick thì sẽ thực hiện hàm này và setShow thành false để tắt dropdown đi
    onClick && onClick();
    setShow(false);
  };

  return (
    <div
      className="py-4 px-5 cursor-pointer flex items-center justify-between hover:text-primary transition-all text-sm"
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Option;
