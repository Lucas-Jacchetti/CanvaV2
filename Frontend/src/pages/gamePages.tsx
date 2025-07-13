import { useSocket } from "../hooks/useSockets";
import { Canvas } from "../components/canvas";
import { useEffect, useState } from "react";
import { useControls } from "../hooks/useControls";


function GamePage(){
    const storedName = localStorage.getItem("playername") || "Player;"

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
        <div className="flex flex-row justify-center gap-4 p-4 bg-gray-900 text-white min-h-screen">

            <div className="text-center text-white mb-4">
                <h1 className="text-2xl font-bold">Jogador: {playerName}</h1>

                {!finishTime && <p>⏱️ Tempo: {(liveTime / 1000).toFixed(1)}s</p>}
                {finishTime && <p className="text-green-400">🎉 Você terminou em {(finishTime / 1000).toFixed(3)}s!</p>}
            
                {countDown !== null && (
                    <div className="text-4xl font-bold text-yellow-400 animate-pulse">
                        {countDown === 0 ? "GO!" : countDown}
                    </div>
                )}
            </div> 

            <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-3xl font-bold">Parkour Game</h1>

                <Canvas gameState={gameState} playerId={playerId}/>

                <div className="flex gap-4 mt-2">
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
                    {ranking.length > 0 ? (
                        ranking.map((entry, index) => (
                            <li key={`ranking-${index}-${entry.playerName}-${entry.time}`}>
                                #{index + 1} - {entry.playerName}: {(entry.time / 1000).toFixed(3)}s
                            </li>
                        ))
                    ) : (
                        <li>Nenhum registro no ranking ainda</li>
                    )}
                </ul>     
            </div>
        </div>

        
        </>
    )
}

export default GamePage;