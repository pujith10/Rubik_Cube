import Cube from 'rubiks-cube';

// Check if default export is the class or if it's named
console.log('Imported:', Cube);

try {
    const cube = new Cube();
    console.log('Created Cube instance');
    console.log('Solved:', cube.isSolved());

    // Check solve method
    if (cube.solve) {
        console.log('Has solve method');
        console.log('Solution for solved:', cube.solve());
    } else {
        console.log('No solve method? Keys:', Object.keys(cube));
    }

    // Check constructing from string
    // Usually libraries have fromString or similar
    if (Cube.fromString) {
        console.log('Has fromString');
    }
} catch (e) {
    console.error('Error:', e);
}
