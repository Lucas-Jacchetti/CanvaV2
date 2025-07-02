// src/components/Canvas.tsx
import { useEffect, useRef } from "react";
import { useGameLoop } from "../hooks/useGameloop";
import type { GameState, Player, Obstacle } from "../types";

interface CanvasProps {
    gameState: GameState | null;
    playerId: string | null;
}

export function Canvas({ gameState, playerId }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const width = 400;
    const height = 500;
    useGameLoop(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || !gameState) return;

        // Limpa o canvas
        ctx.clearRect(0, 0, width, height);

        // Linha de chegada (topo da tela)
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, width, 5);

        // Obstáculos
        for (const obs of gameState.obstacles) {
        drawObstacle(ctx, obs);
        }

        // Jogadores
        for (const id in gameState.players) {
        const player = gameState.players[id];
        drawPlayer(ctx, player, id === playerId);
        }
    });

    return (
        <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-0 rounded-2xl bg-white mx-auto block"
        />
    );
    }

    // 🔳 Desenha um obstáculo
    function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
    ctx.fillStyle = "gray";
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // 🔴 Desenha o jogador
    function drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: Player,
    isSelf: boolean
    ) {
    ctx.fillStyle = isSelf ? "aqua" : "red";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Nome do jogador
    if (player.name) {
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(player.name, player.x - 15, player.y - 15);
    }
}
