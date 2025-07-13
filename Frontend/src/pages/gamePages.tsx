import { useSocket } from "../hooks/useSockets";
import { Canvas } from "../components/canvas";
import { useEffect, useState } from "react";
import { useControls } from "../hooks/useControls";


function GamePage(){
    const storedName = sessionStorage.getItem("playername") || "Player;"

    const {
        gameState,
        playerId,
        finishTime,
        ranking,
        move,
        jump,
        resetGame,
        playerName,
        startTime,
        countDown,
        canMove,
    } = useSocket(storedName);

    useControls({move, jump});

    const [liveTime, setLiveTime] = useState(0);

    useEffect(() => {
        if (canMove && !finishTime && startTime) {
            const interval = setInterval(() => {
            setLiveTime(Date.now() - startTime);
            }, 10);
            return () => clearInterval(interval);
        }
    }, [canMove, finishTime, startTime]);


    return(
        <>
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Canvas ocupa toda a tela */}
            <Canvas className="absolute inset-0 w-full h-full z-0" gameState={gameState} playerId={playerId} />

            {/* Interface sobreposta */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
                {/* Topo: Tempo e Título */}
                <div className="flex justify-between items-start">
                <div className="bg-black/50 text-white p-2 rounded pointer-events-auto">
                    <p className="text-sm sm:text-lg">⏱️ Tempo: {(liveTime / 1000).toFixed(1)}s</p>
                </div>

                <div className="bg-black/50 text-white p-2 rounded text-center pointer-events-auto">
                    <h1 className="text-xl sm:text-2xl font-bold">Parkour Game</h1>
                    <p className="text-sm">Jogador: {playerName}</p>
                </div>
                </div>

                {/* Fundo: Botões e Ranking */}
                <div className="flex justify-between items-end">
                <button
                    onClick={resetGame}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded pointer-events-auto"
                >
                    Resetar Partida
                </button>

                <div className="bg-black/50 text-white p-3 rounded pointer-events-auto w-[250px]">
                    <h2 className="text-lg font-bold mb-2">🏁 Ranking</h2>
                    <ul className="text-sm space-y-1 max-h-[200px] overflow-y-auto">
                    {ranking.map((entry, index) => (
                        <li key={entry.playerId || index}>
                        #{index + 1} - {entry.playerName}: {(entry.time / 1000).toFixed(2)}s
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default GamePage;