import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Login from "./components/login/login";
import Navbar from "./common/navbar/navbar";
import HomePage from "./components/homepage/homepage";
import AdminAddProduct from "./components/admin/AdminAddProduct/AdminAddProduct";

function App() {
  return (
    <Router>
      {/* Navbar is placed outside of Routes, so it stays on every page */}
      <Navbar />
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminAddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
