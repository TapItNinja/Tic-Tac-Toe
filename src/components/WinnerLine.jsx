import React from "react";

const WinnerLine = ({ winningLine }) => {
  if (!winningLine) return null;

  const { line, type } = winningLine;

  let lineStyles = {};

  if (type === "horizontal") {
    // For horizontal lines, position based on row (0, 1, or 2)
    const row = Math.floor(line[0] / 3);
    lineStyles = {
      top: `calc(${row * 33.33}% + 16.67%)`,
      left: "5%",
      width: "90%",
      height: "8px"
    };
  } else if (type === "vertical") {
    // For vertical lines, position based on column (0, 1, or 2)
    const col = line[0] % 3;
    lineStyles = {
      left: `calc(${col * 33.33}% + 16.67%)`,
      top: "5%",
      width: "8px",
      height: "90%"
    };
  } else if (type === "diagonal-1") {
    // For diagonal from top-left to bottom-right
    lineStyles = {
      left: "5%",
      top: "5%",
      width: "120%",
      height: "8px",
      transform: "rotate(45deg)",
      transformOrigin: "top left"
    };
  } else if (type === "diagonal-2") {
    // For diagonal from top-right to bottom-left
    lineStyles = {
      right: "5%",
      top: "5%",
      width: "120%",
      height: "8px",
      transform: "rotate(-45deg)",
      transformOrigin: "top right"
    };
  }

  return <div className={`winner-line ${type}`} style={lineStyles} />;
};

export default WinnerLine;
