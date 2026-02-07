/**
 * Generates a random scramble for a 3x3 Rubik's Cube.
 * Standard WCA scrambles are typically around 20-25 moves.
 */
export const generateScramble = (length: number = 21): string => {
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scramble: string[] = [];
    let lastFace = '';
    let secondLastFace = '';

    while (scramble.length < length) {
        const face = faces[Math.floor(Math.random() * faces.length)];

        // Avoid repeating the same face (e.g., R R)
        if (face === lastFace) continue;

        // Avoid cancelling moves (e.g., R L R) - Simplification: avoid opposite faces back-to-back?
        // Actually, R L R is valid (parallel layers), but R R is not.
        // Also need to avoid R L R (same axis 3 times can be redundant) but let's keep it simple first:
        // Just avoid immediate repeat.

        // Advanced check: Avoid R L R type patterns if desired, but 
        // standard random state scramblers allow parallel moves. 
        // We just strictly avoid R R.

        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble.push(`${face}${modifier}`);

        secondLastFace = lastFace;
        lastFace = face;
    }

    return scramble.join(' ');
};
