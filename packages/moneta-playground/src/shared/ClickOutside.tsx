import React, { useRef, useEffect } from "react";

const ClickOutside: React.FC<{ onClick: (evt: MouseEvent) => void }> = ({
  children,
  onClick,
  ...otherProps
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    const handleMouseDown = (evt: MouseEvent) =>
      !node!.contains(evt.target as Node) && onClick(evt);

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClick]);

  return (
    <div {...otherProps} ref={ref}>
      {children}
    </div>
  );
};

export default ClickOutside;
