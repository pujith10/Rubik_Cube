export interface TutorialStep {
    id: string;
    title: string;
    description: string;
    algorithm?: string;
    setup?: string; // Moves to setup the case before showing algorithm
    tips?: string[];
}

export interface TutorialMethod {
    id: string;
    name: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    steps: TutorialStep[];
}

export const TUTORIALS: Record<string, TutorialMethod> = {
    'beginner': {
        id: 'beginner',
        name: 'Beginner Method',
        description: 'The easiest way to solve a Rubik\'s Cube layer by layer.',
        difficulty: 'Beginner',
        steps: [
            {
                id: 'daisy',
                title: '1. The Daisy',
                description: 'Create a daisy pattern on the top face with the yellow center and 4 white edge petals.',
                tips: [
                    'Find the yellow center and hold it on top.',
                    'Look for white edge pieces in the middle layer.',
                    'Rotate the face to bring them up to the yellow face.'
                ]
            },
            {
                id: 'white-cross',
                title: '2. The White Cross',
                description: 'Align the white edges with their side centers and bring them down to the white face.',
                algorithm: 'F2',
                setup: 'D2 R2 U F2 D2', // Just random setup for visual
                tips: [
                    'Match the non-white color of a petal to its center.',
                    'Rotate that face 180 degrees (F2).',
                    'Repeat for all 4 petals.'
                ]
            },
            {
                id: 'first-layer',
                title: '3. First Layer Corners',
                description: 'Insert the white corners to complete the first layer.',
                algorithm: "R U R' U'",
                setup: "R U R' U'", // Setup puts it in position to need the algo
                tips: [
                    'Find a corner with white on it in the top layer.',
                    'Position it above where it needs to go.',
                    'Repeat the "Sexy Move" (R U R\' U\') until it is solved.'
                ]
            },
            {
                id: 'second-layer',
                title: '4. Second Layer',
                description: 'Solve the middle layer edges.',
                algorithm: "U R U' R' U' F' U F",
                setup: "F' U' F U R U R' U'", // Reverse
                tips: [
                    'Find an edge on top without yellow.',
                    'Match it to the front center to make a T shape.',
                    'Determine if it needs to go Right or Left.',
                    'Use the algorithm to insert it.'
                ]
            },
            {
                id: 'yellow-cross',
                title: '5. Yellow Cross',
                description: 'Make a yellow cross on the top face.',
                algorithm: "F R U R' U' F'",
                setup: "F U R U' R' F'",
                tips: [
                    'Look at the yellow pattern: Dot, L-shape, or Line.',
                    'Apply the algorithm until you get a cross.'
                ]
            },
            {
                id: 'oll-edges',
                title: '6. Orient Yellow Edges',
                description: 'Align the yellow cross edges with side centers.',
                algorithm: "R U R' U R U2 R'",
                tips: [
                    'Rotate top until 2 edges match.',
                    'Hold matched edges at Back and Right (or Front/Back).',
                    'Apply algorithm.'
                ]
            },
            {
                id: 'pll-corners',
                title: '7. Position Corners',
                description: 'Put corners in the right spot, even if twisted wrong.',
                algorithm: "U R U' L' U R' U' L",
                tips: [
                    'Find a corner that is in the correct position.',
                    'Hold it at Front-Right-Top.',
                    'Apply algorithm.'
                ]
            },
            {
                id: 'orient-corners',
                title: '8. Orient Corners (Finish)',
                description: 'Twist the corners to finish the cube.',
                algorithm: "R' D' R D",
                tips: [
                    'Hold the cube with yellow on top.',
                    'Focus on one corner at Front-Right-Top.',
                    'Repeat R\' D\' R D until yellow works.',
                    'Rotate Top (U) to bring next corner. DO NOT ROTATE CUBE.'
                ]
            }
        ]
    },
    'cfop': {
        id: 'cfop',
        name: 'CFOP (Advanced)',
        description: 'Cross, F2L, OLL, PLL. The speedsolving method.',
        difficulty: 'Advanced',
        steps: [
            {
                id: 'cross',
                title: 'Cross',
                description: 'Solve the cross on the bottom (usually white) directly.',
                tips: ['Plan efficient cross moves during inspection (aim for < 8 moves).']
            },
            {
                id: 'f2l',
                title: 'F2L (First 2 Layers)',
                description: 'Solve corner and edge pairs simultaneously.',
                algorithm: "R U R'",
                tips: ['Pair them up in top layer, then insert.']
            },
            {
                id: 'oll',
                title: 'OLL (Orient Last Layer)',
                description: 'Make the top face all one color (Yellow).',
                algorithm: "R U2 R2 F R F' U2 R' F R F'",
                tips: ['Learn the 57 algorithms eventually. Start with 2-look OLL.']
            },
            {
                id: 'pll',
                title: 'PLL (Permute Last Layer)',
                description: 'Move pieces to solved positions.',
                algorithm: "R U' R U R U R U' R' U' R2",
                tips: ['Learn the 21 algorithms. Start with 2-look PLL (T-perm, Y-perm, U-perms).']
            }
        ]
    }
};
