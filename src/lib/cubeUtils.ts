
export const notationToMove = (notation: string): { axis: 'x' | 'y' | 'z', layer: number, direction: number } | null => {
    // Notation: Face (U, D, L, R, F, B) + Modifier (none, ', 2)
    const face = notation.charAt(0).toUpperCase();
    const modifier = notation.length > 1 ? notation.charAt(1) : '';

    let axis: 'x' | 'y' | 'z';
    let layer: number; // 1 for positive side, -1 for negative side (assuming 3x3 centered at 0 with size 1 cubies, offset at +/-1)
    let direction: number; // -1 for clockwise (standard), 1 for counter-clockwise
    // Wait, direction logic depends on the axis and view.
    // Standard R (Right Clockwise) rotates the Right face clockwise relative to looking at it.

    // Let's define the standard mappings based on typically coordinate systems (Right-Hand Rule)
    // X+: Right, X-: Left
    // Y+: Up, Y-: Down
    // Z+: Front, Z-: Back

    // R (Right Face, X+): Clockwise around X axis is negative direction? No, RHR thumb on X+ -> fingers curl Y+ to Z+?
    // Let's assume standard Three.js rotation: +rotation is counter-clockwise around axis vector.
    // So -Math.PI/2 is clockwise.

    const CLOCKWISE = -1;
    const COUNTER_CLOCKWISE = 1;

    switch (face) {
        case 'R':
            axis = 'x';
            layer = 1; // Right face
            direction = CLOCKWISE;
            break;
        case 'L':
            axis = 'x';
            layer = -1; // Left face
            direction = COUNTER_CLOCKWISE; // L is opposite to R, so "clockwise" looking at L is counter-clockwise for X axis
            break;
        case 'U':
            axis = 'y';
            layer = 1; // Up face
            direction = CLOCKWISE;
            break;
        case 'D':
            axis = 'y';
            layer = -1; // Down face
            direction = COUNTER_CLOCKWISE;
            break;
        case 'F':
            axis = 'z';
            layer = 1; // Front face
            direction = CLOCKWISE;
            break;
        case 'B':
            axis = 'z';
            layer = -1; // Back face
            direction = COUNTER_CLOCKWISE;
            break;
        default:
            return null;
    }

    // Apply modifiers
    if (modifier === "'") {
        direction *= -1; // Invert direction
    } else if (modifier === '2') {
        // Double move: direction doesn't strictly matter for end state but let's say 2 steps.
        // Our 'Move' interface typically handles single 90deg steps?
        // Or does it support angle?
        // The current implementation probably supports 90deg triggers.
        // We'll need to trigger it twice for '2'.
        // For now, let's return a single move object, and the caller will handle '2' by calling it twice.
        // Wait, 'direction' in Move interface is usually just sign (-1 or 1).
        // I will return the single move, and the caller parses '2'.
    }

    return { axis, layer, direction };
};
