import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/SnakeGame.scss";

const COLS = 30;
const ROWS = 30;
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

const isTypingTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
};

export default function SnakeGame() {
  const [snake, setSnake] = useState(createInitialSnake());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [apple, setApple] = useState({ x: 20, y: 20 });
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("start");
  const [cellSize, setCellSize] = useState(16);

  const moveLockedRef = useRef(false);

  const boardWidth = COLS * cellSize;
  const boardHeight = ROWS * cellSize;
  const hasPlayerName = playerName.trim().length > 0;

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
    if (!hasPlayerName) return;

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
      if (isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();

      if (gameStatus !== "playing") {
        if ((key === "enter" || key === " ") && hasPlayerName) {
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
  }, [direction, gameStatus, hasPlayerName]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const interval = setInterval(() => {
      const appliedDirection = nextDirection;
      let nextApplePosition = null;
      let nextGameStatus = null;
      let shouldIncreaseScore = false;

      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const newHead = {
          x: head.x + appliedDirection.x,
          y: head.y + appliedDirection.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= COLS ||
          newHead.y < 0 ||
          newHead.y >= ROWS
        ) {
          nextGameStatus = "gameover";
          return currentSnake;
        }

        const ateApple = newHead.x === apple.x && newHead.y === apple.y;

        const bodyToCheck = ateApple
          ? currentSnake
          : currentSnake.slice(0, currentSnake.length - 1);

        if (
          bodyToCheck.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          nextGameStatus = "gameover";
          return currentSnake;
        }

        let nextSnake;

        if (ateApple) {
          nextSnake = [newHead, ...currentSnake];
          shouldIncreaseScore = true;
          nextApplePosition = getRandomApple(nextSnake);
        } else {
          nextSnake = [newHead, ...currentSnake.slice(0, -1)];
        }

        return nextSnake;
      });

      setDirection(appliedDirection);
      moveLockedRef.current = false;

      if (nextGameStatus) {
        setGameStatus(nextGameStatus);
      }

      if (shouldIncreaseScore) {
        setScore((prev) => prev + 1);
      }

      if (nextApplePosition) {
        setApple(nextApplePosition);
      }
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [apple, gameStatus, nextDirection]);

  const snakeBody = useMemo(() => {
    return snake.map((segment, index) => {
      const isHead = index === 0;

      return (
        <div
          key={`${segment.x}-${segment.y}-${index}`}
          className={`snake-game__segment ${isHead ? "is-head" : ""}`}
          style={{
            left: segment.x * cellSize,
            top: segment.y * cellSize,
            width: cellSize,
            height: cellSize,
            borderRadius: isHead ? Math.max(4, cellSize * 0.3) : Math.max(2, cellSize * 0.22),
          }}
        />
      );
    });
  }, [snake, cellSize]);

  return (
    <div className="snake-game">
      <div className="snake-game__wrapper">
        <h4 className="snake-game__title">Jogo da Cobrinha</h4>

        <p className="snake-game__help">Controles: ↑ ↓ ← → ou W A S D</p>

        <div className="snake-game__score">Pontos: {score}</div>

        <div
          className="snake-game__board"
          style={{
            width: boardWidth,
            height: boardHeight,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundImage: `
              linear-gradient(to right, var(--snake-grid-color) 1px, transparent 1px),
              linear-gradient(to bottom, var(--snake-grid-color) 1px, transparent 1px)
            `,
          }}
        >
          <div
            className="snake-game__apple"
            style={{
              left: apple.x * cellSize,
              top: apple.y * cellSize,
              width: cellSize,
              height: cellSize,
              borderRadius: Math.max(2, cellSize * 0.2),
            }}
          />

          {snakeBody}

          {gameStatus === "start" && (
            <div className="snake-game__overlay">
              <div className="snake-game__menu">
                <h2 className="snake-game__menu-title">Bem-vindo</h2>
                <p className="snake-game__menu-text">
                  Digite seu nome para comecar a partida.
                </p>
                <label className="snake-game__field" htmlFor="snake-player-name">
                  <input
                    id="snake-player-name"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="snake-game__input"
                    placeholder="Digite seu nome"
                    maxLength={40}
                  />
                </label>

                <button
                  className="snake-game__button"
                  onClick={resetGame}
                  disabled={!hasPlayerName}
                >
                  Iniciar jogo
                </button>
              </div>
            </div>
          )}

          {gameStatus === "gameover" && (
            <div className="snake-game__overlay">
              <div className="snake-game__menu">
                <h2 className="snake-game__menu-title">Você perdeu</h2>
                <p className="snake-game__menu-text">Pontuação final: {score}</p>
                <button className="snake-game__button" onClick={resetGame}>
                  Jogar novamente
                </button>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}
