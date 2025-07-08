import { BrowserRouter, Route, Routes } from "react-router-dom";
import NamePage from "../pages/namePage";
import GamePage from "../pages/gamePages";

function Routing(){
    return (
    <> 
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<NamePage />} />
            <Route path="/game" element={<GamePage />} />
        </Routes>
    </BrowserRouter>
    </>
    )
}
export default Routing;