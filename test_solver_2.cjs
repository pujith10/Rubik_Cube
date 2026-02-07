const solver = require('rubiks-cube-solver');

console.log('Solver type:', typeof solver);
// Default export might be the function itself
if (typeof solver === 'function') {
    console.log('Solver is a function');
}

// U R F D L B
const solvedState = 'uuuuuuuuurrrrrrrrrfffffffffdddddddddlllllllllbbbbbbbbb';

console.log('Attempting solved state...');
try {
    const result = solver(solvedState);
    console.log('Solved result:', result);
    // If it returns "R L..." then it somehow scrambled it? Or it returns steps to solve?
    // Ideally empty string or null.
} catch (e) {
    console.log('Error on solved state:', e.message);
}

// Attempting a scrambled state: R move
// U (white) -> row 0,1,2 (top) uuu. row 3,4,5 (mid) uuu. row 6,7,8 (bot) uuu.
// R move affects: R face (rotates), U right col, F right col, D right col, B right col.
// Let's manually construct a state that corresponds to R move performed on solved cube.
// Solution should be R' (or R3, or L? depending on orientation).
// U right col (idx 2, 5, 8) becomes F right col colors (g).
// F right col (idx 2, 5, 8) becomes D right col colors (y).
// D right col (idx 2, 5, 8) becomes B right col colors (b) ??
// B right col (idx 0, 3, 6? or 2,5,8? depends on net layout) becomes U right col colors (w).

// This manual construction is error prone.
// Let's use a simpler heuristic:
// Just try to run the solver on the solved state string.
// If it fails with "moving down from front...", it confirms the library bug or feature.
