import React, { useEffect, useMemo, useRef, useState } from "react";

const COLS = window.innerWidth > 1330 ? 40 : 30 ;
const ROWS = window.innerWidth > 768 ? 30 : 30;
const INITIAL_SPEED = 120;

const createInitialSnake = () => [
  { x: 4, y: 15 },
  { x: 4, y: 15 },
  { x: 4, y: 15 },
];

const getRandomApple = (snake) => {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));

  return position;
};

const isOppositeDirection = (current, next) => {
  return current.x + next.x === 0 && current.y + next.y === 0;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState(createInitialSnake());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [apple, setApple] = useState({ x: 20, y: 20 });
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("start"); // start | playing | gameover
  const [cellSize, setCellSize] = useState(16);

  const moveLockedRef = useRef(false);

  const boardWidth = COLS * cellSize;
  const boardHeight = ROWS * cellSize;

  useEffect(() => {
    const updateCellSize = () => {
      const padding = 32;
      const maxWidth = Math.max(window.innerWidth - padding, 320);
      const maxHeight = Math.max(window.innerHeight - 180, 320);

      const sizeByWidth = Math.floor(maxWidth / COLS);
      const sizeByHeight = Math.floor(maxHeight / ROWS);
      const nextSize = Math.max(8, Math.min(18, sizeByWidth, sizeByHeight));

      setCellSize(nextSize);
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  const resetGame = () => {
    const initialSnake = createInitialSnake();
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setApple(getRandomApple(initialSnake));
    setScore(0);
    setGameStatus("playing");
    moveLockedRef.current = false;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (gameStatus !== "playing") {
        if (key === "enter" || key === " ") {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      let newDirection = null;

      if (key === "arrowup" || key === "w") newDirection = { x: 0, y: -1 };
      if (key === "arrowdown" || key === "s") newDirection = { x: 0, y: 1 };
      if (key === "arrowleft" || key === "a") newDirection = { x: -1, y: 0 };
      if (key === "arrowright" || key === "d") newDirection = { x: 1, y: 0 };

      if (!newDirection) return;

      e.preventDefault();

      if (moveLockedRef.current) return;
      if (isOppositeDirection(direction, newDirection)) return;

      setNextDirection(newDirection);
      moveLockedRef.current = true;
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameStatus]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const interval = setInterval(() => {
      setSnake((currentSnake) => {
        const appliedDirection = nextDirection;
        const head = currentSnake[0];
        const newHead = {
          x: head.x + appliedDirection.x,
          y: head.y + appliedDirection.y,
        };

        setDirection(appliedDirection);
        moveLockedRef.current = false;

        // Bateu na parede
        if (
          newHead.x < 0 ||
          newHead.x >= COLS ||
          newHead.y < 0 ||
          newHead.y >= ROWS
        ) {
          setGameStatus("gameover");
          return currentSnake;
        }

        const ateApple = newHead.x === apple.x && newHead.y === apple.y;

        const bodyToCheck = ateApple
          ? currentSnake
          : currentSnake.slice(0, currentSnake.length - 1);

        // Bateu no próprio corpo
        if (
          bodyToCheck.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameStatus("gameover");
          return currentSnake;
        }

        let nextSnake;

        if (ateApple) {
          nextSnake = [newHead, ...currentSnake];
          setScore((prev) => prev + 1);
          setApple(getRandomApple(nextSnake));
        } else {
          nextSnake = [newHead, ...currentSnake.slice(0, -1)];
        }

        return nextSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [apple, gameStatus, nextDirection]);

  const snakeBody = useMemo(() => {
    return snake.map((segment, index) => {
      const isHead = index === 0;

      return (
        <div
          key={`${segment.x}-${segment.y}-${index}`}
          style={{
            position: "absolute",
            left: segment.x * cellSize,
            top: segment.y * cellSize,
            width: cellSize,
            height: cellSize,
            background: "#7F5AF0",
            borderRadius: isHead ? Math.max(4, cellSize * 0.3) : Math.max(2, cellSize * 0.22),
            boxShadow: isHead
              ? "0 0 0 2px rgba(255,255,255,0.08) inset"
              : "0 0 0 1px rgba(255,255,255,0.05) inset",
            zIndex: 2,
          }}
        />
      );
    });
  }, [snake, cellSize]);

  return (
    <div style={styles.page}>

      <div style={styles.wrapper}>
        <h1 style={styles.title}>Jogo da Cobrinha</h1>

        <div style={styles.scoreBox}>Pontos: {score}</div>

        <div
          style={{
            ...styles.board,
            width: boardWidth,
            height: boardHeight,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
          }}
        >
          

          <div
            style={{
              position: "absolute",
              left: apple.x * cellSize,
              top: apple.y * cellSize,
              width: cellSize,
              height: cellSize,
              background: "#ff3b30",
              borderRadius: Math.max(2, cellSize * 0.2),
              zIndex: 2,
            }}
          />

          {snakeBody}

          {gameStatus === "start" && (
            <div style={styles.overlay}>
              <div style={styles.menuSnake}>
                <h2 style={styles.menuTitle}>Bem-vindo</h2>
                <p style={styles.menuText}>
                  Use as setas do teclado ou WASD para mover a cobrinha.
                </p>
                <button style={styles.button} onClick={resetGame}>
                  Iniciar jogo
                </button>
              </div>
            </div>
          )}

          {gameStatus === "gameover" && (
            <div style={styles.overlay}>
              <div style={styles.menuSnake}>
                <h2 style={styles.menuTitle}>Você perdeu</h2>
                <p style={styles.menuText}>Pontuação final: {score}</p>
                <button style={styles.button} onClick={resetGame}>
                  Jogar novamente
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={styles.help}>
          Controles: ↑ ↓ ← → ou W A S D
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "var(--cor-fundo)",
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  wrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },
  title: {
    margin: 0,
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 800,
    color: "var(--cor-titulo)",
  },
  board: {
    position: "relative",
    backgroundColor: "#16161f",
    border: "2px solid rgba(127, 90, 240, 0.45)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  scoreBox: {
    zIndex: 5,
    padding: "8px 12px",
    borderRadius: 10,
    background: "rgba(15, 14, 23, 0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fffffe",
    fontWeight: 700,
    fontSize: 14,
    backdropFilter: "blur(6px)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 14, 23, 0.72)",
    padding: 20,
  },
  menuSnake: {
    width: "min(92%, 360px)",
    background: "#1b1a27",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 24,
    textAlign: "center",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },
  menuTitle: {
    margin: "0 0 10px",
    fontSize: 28,
    fontWeight: 800,
    color: "#fffffe",
  },
  menuText: {
    margin: "0 0 10px",
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.5,
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#7F5AF0",
    color: "#fffffe",
    fontWeight: 800,
    fontSize: 16,
    transition: "transform 0.15s ease, opacity 0.15s ease",
  },
  help: {
    margin: 0,
    color: "var(--cor-titulo)",
    fontSize: 14,
  },
};