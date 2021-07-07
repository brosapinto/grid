import React from "react";

interface StickyProps {
  topOffset?: number;
  leftOffset?: number;
  marginBottom?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Thin abstraction to wrap all children in a sticky container
 * The raison d'etre is to hide the hack of stopping position sticky before the
 * element reaches the bottom of its ancestor (when using marginBottom)
 */
const Sticky: React.FC<StickyProps> = (props) => {
  const {
    topOffset = 0,
    leftOffset = 0,
    marginBottom = 0,
    style = {},
    className,
  } = props;

  return (
    <>
      <div
        className={className}
        style={{
          ...style,
          position: "sticky",
          top: topOffset,
          left: leftOffset,
          marginBottom,
        }}
      >
        {props.children}
      </div>
      {marginBottom > 0 && <div style={{ marginBottom: -marginBottom }} />}
    </>
  );
};

export default Sticky;
