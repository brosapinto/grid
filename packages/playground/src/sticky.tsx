import * as React from "react";

interface StickyProps {
  width?: number;
  height: number;
  topOffset?: number;
  leftOffset?: number;
  marginBottom?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const Sticky: React.FC<StickyProps> = (props) => {
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
          width: props.width,
          height: props.height,
          marginBottom,
        }}
      >
        {props.children}
      </div>
      {marginBottom > 0 && <div style={{ marginBottom: -marginBottom }} />}
    </>
  );
};
