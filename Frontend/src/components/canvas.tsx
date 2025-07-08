// src/components/Canvas.tsx
import { useRef, useEffect } from "react";
import { useGameLoop } from "../hooks/useGameloop";
import type { GameState } from "../types";

interface CanvasProps {
    gameState: GameState | null;
    playerId: string | null;
}

export function Canvas({ gameState, playerId }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameStateRef = useRef<GameState | null>(null);
    const width = 400;
    const height = 500;

    // Atualiza a referência sempre que gameState mudar
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useGameLoop(() => {
        const ctx = canvasRef.current?.getContext("2d");
        const currentGameState = gameStateRef.current; // Acessa via ref
        
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        if (!currentGameState) {
            ctx.fillStyle = "black";
            ctx.font = "16px Arial";
            ctx.fillText("Carregando jogo...", width/2 - 80, height/2);
            return;
        }

        //linha de chegada
        ctx.fillStyle = "green";
        ctx.fillRect(0, 8, width, 10);

        //renderização dos objetos
        currentGameState.obstacles.forEach(obs => {
            ctx.fillStyle = "red";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });

        //renderização jogadores
        Object.entries(currentGameState.players).forEach(([id, player]) => {
            ctx.fillStyle = id === playerId ? "blue" : "green";
            ctx.beginPath();
            ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            if (player.name) {
                ctx.fillStyle = "black";
                ctx.font = "10px Arial";
                ctx.fillText(player.name, player.x - 15, player.y - 15);
            }
        });
    });

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="rounded-2xl mx-auto block bg-white"
        />
    );
}
