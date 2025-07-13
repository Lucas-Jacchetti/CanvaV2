import { useEffect, useRef } from "react";
import type { GameState } from "../types";

type CanvasProps = {
    gameState: GameState | null;
    playerId: string | null;
    className?: string; // <- para aceitar `className` de fora
};

export function Canvas({ gameState, playerId, className = "" }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context) return;

        const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !gameState) return;

        const { players, obstacles } = gameState;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenha obstáculos
        ctx.fillStyle = "#666";
        for (const obs of obstacles) {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }

        // Desenha jogadores
        for (const player of Object.values(players)) {
            ctx.beginPath();
            ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = player.id === playerId ? "#4ade80" : "#3b82f6"; // verde ou azul
            ctx.fill();
            ctx.closePath();

            // Nome acima do jogador
            ctx.fillStyle = "#fff";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(player.name, player.x, player.y - 15);
        }
    }, [gameState, playerId]);

    return (
        <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full z-0 ${className}`}
        />
    );
}
