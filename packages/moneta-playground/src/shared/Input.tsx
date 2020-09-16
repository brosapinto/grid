import React, { FormEventHandler, useState } from "react";
import ClickOutside from "./ClickOutside";

interface InputProps {
  defaultValue: string;
  onChange: (nextVal: string, prevValue: string) => void;
  onBlur: () => void;
}
const Input: React.FC<InputProps> = ({ defaultValue, onChange, onBlur }) => {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit: FormEventHandler = (evt) => {
    evt.preventDefault();
    onChange(value, defaultValue);
  };

  return (
    <ClickOutside onClick={onBlur}>
      <form
        onSubmit={handleSubmit}
        onKeyUp={(evt) => evt.key === "Enter" && onBlur()}
      >
        <input
          autoFocus
          value={value}
          onFocus={(evt) => evt.target.select()}
          onChange={(evt) => setValue(evt.target.value)}
        />
      </form>
    </ClickOutside>
  );
};

export default Input;
