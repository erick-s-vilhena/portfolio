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
const TABLET_LAYOUT_BREAKPOINT = 1220;
const MOBILE_BREAKPOINT = 768;
const RANKING_API_URL = "https://script.google.com/macros/s/AKfycbzX1XaLnNH2r9gqVlDa1a8iWRKEG4zFj2bKhwkPfwfTlirR4bVPsDOyzJ-Yj_JOy4jWNg/exec";
const LEADERBOARD_LIMIT = 10;
const PLAYER_NAME_MAX_LENGTH = 15;
const PLAYER_NAME_PATTERN = /^[\p{L}\p{N}_]+$/u;
let leaderboardCache = [];
let leaderboardRequestPromise = null;

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

const normalizePlayerKey = (player) =>
  String(player || "")
    .normalize("NFKC")
    .trim()
    .slice(0, PLAYER_NAME_MAX_LENGTH)
    .toLocaleLowerCase("pt-BR");

const normalizePlayerNameInput = (player) =>
  String(player || "")
    .normalize("NFKC")
    .toLocaleUpperCase("pt-BR")
    .slice(0, PLAYER_NAME_MAX_LENGTH);

const validatePlayerName = (player) => {
  const normalizedPlayer = normalizePlayerNameInput(player).trim();

  if (!normalizedPlayer) {
    return "Digite seu nome para iniciar.";
  }

  if (!PLAYER_NAME_PATTERN.test(normalizedPlayer)) {
    return "Use apenas letras, numeros e _.";
  }

  return "";
};

const getLeaderboardIdentityKey = (item) => {
  return `player:${normalizePlayerKey(item.player)}`;
};

const normalizeLeaderboard = (data) => {
  if (!Array.isArray(data)) return [];

  const bestScoresByPlayer = data.reduce((ranking, item) => {
    const player = String(item.player || "").trim().slice(0, PLAYER_NAME_MAX_LENGTH);
    const highScore = Number(item.highScore);
    const identityKey = getLeaderboardIdentityKey({ player });

    if (!player || !Number.isFinite(highScore)) return ranking;

    const currentScore = ranking.get(identityKey)?.highScore ?? -Infinity;
    if (highScore > currentScore) {
      ranking.set(identityKey, { player, highScore });
    }

    return ranking;
  }, new Map());

  const leaderboard = Array.from(bestScoresByPlayer.values())
    .sort((a, b) => b.highScore - a.highScore)
    .slice(0, LEADERBOARD_LIMIT);

  return leaderboard;
};

const fetchLeaderboard = async () => {
  const response = await fetch(RANKING_API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Falha ao carregar ranking");

  return normalizeLeaderboard(await response.json());
};

const setCachedLeaderboard = (leaderboard) => {
  leaderboardCache = leaderboard;
  leaderboardRequestPromise = Promise.resolve(leaderboard);
};

const getLeaderboard = () => {
  if (leaderboardRequestPromise) return leaderboardRequestPromise;

  leaderboardRequestPromise = fetchLeaderboard()
    .then((leaderboard) => {
      leaderboardCache = leaderboard;
      return leaderboard;
    })
    .catch((error) => {
      leaderboardRequestPromise = null;
      throw error;
    });

  return leaderboardRequestPromise;
};

const submitScore = async ({ player, highScore }) => {
  await fetch(RANKING_API_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({ action: "upsert", player, highScore }),
  });
};

getLeaderboard().catch(() => {});

