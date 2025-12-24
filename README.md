
# 2-Player Normal Form Game Analyser

A browser-based tool for constructing and analysing **2-player normal-form (matrix) games**.  
The application allows users to define strategies and payoffs, then automatically computes:

- **Pure Nash equilibria**
- **Pareto-optimal outcomes**
- **Outcome-level dominance relationships**

The tool runs entirely in the browser with no external dependencies.

## How to Run

1. Download or clone the project files.
2. Open **`index.html`** in any modern web browser (Chrome, Firefox, Edge).
3. No installation, server, or build process is required.

---

##  How to Use

### 1. Player Setup
- **Player 1** controls the **columns**.
- **Player 2** controls the **rows**.
- Player names can be customised using the input fields at the top.

### 2. Strategy Selection
- Choose the number of strategies for each player:
  - Rows → Player 2 strategies
  - Columns → Player 1 strategies
- Click **Build Matrix** to generate the payoff table.

### 3. Enter Payoffs
- Each cell contains two payoff inputs:
  - **u1**: Player 1 payoff
  - **u2**: Player 2 payoff
- All values must be numeric.

### 4. Compute Results
- Click **Compute** (or press Enter inside a payoff cell).
- Results are highlighted directly in the matrix and listed below.

---

## Output Explanation

### Pure Nash Equilibria
- Outcomes where both players are playing **best responses** to each other.
- Highlighted in **green**.

### Pareto-Optimal Outcomes
- Outcomes that cannot be improved for one player without harming the other.
- Highlighted in **blue**.

### Nash & Pareto
- Outcomes that are both Nash equilibria and Pareto-optimal.
- Highlighted in **yellow**.

### Invalid Cells
- Cells with missing or non-numeric payoffs.
- Highlighted in **red** and excluded from calculations.

---


## Features

- Dark theme for readability
- Colour-coded payoffs per player
- Visual highlighting of equilibrium concepts
- Responsive layout for smaller screens

## ⚠Limitations

- Supports **pure strategies only** (no mixed strategies).
- Maximum matrix size: **50 × 50**.
- Intended for educational and demonstration purposes.



