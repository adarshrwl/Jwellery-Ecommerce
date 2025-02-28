import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Login from "./components/login/login";
import Navbar from "./common/navbar/navbar";
import HomePage from "./components/homepage/homepage";
import AdminAddProduct from "./components/admin/AdminAddProduct/AdminAddProduct";
import AdminProductPage from "./components/admin/AdminViewAllProduts/AdminProductPage";
import { Categories } from "./components/categories/categories.jsx";
import Cart from './components/cart/Cart.jsx'

function App() {
  return (
    <Router>
      {/* Navbar is placed outside of Routes, so it stays on every page */}
      <Navbar />
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminAddProduct" element={<AdminAddProduct />} />
        <Route path="/editProduct" element={<AdminProductPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={< Cart/>} />
      </Routes>
    </Router>
  );
}

export default App;
