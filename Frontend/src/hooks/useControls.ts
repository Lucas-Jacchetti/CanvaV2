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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current.add(e.key)
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key)
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, []);

    useEffect(() => {
        const loop = () => {
            if (keysPressed.current.has("ArrowLeft")) {
                move(-1, 0)
            }
            if (keysPressed.current.has("ArrowRight")) {
                move(1, 0)
            }
            if (keysPressed.current.has(" ")) {
                jump()
            }
            if (keysPressed.current.has("Enter")) {
                resetGame()
            }

        };

        loop();
    }, [move, jump, resetGame])
}