import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Player { //propriedade do jogador esperada
    id: string;
    x: number;
    y: number;
    color: string;
}

const socket: Socket = io("http://localhost:3000"); //instancia o socket conectado ao websocket na porta do back

function Canva(){
    const [players, setPlayers] = useState<Record<string, Player>>({}); //estado local com os players, cada player vai ter um id
    
    function drawPlayer(ctx: CanvasRenderingContext2D){ //desenha os jogadores no canva 
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); //limpa a tela do canva

        //para cada jogador, desenha um quadrado na posição e cor correta
        for (const player of Object.values(players)) {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, 30, 30); // largura e altura fixas: 30x30
            }
        }
    


    return(
        <>
        <div className='flex justify-center items-center h-screen w-full'>
            <canvas className="h-150 w-100 border-black border-4 bg-gray-300">

            </canvas>
        </div>
        </>
    )
}

export default Canva;