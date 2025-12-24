const gridWrap = document.getElementById("gridWrap");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");

const p1NameEl = document.getElementById("p1Name"); // columns
const p2NameEl = document.getElementById("p2Name"); // rows

const nashList = document.getElementById("nashList");
const paretoList = document.getElementById("paretoList");
const dominanceList = document.getElementById("dominanceList");
const statusEl = document.getElementById("status");

document.getElementById("buildBtn").addEventListener("click", () => {
  buildMatrix(rowsInput.value, colsInput.value);
});
document.getElementById("computeBtn").addEventListener("click", compute);

p1NameEl.addEventListener("input", updatePlayerHeaders);
p2NameEl.addEventListener("input", updatePlayerHeaders);

function clampInt(v, min = 1, max = 50) {
  const n = Math.max(min, Math.min(max, Number.parseInt(v, 10) || min));
  return n;
}

function buildMatrix(r, c) {
  // r = number of ROW strategies (Player 2)
  // c = number of COL strategies (Player 1)
  r = clampInt(r, 1, 50);
  c = clampInt(c, 1, 50);
  rowsInput.value = r;
  colsInput.value = c;

  const table = document.createElement("table");
  const thead = document.createElement("thead");

  // Row 0: merged header for Player 1 (columns)
  const row0 = document.createElement("tr");
  const corner0 = document.createElement("th");
  corner0.className = "corner";
  corner0.colSpan = 2;
  corner0.textContent = "";
  row0.appendChild(corner0);

  const p1Header = document.createElement("th");
  p1Header.className = "playerHeader";
  p1Header.colSpan = c;
  p1Header.id = "p1HeaderTop";
  p1Header.textContent = p1NameEl.value.trim() || "Player 1";
  row0.appendChild(p1Header);
  thead.appendChild(row0);

  // Row 1: column strategy names
  const row1 = document.createElement("tr");
  const corner1 = document.createElement("th");
  corner1.className = "corner";
  corner1.colSpan = 2;
  corner1.textContent = "Strategies";
  row1.appendChild(corner1);

  for (let j = 0; j < c; j++) {
    const th = document.createElement("th");
    const inp = document.createElement("input");
    inp.className = "name";
    inp.type = "text";
    inp.id = `colName-${j}`;
    inp.value = `C${j + 1}`;
    th.appendChild(inp);
    row1.appendChild(th);
  }
  thead.appendChild(row1);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  for (let i = 0; i < r; i++) {
    const tr = document.createElement("tr");

    // Left merged header for Player 2 (rows)
    if (i === 0) {
      const p2Side = document.createElement("th");
      p2Side.className = "playerHeader sidePlayer";
      p2Side.rowSpan = r;
      p2Side.id = "p2HeaderSide";
      p2Side.textContent = p2NameEl.value.trim() || "Player 2";
      tr.appendChild(p2Side);
    }

    // Row strategy name (Player 2 strategies)
    const rowNameTh = document.createElement("th");
    const rowInp = document.createElement("input");
    rowInp.className = "name";
    rowInp.type = "text";
    rowInp.id = `rowName-${i}`;
    rowInp.value = `R${i + 1}`;
    rowNameTh.appendChild(rowInp);
    tr.appendChild(rowNameTh);

    // Payoff cells: Player 1 first (col player), Player 2 second (row player)
    for (let j = 0; j < c; j++) {
      const td = document.createElement("td");
      td.className = "cell";
      td.dataset.i = String(i);
      td.dataset.j = String(j);

      td.innerHTML = `
        <div class="payoffs">
          <div class="payoffBox p1">
            <label class="p1label"></label>
            <input class="payoff payoff-p1" type="text" inputmode="decimal" placeholder="u1">
          </div>
          <div class="payoffBox p2">
            <label class="p2label"></label>
            <input class="payoff payoff-p2" type="text" inputmode="decimal" placeholder="u2">
          </div>
        </div>
      `;

      td.querySelectorAll("input.payoff").forEach(inp => {
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") compute();
        });
      });

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  gridWrap.innerHTML = "";
  gridWrap.appendChild(table);

  updatePlayerHeaders();
  clearOutputs();
  statusEl.textContent = "";
}

function updatePlayerHeaders() {
  const p1 = (p1NameEl.value.trim() || "Player 1"); // columns
  const p2 = (p2NameEl.value.trim() || "Player 2"); // rows

  const p1Top = document.getElementById("p1HeaderTop");
  const p2Side = document.getElementById("p2HeaderSide");
  if (p1Top) p1Top.textContent = p1;
  if (p2Side) p2Side.textContent = p2;

  // labels inside payoff boxes
  gridWrap.querySelectorAll(".payoffBox.p1 .p1label").forEach(l => l.textContent = p1);
  gridWrap.querySelectorAll(".payoffBox.p2 .p2label").forEach(l => l.textContent = p2);
}

function clearOutputs() {
  nashList.innerHTML = "";
  paretoList.innerHTML = "";
  dominanceList.innerHTML = "";
  gridWrap.querySelectorAll("td.cell").forEach(td => {
    td.classList.remove("nash", "pareto", "both", "bad");
  });
}