function LeaderboardContent({ leaderboard }) {
  return (
    <>
      <h2 className="snake-game__leaderboard-title">Ranking</h2>
      <div className="snake-game__leaderboard-head">
        <span>Jogador</span>
        <span>Max.</span>
      </div>
      <div className="snake-game__leaderboard-body">
        {leaderboard.length > 0 ? (
          leaderboard.map(({ player, highScore }, index) => (
            <div
              key={`${player}-${highScore}-${index}`}
              className={`snake-game__leaderboard-row ${index < 3 ? `snake-game__leaderboard-row--top-${index + 1}` : ""}`}
            >
              <span>{player.toLocaleUpperCase("pt-BR")}</span>
              <strong>{highScore}</strong>
            </div>
          ))
        ) : (
          <div className="snake-game__leaderboard-row">
            <span>Nenhuma pontuacao</span>
            <strong>-</strong>
          </div>
        )}
      </div>
    </>
  );
}

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
  const [deviceLabel, setDeviceLabel] = useState("desktop");
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerNameError, setPlayerNameError] = useState("");

  const moveLockedRef = useRef(false);
  const goldenAppleTimeoutRef = useRef(null);
  const snakeRef = useRef(createInitialSnake());
  const nextDirectionRef = useRef({ x: 1, y: 0 });
  const appleRef = useRef({ x: 20, y: 20 });
  const goldenAppleRef = useRef(null);
  const normalApplesEatenRef = useRef(0);
  const scoreSubmittedRef = useRef(false);
  const leaderboardRef = useRef([]);
  const playerNameValidationMessage = validatePlayerName(playerName);
  const canStartGame = playerNameValidationMessage === "";

  const boardWidth = COLS * cellSize;
  const boardHeight = ROWS * cellSize;
  const movementInstruction =
    deviceLabel === "mobile"
      ? "Toque nas setas da tela para mover a cobrinha."
      : deviceLabel === "tablet"
        ? "Use as setas da tela ou AWSD no teclado para mover a cobrinha."
        : "Use WASD para mover a cobrinha.";

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
      const isMobileLayout = window.innerWidth <= MOBILE_BREAKPOINT;
      const isTabletLayout =
        window.innerWidth <= TABLET_LAYOUT_BREAKPOINT && !isMobileLayout;
      const hasTouchPointer = mediaQuery.matches || navigator.maxTouchPoints > 0;

      setShowTouchControls(hasTouchPointer || isMobileLayout || isTabletLayout);

      if (isMobileLayout) {
        setDeviceLabel("mobile");
        return;
      }

      if (isTabletLayout) {
        setDeviceLabel("tablet");
        return;
      }

      setDeviceLabel("desktop");
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

  const resetGame = async () => {
    const trimmedPlayerName = normalizePlayerNameInput(playerName).trim();
    const validationMessage = validatePlayerName(trimmedPlayerName);
    if (validationMessage) {
      setPlayerNameError(validationMessage);
      return;
    }

    setPlayerNameError("");

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
    scoreSubmittedRef.current = false;
    moveLockedRef.current = false;
  };

  const returnToStartMenu = () => {
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
    setPlayerNameError("");
    setGameStatus("start");
    scoreSubmittedRef.current = false;
    moveLockedRef.current = false;
  };

  useEffect(() => {
    leaderboardRef.current = leaderboard;
    leaderboardCache = leaderboard;
  }, [leaderboard]);

  useEffect(() => {
    let isMounted = true;

    if (leaderboardCache.length > 0) {
      setLeaderboard(leaderboardCache);
      return undefined;
    }

    getLeaderboard()
      .then((ranking) => {
        if (isMounted) setLeaderboard(ranking);
      })
      .catch(() => {
        if (isMounted) setLeaderboard([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (gameStatus !== "gameover") return;
    if (scoreSubmittedRef.current) return;

    const player = playerName.trim().slice(0, PLAYER_NAME_MAX_LENGTH);
    if (!player) return;

    scoreSubmittedRef.current = true;

    const identityKey = getLeaderboardIdentityKey({ player });
    const previousHighScore =
      leaderboardRef.current.find(
        (entry) => getLeaderboardIdentityKey(entry) === identityKey
      )?.highScore ?? -Infinity;

    if (score <= previousHighScore) return;

    setLeaderboard((currentLeaderboard) =>
      {
        const nextLeaderboard = normalizeLeaderboard([
          ...currentLeaderboard,
          { player, highScore: score },
        ]);

        setCachedLeaderboard(nextLeaderboard);
        return nextLeaderboard;
      }
    );

    submitScore({ player, highScore: score }).catch((error) => {
      console.error("Falha ao enviar pontuacao:", error);
    });
  }, [gameStatus, playerName, score]);

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
    <div className={`snake-game${gameStatus !== "playing" ? " snake-game--menu-open" : ""}`}>
      <div className="snake-game__layout">
        <aside className="snake-game__leaderboard" aria-label="Maiores pontuacoes">
          <div className="snake-game__leaderboard-card">
            <LeaderboardContent leaderboard={leaderboard} />
          </div>
        </aside>

        <div className={`snake-game__wrapper${showTouchControls ? " snake-game__wrapper--with-touch" : ""}`}>


          <div className="snake-game__score">
            {playerName.trim() && (
              <span className="snake-game__score-player">{playerName.trim()}</span>
            )}
            <span>Pontos: {score}</span>
          </div>

          <div className="snake-game__board-stage">
            <div
              className={`snake-game__board${gameStatus === "start" ? " snake-game__board--start" : ""}`}
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
            </div>

            {gameStatus === "start" && (
              <div className="snake-game__overlay snake-game__overlay--start">
                <div className="snake-game__menu-stack">
                  <div className="snake-game__menu">
                    <h2 className="snake-game__menu-title">Jogo da Cobrinha</h2>
  

                    <p className="snake-game__menu-text">
                      Digite seu nome para salvar sua pontuação. Se mais de uma pessoa usar o mesmo nome, apenas a maior pontuação desse nome será mantida no ranking.
                    </p>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => {
                        setPlayerName(normalizePlayerNameInput(e.target.value));
                        if (playerNameError) setPlayerNameError("");
                      }}
                      placeholder="Seu nome de Usuario"
                      className="snake-game__input"
                      maxLength={PLAYER_NAME_MAX_LENGTH}
                    />
                    {playerNameError && (
                      <p className="snake-game__menu-text" role="alert">
                        {playerNameError}
                      </p>
                    )}
                    <button
                      className={`snake-game__button${canStartGame ? "" : " snake-game__button--disabled"}`}
                      onClick={resetGame}
                      disabled={!canStartGame}
                    >
                      Iniciar jogo
                    </button>

                    <div className="snake-game__leaderboard snake-game__leaderboard--menu" aria-label="Maiores pontuacoes">
                      <div className="snake-game__leaderboard-card snake-game__leaderboard-card--menu">
                        <LeaderboardContent leaderboard={leaderboard} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameStatus === "gameover" && (
              <div className="snake-game__overlay">
                <div className="snake-game__menu-stack">
                  <div className="snake-game__menu">
                    <h2 className="snake-game__menu-title">Você perdeu</h2>
                    <p className="snake-game__menu-text">
                      {playerName.trim()}, sua pontuação final foi {score}.
                    </p>
                    <button className="snake-game__button" onClick={resetGame}>
                      Jogar novamente
                    </button>
                    <button className="snake-game__button snake-game__button--ghost" onClick={returnToStartMenu}>
                      Voltar ao menu inicial
                    </button>

                    <div className="snake-game__leaderboard snake-game__leaderboard--menu" aria-label="Maiores pontuacoes">
                      <div className="snake-game__leaderboard-card snake-game__leaderboard-card--menu">
                        <LeaderboardContent leaderboard={leaderboard} />
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}
