import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import renderScreen from './render-screen.tsx'

interface Player { //propriedade do jogador esperada
    id: string;
    x: number;
    y: number;
    color: string;
}

const socket = io("http://localhost:3000"); //instancia o socket conectado ao websocket na porta do back

function Canva(){
    const [players, setPlayers] = useState<Record<string, Player>>({}); //estado local com os players, cada player vai ter um id

    

    return(
        <>
        <div className='flex justify-center items-center h-screen w-full'>
            <canvas className="h-150 w-100 border-black border-4 bg-gray-300"></canvas>
        </div>
        </>
    )
}

export default Canva;