function readPayoff(td) {
  const a = td.querySelector(".payoff-p1").value.trim();
  const b = td.querySelector(".payoff-p2").value.trim();
  const u1 = Number(a); // Player 1 (column)
  const u2 = Number(b); // Player 2 (row)
  if (!Number.isFinite(u1) || !Number.isFinite(u2)) return null;

  // Internal convention for computations:
  // u_row (Player 2) first, u_col (Player 1) second
  // because best responses are computed by row-player vs col-player.
  return [u2, u1]; // [rowPlayer(P2), colPlayer(P1)]
}

function getNames(r, c) {
  const rowNames = Array.from({ length: r }, (_, i) => {
    const el = document.getElementById(`rowName-${i}`);
    const v = el ? el.value.trim() : "";
    return v || `R${i + 1}`;
  });

  const colNames = Array.from({ length: c }, (_, j) => {
    const el = document.getElementById(`colName-${j}`);
    const v = el ? el.value.trim() : "";
    return v || `C${j + 1}`;
  });

  return { rowNames, colNames };
}

function addLI(ul, text) {
  const li = document.createElement("li");
  li.textContent = text;
  ul.appendChild(li);
}

function compute() {
  clearOutputs();

  const r = clampInt(rowsInput.value, 1, 50); // rows = Player 2 strategies
  const c = clampInt(colsInput.value, 1, 50); // cols = Player 1 strategies
  const { rowNames, colNames } = getNames(r, c);

  // pay[i][j] = [u_rowPlayer(P2), u_colPlayer(P1)]
  const pay = Array.from({ length: r }, () => Array.from({ length: c }, () => null));
  let invalid = 0;

  gridWrap.querySelectorAll("td.cell").forEach(td => {
    const i = Number(td.dataset.i);
    const j = Number(td.dataset.j);
    const p = readPayoff(td);
    pay[i][j] = p;
    if (!p) { td.classList.add("bad"); invalid++; }
  });

  // Best responses:
  // Row player (P2) chooses best row in each column => maximize pay[i][j][0]
  // Col player (P1) chooses best column in each row => maximize pay[i][j][1]
  const bestRowPayInCol = Array(c).fill(-Infinity);
  const bestColPayInRow = Array(r).fill(-Infinity);

  for (let j = 0; j < c; j++) {
    for (let i = 0; i < r; i++) {
      if (!pay[i][j]) continue;
      bestRowPayInCol[j] = Math.max(bestRowPayInCol[j], pay[i][j][0]);
    }
  }

  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (!pay[i][j]) continue;
      bestColPayInRow[i] = Math.max(bestColPayInRow[i], pay[i][j][1]);
    }
  }

  // Pareto set
  const pareto = [];
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (!pay[i][j]) continue;

      let dominated = false;
      for (let x = 0; x < r; x++) {
        for (let y = 0; y < c; y++) {
          if (!pay[x][y] || (x === i && y === j)) continue;

          const weak = pay[x][y][0] >= pay[i][j][0] && pay[x][y][1] >= pay[i][j][1];
          const strict = pay[x][y][0] > pay[i][j][0] || pay[x][y][1] > pay[i][j][1];
          if (weak && strict) { dominated = true; break; }
        }
        if (dominated) break;
      }

      if (!dominated) pareto.push([i, j]);
    }
  }
  const paretoSet = new Set(pareto.map(([i, j]) => `${i},${j}`));

  // Nash + highlight
  const nash = [];
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (!pay[i][j]) continue;

      const isNash =
        pay[i][j][0] === bestRowPayInCol[j] &&  // P2 best response
        pay[i][j][1] === bestColPayInRow[i];    // P1 best response

      const isPareto = paretoSet.has(`${i},${j}`);
      if (isNash) nash.push([i, j]);

      const td = gridWrap.querySelector(`td.cell[data-i="${i}"][data-j="${j}"]`);
      if (isNash && isPareto) td.classList.add("both");
      else if (isNash) td.classList.add("nash");
      else if (isPareto) td.classList.add("pareto");
    }
  }

  // Lists: (rowStrategy, colStrategy)
  if (nash.length === 0) addLI(nashList, "None");
  else nash.forEach(([i, j]) => addLI(nashList, `(${rowNames[i]}, ${colNames[j]})`));

  if (pareto.length === 0) addLI(paretoList, "None");
  else pareto.forEach(([i, j]) => addLI(paretoList, `(${rowNames[i]}, ${colNames[j]})`));

  // Dominance relationships (outcome-level Pareto dominance)
  let domCount = 0;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (!pay[i][j]) continue;
      for (let x = 0; x < r; x++) {
        for (let y = 0; y < c; y++) {
          if (!pay[x][y] || (x === i && y === j)) continue;

          const weak = pay[x][y][0] >= pay[i][j][0] && pay[x][y][1] >= pay[i][j][1];
          const strict = pay[x][y][0] > pay[i][j][0] || pay[x][y][1] > pay[i][j][1];
          if (weak && strict) {
            addLI(dominanceList, `(${rowNames[x]}, ${colNames[y]}) dominates (${rowNames[i]}, ${colNames[j]})`);
            domCount++;
          }
        }
      }
    }
  }
  if (domCount === 0) addLI(dominanceList, "None");

  const total = r * c;
  statusEl.textContent = invalid
    ? `${invalid}/${total} cells invalid (enter numbers for both players in every cell).`
    : `All ${total} cells parsed successfully.`;
}

// init
buildMatrix(rowsInput.value, colsInput.value);
