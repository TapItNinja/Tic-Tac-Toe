export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }

  if (squares.every(square => square !== null)) {
    return { winner: 'tie' };
  }

  return null;
};

export const findBestMove = (board, difficulty) => {
  const emptySquares = board
    .map((square, index) => (square === null ? index : null))
    .filter(index => index !== null);

  if (emptySquares.length === 0) return null;

  if (difficulty === 'easy') {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  if (difficulty === 'medium' && Math.random() < 0.5) {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  for (let i of emptySquares) {
    const boardCopy = [...board];
    boardCopy[i] = 'O';
    if (calculateWinner(boardCopy)?.winner === 'O') {
      return i;
    }
  }

  for (let i of emptySquares) {
    const boardCopy = [...board];
    boardCopy[i] = 'X';
    if (calculateWinner(boardCopy)?.winner === 'X') {
      return i;
    }
  }

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter(corner => board[corner] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  const sides = [1, 3, 5, 7].filter(side => board[side] === null);
  if (sides.length > 0) {
    return sides[Math.floor(Math.random() * sides.length)];
  }

  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};