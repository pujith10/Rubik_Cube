import { useParams } from 'react-router-dom';

export default function AlgorithmsPage() {
    const { size, category } = useParams();

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Algorithms: {category} ({size}x{size})</h1>
            <p className="text-neutral-400">Algorithm list coming soon...</p>
        </div>
    );
}
