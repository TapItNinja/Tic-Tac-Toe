export const generateConfetti = () => {
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

  return newConfetti;
};
