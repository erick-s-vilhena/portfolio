const SHEET_NAME = "ranking";
const HEADERS = ["player", "highScore", "uid", "createdAt"];
const PLAYER_NAME_MAX_LENGTH = 15;
const RANKING_LIMIT = 10;

function getRankingSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    return sheet;
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  return sheet;
}

function normalizePlayerName(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toUpperCase()
    .slice(0, PLAYER_NAME_MAX_LENGTH);
}

function normalizePlayerKey(value) {
  return normalizePlayerName(value).toLowerCase();
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function consolidateRankingRows(sheet) {
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const bestByPlayer = new Map();
  const duplicateRowNumbers = [];

  for (let i = 1; i < rows.length; i += 1) {
    const rowNumber = i + 1;
    const [playerValue, highScoreValue, uidValue, createdAtValue] = rows[i];
    const player = normalizePlayerName(playerValue);
    const playerKey = normalizePlayerKey(player);
    const highScore = Number(highScoreValue);

    if (!player || !Number.isFinite(highScore)) {
      duplicateRowNumbers.push(rowNumber);
      continue;
    }

    const currentRow = {
      rowNumber,
      player,
      playerKey,
      highScore,
      uid: uidValue,
      createdAt: createdAtValue || new Date(),
    };

    if (!bestByPlayer.has(playerKey)) {
      bestByPlayer.set(playerKey, currentRow);
      continue;
    }

    const previousBest = bestByPlayer.get(playerKey);
    if (currentRow.highScore > previousBest.highScore) {
      duplicateRowNumbers.push(previousBest.rowNumber);
      bestByPlayer.set(playerKey, currentRow);
    } else {
      duplicateRowNumbers.push(currentRow.rowNumber);
    }
  }

  const normalizedRows = Array.from(bestByPlayer.values()).sort(
    (a, b) => a.rowNumber - b.rowNumber
  );

  normalizedRows.forEach((row) => {
    sheet.getRange(row.rowNumber, 1, 1, 4).setValues([
      [row.player, row.highScore, row.uid || "", row.createdAt],
    ]);
  });

  duplicateRowNumbers
    .sort((a, b) => b - a)
    .forEach((rowNumber) => {
      sheet.deleteRow(rowNumber);
    });

  return Array.from(bestByPlayer.values());
}

function doGet() {
  const sheet = getRankingSheet();
  const rows = consolidateRankingRows(sheet);

  const ranking = rows
    .map(({ player, highScore, createdAt }) => ({
      player,
      highScore,
      createdAt,
    }))
    .sort((a, b) => b.highScore - a.highScore)
    .slice(0, RANKING_LIMIT);

  return jsonResponse(ranking);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getRankingSheet();
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");

    const player = normalizePlayerName(body.player);
    const highScore = Number(body.highScore);

    if (!player || !Number.isFinite(highScore) || highScore < 0) {
      return jsonResponse({ ok: false, error: "invalid_payload" });
    }

    const rows = consolidateRankingRows(sheet);
    const playerKey = normalizePlayerKey(player);
    const existingRow = rows.find((row) => row.playerKey === playerKey);

    if (!existingRow) {
      sheet.appendRow([player, highScore, "", new Date()]);
      return jsonResponse({ ok: true, created: true, updated: false });
    }

    if (highScore > existingRow.highScore) {
      sheet.getRange(existingRow.rowNumber, 1, 1, 4).setValues([
        [player, highScore, existingRow.uid || "", existingRow.createdAt || new Date()],
      ]);
      return jsonResponse({ ok: true, created: false, updated: true });
    }

    return jsonResponse({ ok: true, created: false, updated: false });
  } finally {
    lock.releaseLock();
  }
}
