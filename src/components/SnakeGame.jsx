import React, { useEffect, useMemo, useRef, useState } from "react";
import setaCima from "../img/seta-cima.svg";
import setaCimaClaro from "../img/seta-cima-claro.svg";
import "../styles/SnakeGame.scss";

const COLS = 30;
const ROWS = 30;
const INITIAL_SPEED = 120;
const APPLE_POINTS = 1;
const GOLDEN_APPLE_POINTS = 5;
const GOLDEN_APPLE_MIN_TRIGGER = 5;
const GOLDEN_APPLE_MAX_TRIGGER = 10;
const GOLDEN_APPLE_DURATION_MS = 10000;

const createInitialSnake = () => [
  { x: 4, y: 15 },
  { x: 4, y: 15 },
  { x: 4, y: 15 },
];

const getRandomApple = (snake, blockedPositions = []) => {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (
    snake.some((segment) => segment.x === position.x && segment.y === position.y) ||
    blockedPositions.some((blocked) => blocked.x === position.x && blocked.y === position.y)
  );

  return position;
};

const isOppositeDirection = (current, next) => {
  return current.x + next.x === 0 && current.y + next.y === 0;
};

const shouldSpawnGoldenApple = (normalApplesEaten) => {
  if (normalApplesEaten < GOLDEN_APPLE_MIN_TRIGGER) return false;
  if (normalApplesEaten >= GOLDEN_APPLE_MAX_TRIGGER) return true;

  const progress =
    (normalApplesEaten - GOLDEN_APPLE_MIN_TRIGGER) /
    (GOLDEN_APPLE_MAX_TRIGGER - GOLDEN_APPLE_MIN_TRIGGER);
  const chancePercent = 20 + progress * 80;
  return Math.random() * 100 < chancePercent;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState(createInitialSnake());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [apple, setApple] = useState({ x: 20, y: 20 });
  const [goldenApple, setGoldenApple] = useState(null);
  const [score, setScore] = useState(0);
  const [normalApplesEaten, setNormalApplesEaten] = useState(0);
  const [gameStatus, setGameStatus] = useState("start"); // start | playing | gameover
  const [cellSize, setCellSize] = useState(16);
  const [playerName, setPlayerName] = useState("");
  const [showTouchControls, setShowTouchControls] = useState(false);
  const [touchArrowIcon, setTouchArrowIcon] = useState(setaCima);

  const moveLockedRef = useRef(false);
  const goldenAppleTimeoutRef = useRef(null);
  const snakeRef = useRef(createInitialSnake());
  const nextDirectionRef = useRef({ x: 1, y: 0 });
  const appleRef = useRef({ x: 20, y: 20 });
  const goldenAppleRef = useRef(null);
  const normalApplesEatenRef = useRef(0);
  const canStartGame = playerName.trim().length > 0;

  const boardWidth = COLS * cellSize;
  const boardHeight = ROWS * cellSize;

  const handleTouchControlPress = (event, newDirection) => {
    event.preventDefault();
    handleDirectionChange(newDirection);
  };

  const clearGoldenAppleTimeout = () => {
    if (goldenAppleTimeoutRef.current) {
      window.clearTimeout(goldenAppleTimeoutRef.current);
      goldenAppleTimeoutRef.current = null;
    }
  };

  const scheduleGoldenAppleRemoval = () => {
    clearGoldenAppleTimeout();
    goldenAppleTimeoutRef.current = window.setTimeout(() => {
      goldenAppleRef.current = null;
      normalApplesEatenRef.current = 0;
      setGoldenApple(null);
      setNormalApplesEaten(0);
      goldenAppleTimeoutRef.current = null;
    }, GOLDEN_APPLE_DURATION_MS);
  };

  const handleDirectionChange = (newDirection) => {
    if (gameStatus !== "playing") return;
    if (moveLockedRef.current) return;
    if (isOppositeDirection(direction, newDirection)) return;

    setNextDirection(newDirection);
    nextDirectionRef.current = newDirection;
    moveLockedRef.current = true;
  };

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const updateTouchControls = () => {
      setShowTouchControls(mediaQuery.matches || navigator.maxTouchPoints > 0);
    };

    updateTouchControls();
    mediaQuery.addEventListener("change", updateTouchControls);
    window.addEventListener("resize", updateTouchControls);

    return () => {
      mediaQuery.removeEventListener("change", updateTouchControls);
      window.removeEventListener("resize", updateTouchControls);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const updateTouchArrowIcon = () => {
      const theme = root.getAttribute("data-theme");
      setTouchArrowIcon(theme === "light" ? setaCimaClaro : setaCima);
    };

    updateTouchArrowIcon();

    const observer = new MutationObserver(updateTouchArrowIcon);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const resetGame = () => {
    if (!canStartGame) return;

    const initialSnake = createInitialSnake();
    clearGoldenAppleTimeout();
    setSnake(initialSnake);
    snakeRef.current = initialSnake;
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    nextDirectionRef.current = { x: 1, y: 0 };
    const nextApple = getRandomApple(initialSnake);
    setApple(nextApple);
    appleRef.current = nextApple;
    setGoldenApple(null);
    goldenAppleRef.current = null;
    setNormalApplesEaten(0);
    normalApplesEatenRef.current = 0;
    setScore(0);
    setGameStatus("playing");
    moveLockedRef.current = false;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const isMovementKey =
        key === "arrowup" ||
        key === "w" ||
        key === "arrowdown" ||
        key === "s" ||
        key === "arrowleft" ||
        key === "a" ||
        key === "arrowright" ||
        key === "d";

      if (e.repeat && isMovementKey) return;

      if (gameStatus !== "playing") {
        if ((key === "enter" || key === " ") && canStartGame) {
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
      handleDirectionChange(newDirection);
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canStartGame, direction, gameStatus]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const interval = setInterval(() => {
      const currentSnake = snakeRef.current;
      const appliedDirection = nextDirectionRef.current;
      const currentApple = appleRef.current;
      const currentGoldenApple = goldenAppleRef.current;
      const currentNormalApplesEaten = normalApplesEatenRef.current;
      const head = currentSnake[0];
      const newHead = {
        x: head.x + appliedDirection.x,
        y: head.y + appliedDirection.y,
      };

      setDirection(appliedDirection);
      moveLockedRef.current = false;

      if (
        newHead.x < 0 ||
        newHead.x >= COLS ||
        newHead.y < 0 ||
        newHead.y >= ROWS
      ) {
        clearGoldenAppleTimeout();
        setGameStatus("gameover");
        return;
      }

      const ateApple = newHead.x === currentApple.x && newHead.y === currentApple.y;
      const ateGoldenApple =
        currentGoldenApple != null &&
        newHead.x === currentGoldenApple.x &&
        newHead.y === currentGoldenApple.y;

      const bodyToCheck =
        ateApple || ateGoldenApple
          ? currentSnake
          : currentSnake.slice(0, currentSnake.length - 1);

      if (
        bodyToCheck.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        clearGoldenAppleTimeout();
        setGameStatus("gameover");
        return;
      }

      let nextSnake;

      if (ateApple || ateGoldenApple) {
        nextSnake = [newHead, ...currentSnake];
      } else {
        nextSnake = [newHead, ...currentSnake.slice(0, -1)];
      }

      snakeRef.current = nextSnake;
      setSnake(nextSnake);

      let scoreDelta = 0;
      let nextApple = currentApple;
      let nextGoldenApple = currentGoldenApple;
      let nextNormalApplesEaten = currentNormalApplesEaten;

      if (ateApple) {
        scoreDelta += APPLE_POINTS;
        nextNormalApplesEaten += 1;
        nextApple = getRandomApple(nextSnake, nextGoldenApple ? [nextGoldenApple] : []);

        if (!nextGoldenApple && shouldSpawnGoldenApple(nextNormalApplesEaten)) {
          nextGoldenApple = getRandomApple(nextSnake, [nextApple]);
          scheduleGoldenAppleRemoval();
        }
      }

      if (ateGoldenApple) {
        scoreDelta += GOLDEN_APPLE_POINTS;
        clearGoldenAppleTimeout();
        nextGoldenApple = null;
        nextNormalApplesEaten = 0;
      }

      if (scoreDelta > 0) {
        setScore((prev) => prev + scoreDelta);
      }

      if (ateApple) {
        appleRef.current = nextApple;
        normalApplesEatenRef.current = nextNormalApplesEaten;
        setApple(nextApple);
        setNormalApplesEaten(nextNormalApplesEaten);
      }

      if (ateGoldenApple) {
        normalApplesEatenRef.current = nextNormalApplesEaten;
        setNormalApplesEaten(nextNormalApplesEaten);
      }

      if (ateApple || ateGoldenApple) {
        goldenAppleRef.current = nextGoldenApple;
        setGoldenApple(nextGoldenApple);
      }
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [gameStatus]);

  useEffect(() => {
    return () => {
      clearGoldenAppleTimeout();
    };
  }, []);

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
            background: isHead ? "var(--cor-prima)" : "var(--cor-secun)",
            borderRadius: isHead ? Math.max(4, cellSize * 0.3) : Math.max(2, cellSize * 0.22),
            boxShadow: isHead
              ? "0 0 0 2px color-mix(in srgb, var(--cor-a-bg) 12%, transparent) inset"
              : "0 0 0 1px color-mix(in srgb, var(--cor-a-bg) 10%, transparent) inset",
            zIndex: 2,
          }}
        />
      );
    });
  }, [snake, cellSize]);

  return (
    <div className="snake-game">
      <div className={`snake-game__wrapper${showTouchControls ? " snake-game__wrapper--with-touch" : ""}`}>
        <h1 className="snake-game__title">Jogo da Cobrinha</h1>


        <div className="snake-game__score">Pontos: {score}</div>

        <div
          className="snake-game__board"
          style={{
            width: boardWidth,
            height: boardHeight,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--cor-a-bg) 4%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--cor-a-bg) 4%, transparent) 1px, transparent 1px)
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
              background: "#ff6b57",
              borderRadius: Math.max(2, cellSize * 0.2),
              boxShadow: "0 0 0 2px color-mix(in srgb, #ff6b57 22%, transparent)",
              zIndex: 2,
            }}
          />

          {goldenApple && (
            <div
              style={{
                position: "absolute",
                left: goldenApple.x * cellSize,
                top: goldenApple.y * cellSize,
                width: cellSize,
                height: cellSize,
                background: "#f3c623",
                borderRadius: Math.max(2, cellSize * 0.2),
                boxShadow: "0 0 0 2px color-mix(in srgb, #f3c623 35%, transparent), 0 0 14px color-mix(in srgb, #f3c623 58%, transparent)",
                zIndex: 2,
              }}
            />
          )}

          {snakeBody}

          {gameStatus === "start" && (
            <div className="snake-game__overlay">
              <div className="snake-game__menu">
                <h2 className="snake-game__menu-title">Bem-vindo</h2>
                <p className="snake-game__menu-text">
                  Use as setas do teclado ou WASD para mover a cobrinha.
                </p>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="snake-game__input"
                  maxLength={24}
                />
                <button
                  className={`snake-game__button${canStartGame ? "" : " snake-game__button--disabled"}`}
                  onClick={resetGame}
                  disabled={!canStartGame}
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
                <p className="snake-game__menu-text">
                  {playerName.trim()}, sua pontuação final foi {score}.
                </p>
                <button className="snake-game__button" onClick={resetGame}>
                  Jogar novamente
                </button>
              </div>
            </div>
          )}
        </div>

        {showTouchControls && (
          <div className="snake-game__touch-controls" aria-label="Controles por toque">
            <div className="snake-game__touch-spacer" aria-hidden="true"></div>
            <button
              type="button"
              className="snake-game__touch-button snake-game__touch-button--up"
              onTouchStart={(event) => handleTouchControlPress(event, { x: 0, y: -1 })}
              onMouseDown={(event) => handleTouchControlPress(event, { x: 0, y: -1 })}
              onClick={() => handleDirectionChange({ x: 0, y: -1 })}
              aria-label="Mover para cima"
            >
              <img src={touchArrowIcon} alt="" className="snake-game__touch-icon snake-game__touch-icon--up" />
            </button>
            <div className="snake-game__touch-spacer" aria-hidden="true"></div>
            <button
              type="button"
              className="snake-game__touch-button snake-game__touch-button--left"
              onTouchStart={(event) => handleTouchControlPress(event, { x: -1, y: 0 })}
              onMouseDown={(event) => handleTouchControlPress(event, { x: -1, y: 0 })}
              onClick={() => handleDirectionChange({ x: -1, y: 0 })}
              aria-label="Mover para a esquerda"
            >
              <img src={touchArrowIcon} alt="" className="snake-game__touch-icon snake-game__touch-icon--left" />
            </button>
            <div className="snake-game__touch-spacer snake-game__touch-spacer--center" aria-hidden="true"></div>
            <button
              type="button"
              className="snake-game__touch-button snake-game__touch-button--right"
              onTouchStart={(event) => handleTouchControlPress(event, { x: 1, y: 0 })}
              onMouseDown={(event) => handleTouchControlPress(event, { x: 1, y: 0 })}
              onClick={() => handleDirectionChange({ x: 1, y: 0 })}
              aria-label="Mover para a direita"
            >
              <img src={touchArrowIcon} alt="" className="snake-game__touch-icon snake-game__touch-icon--right" />
            </button>
            <div className="snake-game__touch-spacer" aria-hidden="true"></div>
            <button
              type="button"
              className="snake-game__touch-button snake-game__touch-button--down"
              onTouchStart={(event) => handleTouchControlPress(event, { x: 0, y: 1 })}
              onMouseDown={(event) => handleTouchControlPress(event, { x: 0, y: 1 })}
              onClick={() => handleDirectionChange({ x: 0, y: 1 })}
              aria-label="Mover para baixo"
            >
              <img src={touchArrowIcon} alt="" className="snake-game__touch-icon snake-game__touch-icon--down" />
            </button>
            <div className="snake-game__touch-spacer" aria-hidden="true"></div>
          </div>
        )}
      </div>
    </div>
  );
}
