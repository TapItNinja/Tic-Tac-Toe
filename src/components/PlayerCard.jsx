import React from "react";

const PlayerCard = ({ player, symbol, name, score, isActive }) => {
  return (
    <div
      className={`player-card player-${symbol.toLowerCase()} ${isActive
        ? "active"
        : ""}`}
    >
      <div className="player-symbol">
        {symbol}
      </div>
      <div className="player-name">
        {name}
      </div>
      <div className="player-score">
        {score}
      </div>
    </div>
  );
};

export default PlayerCard;
