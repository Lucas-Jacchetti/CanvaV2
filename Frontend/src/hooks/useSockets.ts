import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { GameState, RankingEntry } from "../types";

export function useSocket(name: string){
    const socketRef = useRef<Socket | null>(null);
    const [gameState, setGameState] = useState< GameState | null>(null); 
    const [ranking, setRanking] = useState< RankingEntry[] >([]);
    const [playerId, setPlayerId] = useState< string | null >(null);
    const [finishTime, setFinishTime] = useState< number | null >(null);
    const [playerName, setPlayerName] = useState<string>(""); 
    const [startTime, setStartTime] = useState<number>(Date.now()); 

    useEffect(() => {
        const socket = io("http://localhost:3000");
        socketRef.current = socket;

        const waitForSocketId = () => {
        if (socket.id) {
            console.log("Emitindo join com roomId:", socket.id);
            setPlayerId(socket.id);
            setPlayerName(name);
            socket.emit("join", { name, roomId: socket.id });
        } else {
            setTimeout(waitForSocketId, 10); // tenta novamente em 10ms
        }
    };

        socket.on("connect", () => {
            console.log("Connected! Esperando socket.id...");
            waitForSocketId(); // chama o emissor confiável
        });

        socket.on("state", (state: GameState) => {
            if (!state) {
                console.warn("Received null state, keeping previous state");
                return; // Mantém o estado anterior se receber null
            }
            setGameState(prev => ({ ...prev, ...state })); // Merge com estado anterior

            // if (playerId && state.players[playerId]) {
            //     const serverStartTime = state.players[playerId].startTime;
            //     setStartTime(serverStartTime);
            //     console.log("Server startTime: ", serverStartTime)
            // } else console.log("Not entered")
        });

            // Adicione também para o evento 'init':
        socket.on("init", (initialState: GameState) => {
            if (!initialState) {
                console.error("Received null initial state");
                return;
            }
            console.log("Initial game state received:", initialState);
            setGameState(initialState);
        });

        socket.on("rankingUpdate", (rankingData: RankingEntry[]) => {
            setRanking(rankingData);
        })

        socket.on("playerFinished", ({time}: { time: number }) => {
            setFinishTime(Number(time));
        })

        return () => {
            socket.disconnect();
        };
    }, [name]);

    useEffect(() => {
    if (playerId && gameState?.players?.[playerId]) {
        const serverStartTime = gameState.players[playerId].startTime;

        // Só atualiza se for diferente do atual
        if (serverStartTime !== startTime) {
            setStartTime(serverStartTime);
            // setFinishTime(null); // limpa finishTime ao reiniciar
            console.log("⏱️ Novo startTime vindo do servidor:", serverStartTime);
        }
    }
}, [gameState, playerId, startTime]);

    const move = (x: number, y: number) => {        //envia ações do jogador (.emit)   
        socketRef.current?.emit("move", { x, y });
    };

    const jump = () => {
        socketRef.current?.emit("jump");
    }

    const restart = () => {
        socketRef.current?.emit("restart");
    }

    const resetGame = () => {
        socketRef.current?.emit("restartGame");
        setFinishTime(null);
    }

    return {
        gameState,
        playerId,
        finishTime,
        ranking,
        move,
        jump,
        restart,
        resetGame,
        playerName,    
        startTime
    };
}
