import { useNavigate } from "react-router-dom";
import { useState } from "react";

function NamePage(){
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");

    const handleStart = () => {
        if (!nickname.trim()) return;
        sessionStorage.setItem("playername", nickname)
        navigate("/game")
    }

    return(
        <>
        <div className="flex justify-center items-center bg-gray-900">
            <div className="flex flex-col justify-center items-center bg-white gap-8 border-2 rounded-2xl w-100 mt-35 mb-10">
                <div className="text-3xl font-bold mt-8">Enter your nickname:</div>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="border-2 rounded bg-gray-100 w-60 h-auto"/>
                <button onClick={handleStart} className="border-0 w-20 h-10 cursor-pointer bg-blue-400 rounded mb-15 font-bold">Start</button>
            </div>
        </div>
        </>
    )
}

export default NamePage;