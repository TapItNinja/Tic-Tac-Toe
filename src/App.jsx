import React, { useState, useEffect, useRef } from "react";
import Board from "./components/Board";
import PlayerCard from "./components/PlayerCard";
import Settings from "./components/Settings";
import WinnerLine from "./components/WinnerLine";
import Confetti from "./components/Confetti";
import "./styles/App.css";

const App = () => {
  // Game state
  const [gameMode, setGameMode] = useState("1v1");
  const [difficulty, setDifficulty] = useState("medium");
  const [boardHistory, setBoardHistory] = useState([Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    ties: 0
  });
  const [winningLine, setWinningLine] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    sound: true,
    animations: true,
    darkMode: true,
    showMoves: true
  });
  const [confetti, setConfetti] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [moveCount, setMoveCount] = useState(0);
  const [playerNames, setPlayerNames] = useState({
    X: "Player 1",
    O: "Player 2"
  });

  const boardRef = useRef(null);
  const currentSquares = boardHistory[currentStep];

  // Update player names when game mode changes
  useEffect(
    () => {
      setPlayerNames({
        X: "Player 1",
        O: gameMode === "1v1" ? "Player 2" : "AI"
      });
    },
    [gameMode]
  );

  // Sound effect handler
  const playSound = sound => {
    if (settings.sound && sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  // Generate confetti for wins
  const generateConfetti = () => {
    if (!settings.animations) return;

    const colors = ["#6c5ce7", "#00cec9", "#fdcb6e", "#ff7675", "#74b9ff"];
    const confettiCount = 100;
    const newConfetti = [];

    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: `confetti-${i}`,
        x: Math.random() * window.innerWidth,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 5
      });
    }

    setConfetti(newConfetti);

    // Remove confetti after animation
    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };

  // Calculate winner
  const calculateWinner = squares => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        const lineType =
          i < 3
            ? "horizontal"
            : i < 6 ? "vertical" : i === 6 ? "diagonal-1" : "diagonal-2";

        return {
          winner: squares[a],
          line: lines[i],
          type: lineType
        };
      }
    }

    if (squares.every(square => square !== null)) {
      return { winner: "tie" };
    }

    return null;
  };

  // Handle winner
  const handleWinner = result => {
    setGameOver(true);
    setWinningLine(
      result.winner !== "tie"
        ? {
            line: result.line,
            type: result.type,
            winner: result.winner
          }
        : null
    );

    if (result.winner === "tie") {
      setScores(prevScores => ({
        ...prevScores,
        ties: prevScores.ties + 1
      }));
    } else {
      generateConfetti();
      setScores(prevScores => ({
        ...prevScores,
        [result.winner]: prevScores[result.winner] + 1
      }));
    }
  };

  // Find best move for AI
  const findBestMove = (board, difficulty) => {
    const emptySquares = board
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);

    if (emptySquares.length === 0) return null;

    if (difficulty === "easy") {
      return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    if (difficulty === "medium" && Math.random() < 0.5) {
      return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    // Check for winning move
    for (let i of emptySquares) {
      const boardCopy = [...board];
      boardCopy[i] = "O";
      const result = calculateWinner(boardCopy);
      if (result && result.winner === "O") {
        return i;
      }
    }

    // Check for blocking move
    for (let i of emptySquares) {
      const boardCopy = [...board];
      boardCopy[i] = "X";
      const result = calculateWinner(boardCopy);
      if (result && result.winner === "X") {
        return i;
      }
    }

    // Take center if available
    if (board[4] === null) return 4;

    // Take corners if available
    const corners = [0, 2, 6, 8].filter(corner => board[corner] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take sides if available
    const sides = [1, 3, 5, 7].filter(side => board[side] === null);
    if (sides.length > 0) {
      return sides[Math.floor(Math.random() * sides.length)];
    }

    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // Handle square click
  const handleClick = i => {
    if (
      gameOver ||
      currentSquares[i] ||
      (gameMode === "1vCPU" && !xIsNext && !aiThinking)
    ) {
      return;
    }

    const newHistory = boardHistory.slice(0, currentStep + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = [...current];

    squares[i] = xIsNext ? "X" : "O";

    setBoardHistory([...newHistory, squares]);
    setCurrentStep(newHistory.length);
    setXIsNext(!xIsNext);
    setMoveCount(moveCount + 1);

    // Check for winner
    const result = calculateWinner(squares);
    if (result) {
      handleWinner(result);
    }
  };

  // AI Move
  useEffect(
    () => {
      if (gameMode === "1vCPU" && !xIsNext && !gameOver) {
        setAiThinking(true);

        // Add a small delay to make AI feel more natural
        const delay = Math.random() * 300 + 500;

        const aiMoveTimeout = setTimeout(() => {
          const current = boardHistory[currentStep];
          const bestMove = findBestMove(current, difficulty);

          if (bestMove !== null) {
            const newSquares = [...current];
            newSquares[bestMove] = "O";

            setBoardHistory(prev => [
              ...prev.slice(0, currentStep + 1),
              newSquares
            ]);
            setCurrentStep(prev => prev + 1);
            setXIsNext(true);
            setMoveCount(prev => prev + 1);

            // Check for winner after AI move
            const result = calculateWinner(newSquares);
            if (result) {
              handleWinner(result);
            }
          }

          setAiThinking(false);
        }, delay);

        return () => clearTimeout(aiMoveTimeout);
      }
    },
    [xIsNext, gameMode, gameOver, currentStep, difficulty, boardHistory]
  );

  // Reset game
  const resetGame = () => {
    setBoardHistory([Array(9).fill(null)]);
    setCurrentStep(0);
    setXIsNext(true);
    setWinningLine(null);
    setGameOver(false);
    setMoveCount(0);
    setAiThinking(false);
  };

  // Undo move
  const undoMove = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setXIsNext(!xIsNext);
      setWinningLine(null);
      setGameOver(false);
      setMoveCount(moveCount - 1);
    }
  };

  // Change game mode
  const changeGameMode = mode => {
    setGameMode(mode);
    resetGame();
  };

  // Change difficulty
  const changeDifficulty = level => {
    setDifficulty(level);
    resetGame();
  };

  // Toggle settings
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Update setting
  const updateSetting = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    // Apply theme change
    if (setting === "darkMode") {
      setTheme(value ? "dark" : "light");
      document.body.classList.toggle("light-theme", !value);
    }
  };

  // Create background particles
  useEffect(
    () => {
      if (!settings.animations) return;

      const particleContainer = document.querySelector(".bg-particles");
      if (!particleContainer) return;

      // Clear existing particles
      particleContainer.innerHTML = "";

      // Create new particles
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        // Random properties
        const size = Math.random() * 20 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        const color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;

        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.backgroundColor = color;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particleContainer.appendChild(particle);
      }
    },
    [settings.animations]
  );

  // Get game status text
  const getStatusText = () => {
    if (gameOver) {
      const result = calculateWinner(currentSquares);
      if (result && result.winner === "tie") {
        return "Game ended in a tie!";
      } else if (result) {
        return `${playerNames[result.winner]} wins!`;
      }
      return "Game over";
    } else {
      return `${xIsNext ? playerNames.X : playerNames.O}'s turn`;
    }
  };

  return <div className={`app-container ${theme}-theme theme-transition`}>
      {/* Background particles */}
      <div className="bg-particles" />

      {/* Game header */}
      <div className="game-header">
        <h1 className="game-title">Tic Tac Toe</h1>
        <p className="game-subtitle">Ultimate Edition</p>
      </div>

      {/* Main game container */}
      <div className="game-container">
        <div className="container-glow" />

        {/* Game controls */}
        <div className="game-controls">
          <div className="control-row">
            <button className={`mode-button ${gameMode === "1v1" ? "active" : ""}`} onClick={() => changeGameMode("1v1")}>
              Player vs Player
            </button>
            <button className={`mode-button ${gameMode === "1vCPU" ? "active" : ""}`} onClick={() => changeGameMode("1vCPU")}>
              Player vs AI
            </button>
          </div>

          {gameMode === "1vCPU" && <div className="control-row">
              <button className={`difficulty-button ${difficulty === "easy" ? "active" : ""}`} onClick={() => changeDifficulty("easy")}>
                Easy
              </button>
              <button className={`difficulty-button ${difficulty === "medium" ? "active" : ""}`} onClick={() => changeDifficulty("medium")}>
                Medium
              </button>
              <button className={`difficulty-button ${difficulty === "hard" ? "active" : ""}`} onClick={() => changeDifficulty("hard")}>
                Hard
              </button>
            </div>}
        </div>

        {/* Players and scores */}
        <div className="players-container">
          <PlayerCard player="X" symbol="X" name={playerNames.X} score={scores.X} isActive={xIsNext && !gameOver} />
          <PlayerCard player="O" symbol="O" name={playerNames.O} score={scores.O} isActive={!xIsNext && !gameOver} />
        </div>

        {/* Game status */}
        <div className={`game-status ${gameOver ? "winner" : ""}`}>
          <div className="status-highlight" />
          <div className="status-text">
            {getStatusText()}
          </div>
        </div>

        {/* Game board */}
        <div className="game-board-container" ref={boardRef}>
          <Board squares={currentSquares} onClick={handleClick} />
          <WinnerLine winningLine={winningLine} />
        </div>

        {/* Game actions */}
        <div className="game-actions">
          <button className="action-button reset-button" onClick={resetGame}>
            New Game
          </button>
          <button className="action-button undo-button" onClick={undoMove} disabled={currentStep === 0}>
            Undo
          </button>
          <button className="action-button" onClick={toggleSettings}>
            Settings
          </button>
        </div>

        {/* Settings panel */}
        <Settings settings={settings} updateSetting={updateSetting} showSettings={showSettings} />

        {/* Confetti animation */}
        <Confetti confetti={confetti} />
      </div>
    </div>;
};

export default App;
