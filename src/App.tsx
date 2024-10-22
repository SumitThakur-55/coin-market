import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import HomePage from "./component/HomePage"
import CoinDetail from "./component/coinDetail";
import CoinData from "./component/CoinData"
function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#0D1421] min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coins/:id" element={<CoinData />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;
