import { useEffect, useRef } from "react";

export function useControls({
    move,
    jump,
    resetGame
}: {
    move: (x: number, y: number) => void;
    jump: () => void;
    resetGame: () => void;
}) {
    const keysPressed = useRef<Set<string>>(new Set());
    const enterPressed = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current.add(e.key)
            if (e.key === "Enter" && !enterPressed.current) {
                enterPressed.current = true;
                resetGame(); //só uma vez por pressionamento
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key)
            if (e.key === "Enter") {
                enterPressed.current = false; // permite novo clique de Enter
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() =>{
            if (keysPressed.current.has("ArrowLeft")) {
                move(-1, 0)
            }
            if (keysPressed.current.has("ArrowRight")) {
                move(1, 0)
            }
            if (keysPressed.current.has(" ")) {
                jump()
            }
            
            
        })
        return () => clearInterval(interval);
    }, [move, jump])
}