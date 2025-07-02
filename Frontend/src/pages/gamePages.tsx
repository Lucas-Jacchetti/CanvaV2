import { useSocket } from "../hooks/useSockets";
import { Canvas } from "../components/canvas";
import { useEffect, useState } from "react";


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
        playerName,
        startTime,
    } = useSocket("Player");

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "ArrowLeft") {
        move(-1, 0);
        } else if (e.code === "ArrowRight") {
        move(1, 0);
        } else if (e.code === "Space") {
        jump();
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [move, jump]);

    const [liveTime, setLiveTime] = useState(0);

    useEffect(() => {
        if (!finishTime && startTime) {
            const interval = setInterval(() => {
            setLiveTime(Date.now() - startTime);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [finishTime, startTime]);

    return(
        <>
        <div className="flex flex-row justify-center gap-4 p-4 bg-gray-900 text-white min-h-screen">

            <div className="text-center text-white mb-4">
            <h1 className="text-2xl font-bold">Jogador: {playerName}</h1>

            {!finishTime && <p>⏱️ Tempo: {(liveTime / 1000).toFixed(1)}s</p>}
            {finishTime && <p className="text-green-400">🎉 Você terminou em {(finishTime / 1000).toFixed(2)}s!</p>}
            </div>

            <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-3xl font-bold">Parkour Game</h1>

                <Canvas gameState={gameState} playerId={playerId}/>

                <div className="flex gap-4 mt-2">
                    <button
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded cursor-pointer"
                    onClick={restart}
                    >
                    Reiniciar Jogador
                    </button>
                    <button
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded cursor-pointer"
                    onClick={resetGame}
                    >
                    Resetar Partida
                    </button>
                </div>

                
            </div>
            <div className="flex flex-col ml-7">
                <h2 className="text-xl font-semibold mb-2">🏁 Ranking</h2>
                <ul className="space-y-1">
                    {ranking.map((entry, index) => (
                    <li key={entry.playerId}>
                        #{index + 1} - {entry.playerName}: {(entry.time / 1000).toFixed(2)}s
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        
        </>
    )
}

export default GamePage;