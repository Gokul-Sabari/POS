import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import CircularProgress from "@mui/material/CircularProgress";
import POSScreen from "./components/POSScreen";
import SalesOrderHistory from "./pages/SalesOrderHistory";

const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen">
    <CircularProgress />
    <p className="ml-4">Loading...</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    try {
      const user = localStorage.getItem("user");
      const session = localStorage.getItem("session");
      const loginAt = localStorage.getItem("loginAt");
      return !!(user && session && loginAt);
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

const MainLayout = ({ children, logout }) => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

function App() {
  const [login, setLogin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const user = localStorage.getItem("user");
        const session = localStorage.getItem("session");
        const loginAt = localStorage.getItem("loginAt");
        setLogin(!!(user && session && loginAt));
      } catch (error) {
        console.error("Auth check error:", error);
        setLogin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const setLoginTrue = () => {
    localStorage.setItem('loginAt', new Date().toString());
    setLogin(true);
  };

  const logout = () => {
    localStorage.clear();
    setLogin(false);
  };

  if (checkingAuth) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            login ? <Navigate to="/pos" replace /> : <LoginPage setLoginTrue={setLoginTrue} />
          } 
        />
        <Route 
          path="/pos" 
          element={
            login ? (
              <MainLayout logout={logout}>
                <POSScreen />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/sales-orders" 
          element={
            login ? (
              <MainLayout logout={logout}>
                <SalesOrderHistory />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;