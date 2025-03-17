import React from "react";

const Confetti = ({ confetti }) => {
  return (
    <div className="confetti-container">
      {confetti.map(item =>
        <div
          key={item.id}
          className="confetti"
          style={{
            left: `${item.x}px`,
            backgroundColor: item.color,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: `${item.delay}s`
          }}
        />
      )}
    </div>
  );
};

export default Confetti;
