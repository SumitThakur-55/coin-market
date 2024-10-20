import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import HomePage from "./component/HomePage"

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#0D1421] min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/coins/:slug" element={<CoinsPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;
