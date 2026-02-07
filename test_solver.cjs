const solver = require('cube-solver');

console.log('Solver type:', typeof solver);
if (typeof solver === 'object') {
    console.log('Solver keys:', Object.keys(solver));
}

const solvedState = 'uuuuuuuuurrrrrrrrrfffffffffd'; // partial, showing format
const fullSolved = 'uuuuuuuuurrrrrrrrrfffffffffdddddddddlllllllllbbbbbbbbb';

try {
    if (solver.solve) {
        console.log('Attempting solve with 1 arg...');
        console.log(solver.solve(fullSolved));
    } else {
        console.log('Solver function not found on default export');
    }
} catch (e) {
    console.log('Error with 1 arg:', e.message);
    try {
        console.log('Attempting solve with 2 args (options={})...');
        console.log(solver.solve(fullSolved, {}));
    } catch (e2) {
        console.log('Error with 2 args:', e2.message);
    }
}
