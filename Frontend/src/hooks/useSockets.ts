import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { GameState, RankingEntry } from "../types";
//ranking
//playerId
//finishTime
export function useSocket(name: string){
    const socketRef = useRef<Socket | null>(null);
    const [gameState, setGameState] = useState< GameState | null>(null); 
    const [ranking, setRanking] = useState< RankingEntry[] >([]);
    const [playerId, setPlayerId] = useState< number | null >(null);
    const [finishTime, setFinishTime] = useState< string | null >(null);

    useEffect(() => {
        const socket = io("http://localhost:3000");
        socketRef.current = socket;

        socket.emit("join", { name} ); 

        socket.on("init", (state: GameState) => { //reage a eventos do servidor (.on)
            setGameState(state);
            setPlayerId(Number(socket.id));
        })

        socket.on("state", (state: GameState) => {
            setGameState(state);
        })

        socket.on("rankingUpdate", (rankingData: RankingEntry[]) => {
            setRanking(rankingData);
        })

        socket.on("finishTime", ({time}: { time: number }) => {
            setFinishTime(time.toString());
        })

        return () => {
            socket.disconnect();
        };
    }, [name]);

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
    };
}
