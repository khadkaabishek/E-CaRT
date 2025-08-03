import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/home_dash/Dashboard";
import Home from "./pages/home_dash/Home";
import MainLayout from "./layouts/MainLayout";
import AddItem from "./pages/Manipulate/AddItem";
import SingleItem from "./pages/SingleItem";
import Cart from "./pages/Cart";
import EditItemInfo from "./pages/Manipulate/EditItemInfo";
import MyItems from "./pages/MyItems";
import Become_seller from "./pages/SellerPage";
import AdminLayout from "./Admin/Layouts/AdminLayout";
import Users from "./Admin/Pages/Users";
import Sellers from "./Admin/Pages/Sellers";
import Requests from "./Admin/Pages/Requests";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import SellerOrders from "./pages/SellerOrders";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const userJSON = localStorage.getItem("user");
  const user = userJSON ? JSON.parse(userJSON) : null;
  useEffect(() => {
    const updateAuthState = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setIsAdmin(user?.role === "admin");
      setLoading(false);
      
    };
    
    updateAuthState();
    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);
  
  const ownerId = user._id;
  if (loading) return <div>Loading...</div>;

  return (
    <GoogleOAuthProvider clientId="171333532529-md206rcrbf2in08qiqross5s0ceai6sf.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login setIsAuthenticated={setIsAuthenticated} /></MainLayout>} />
          <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
          <Route path="/product/:id" element={<MainLayout><SingleItem /></MainLayout>} />
          <Route path="/your_cart" element={<MainLayout><Cart /></MainLayout>} />
          <Route path="/become_seller" element={<MainLayout><Become_seller /></MainLayout>} />

          <Route path="/dashboard" element={isAuthenticated ? <MainLayout><Dashboard /></MainLayout> : <Navigate to="/login" />} />
          <Route path="/add-item" element={isAuthenticated ? <MainLayout><AddItem /></MainLayout> : <Navigate to="/login" />} />
          <Route path="/:id/my_items" element={<MainLayout><MyItems /></MainLayout>} />
          <Route path="/:id/edit_item_info" element={<MainLayout><EditItemInfo /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
          <Route path="/myOrders" element={<MainLayout><MyOrders /></MainLayout>} />
          <Route path="/Orders" element={<MainLayout><SellerOrders /></MainLayout>} />
          <Route path="/analytics" element={<MainLayout><AnalyticsDashboard ownerId={ownerId} /></MainLayout>} />

          {isAdmin && (
            <>
              <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
              <Route path="/admin/sellers" element={<AdminLayout><Sellers /></AdminLayout>} />
              <Route path="/admin/requests" element={<AdminLayout><Requests /></AdminLayout>} />
              <Route path="/admin" element={<Navigate to="/admin/users" />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
