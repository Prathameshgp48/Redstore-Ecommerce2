import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home.jsx";
import Products from "./pages/Products/Products.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Layout from "./Layout.jsx";
import ProductDetails from "./pages/SingleProduct/ProductDetails.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import ShippingAddress from "./pages/Checkout/ShippingAddress.jsx";
import VerifyOrder from "./pages/Verify/VerifyOrder.jsx";
import MyOrder from "./pages/Orders/MyOrder.jsx";
import AddProduct from "./pages/AddProduct/AddProduct.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route
            path="/cart"
            element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route
            path="/checkout/address"
            element={
              isAuthenticated ? <ShippingAddress /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/verify"
            element={
              isAuthenticated ? <VerifyOrder /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/myorders"
            element={isAuthenticated ? <MyOrder /> : <Navigate to="/login" />}
          />
          <Route path="/admin" element={<AddProduct />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
