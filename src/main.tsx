import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import App from "./App";
import Home from "./routes/home";
import Shop from "./routes/shop";
import ProductDetail from "./routes/product-detail";
import Cart from "./routes/cart";
import Checkout from "./routes/checkout";
import Orders from "./routes/orders";
import OrderDetail from "./routes/order-detail";
import Login from "./routes/login";
import Profile from "./routes/profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import "./App.css";

// Componente para redirigir según autenticación
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si es admin, ir a admin, si no a tienda
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/shop" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Admin Routes - Protegidas */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <App />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
      </Route>
      
      {/* Shop Routes */}
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
