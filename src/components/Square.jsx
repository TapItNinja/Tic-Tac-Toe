import React from "react";
import { motion } from "framer-motion";

const Square = ({ value, onClick }) => {
  return (
    <motion.div
      className="square"
      onClick={onClick}
      whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      animate={{ scale: [0.95, 1], opacity: [0.5, 1] }}
      transition={{ duration: 0.3 }}
    >
      {value && <div className={value === "X" ? "x-mark" : "o-mark"} />}
    </motion.div>
  );
};

export default Square;
