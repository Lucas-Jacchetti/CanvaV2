import { useSocket } from "../hooks/useSockets";
import { Canvas } from "../components/canvas";
import { useEffect } from "react";


function GamePage(){
    
    const {
        gameState,
        playerId,
        finishTime,
        ranking,
        move,
        jump,
        restart,
        resetGame,
    } = useSocket("Jogador");

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "ArrowLeft") {
        move(-5, 0);
        } else if (e.code === "ArrowRight") {
        move(5, 0);
        } else if (e.code === "Space") {
        jump();
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [move, jump]);

    return(
        <>
        <div className="flex flex-row justify-center gap-4 p-4 bg-gray-900 text-white min-h-screen">
            <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-3xl font-bold">Parkour Game</h1>

                <Canvas gameState={gameState} playerId={playerId ? String(playerId) : null}/>

                <div className="flex gap-4 mt-2">
                    <button
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
                    onClick={restart}
                    >
                    Reiniciar Jogador
                    </button>
                    <button
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                    onClick={resetGame}
                    >
                    Resetar Partida
                    </button>
                </div>

                {finishTime !== null && (
                    <p className="text-green-400 text-lg mt-2">
                    🏁 Você terminou em {finishTime}ms!
                    </p>
                )}
            </div>
            <div className="flex flex-col ml-7">
                <h2 className="text-xl font-semibold mt-6">🏆 Ranking</h2>
                <ul className="w-full max-w-sm">
                    {ranking.map((entry, index) => (
                    <li
                        key={index}
                        className="bg-gray-800 p-2 rounded my-1 flex justify-between"
                    >
                        <span>{entry.playerName}</span>
                        <span>{entry.time}ms</span>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        
        </>
    )
}

export default GamePage;