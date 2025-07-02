import { useEffect, useRef } from "react";

export function useGameLoop(callback: () => void, fps = 60) { 
    const requestRef = useRef<number>(undefined); //guarda o id do frame atual
    const previousTimeRef = useRef<number>(undefined); //armazena o timestamp do ultimo frame executado


    const animate = (time: number) => { //chamada automaticamente pelo navegador com requestAnimationFrame
        if (!previousTimeRef.current) {
            previousTimeRef.current = time;
        }

        const delta = time - previousTimeRef.current; //quanto tempo passou desde o ultimo delta

        if (delta > 1000 / fps) { //controlar manualmente o fps, chama o callback apos um tempo à escolha
            callback()
            previousTimeRef.current = time;
        }

        requestRef.current = requestAnimationFrame(animate); //navegador chama animate no próximo frame
    }

    useEffect(() => { //quando o componente for montado, inicia o loop, e depois cancela quando for desmontado
        requestRef.current = requestAnimationFrame(animate);
        return() => cancelAnimationFrame(requestRef.current!);
    }, []);



}   