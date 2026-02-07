import { BoxGeometry, Quaternion } from 'three';

interface CubieProps {
    position: [number, number, number];
    quaternion?: [number, number, number, number];
    colors: {
        top: string;
        bottom: string;
        left: string;
        right: string;
        front: string;
        back: string;
    };
}

export default function Cubie({ position, quaternion = [0, 0, 0, 1], colors }: CubieProps) {
    const q = new Quaternion(...quaternion);

    return (
        <group position={position} quaternion={q}>
            <mesh>
                <boxGeometry args={[0.94, 0.94, 0.94]} />
                <meshStandardMaterial attach="material-0" color={colors.right} />
                <meshStandardMaterial attach="material-1" color={colors.left} />
                <meshStandardMaterial attach="material-2" color={colors.top} />
                <meshStandardMaterial attach="material-3" color={colors.bottom} />
                <meshStandardMaterial attach="material-4" color={colors.front} />
                <meshStandardMaterial attach="material-5" color={colors.back} />
            </mesh>
            <lineSegments>
                <edgesGeometry args={[new BoxGeometry(0.94, 0.94, 0.94)]} />
                <lineBasicMaterial color="#000000" opacity={0.3} transparent />
            </lineSegments>
        </group>
    );
}
