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
    const [countDown, setCountDown] = useState<number | null>(null);
    const [canMove, setCanMove] = useState(false);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            transports: ['websocket'],
        });
        socketRef.current = socket;

        const waitForSocketId = () => {
            if (socket.id) {
                console.log("Emitindo join com roomId:", socket.id);
                setPlayerId(socket.id);
                setPlayerName(name);
                socket.emit("join", { name, roomId: socket.id });
                socket.emit("startGame");
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
                return; // mantém o estado anterior se receber null
            }
            setGameState(prev => ({ ...prev, ...state })); // Merge com estado anterior
        });

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

        socket.on("start", ({ startTime }: { startTime: number }) => {
            const now = Date.now();
            const diff = startTime - now;
            const count = Math.ceil(diff / 1000); //arredondar

            if (count > 0) {
                setCanMove(false);
                setCountDown(count);
                const interval = setInterval(() => {
                    const newDiff = startTime - Date.now();
                    if (newDiff <= 0) {
                        clearInterval(interval);
                        setCountDown(null);
                        setCanMove(true);
                        setStartTime(startTime); 
                    } else {
                        setCountDown(Math.ceil(newDiff / 1000));
                    }
                }, 250);
            } else {
                setCountDown(null);
                setCanMove(true);
                setStartTime(startTime);
            }
        });

        return () => {  
            socket.disconnect();
        };
    }, [name]);

    

    const move = (x: number, y: number) => {        //envia ações do jogador (.emit)   
        if (!canMove) return;
        socketRef.current?.emit("move", { x, y });
    };

    const jump = () => {
        if (!canMove) return;
        socketRef.current?.emit("jump");
    }

    const restart = () => {
        socketRef.current?.emit("restart");
    }

    const resetGame = () => {
        socketRef.current?.emit("restartGame");
        socketRef.current?.emit("startGame"); // reinicia contagem
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
        startTime,
        countDown,
        canMove,
    };
}
