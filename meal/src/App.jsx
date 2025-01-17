import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import RecipeDetails from "./components/Recipe";
import About from "./pages/Homepage"; 
import TimePage from "./pages/TimePage";
import CaloriePage from "./pages/CaloriePage";
import IngredientPage from "./pages/IngredientPage";
import NutritionPage from "./pages/NutritionPage";
import Quiz from "./pages/MultipleChoiceQuestion"; 
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login/login";
import SignUp from "./Login/register";
import Profile from "./Login/profile";
import Search from "./pages/Search";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); 
    }
  }, []);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

function AppContent({ user, setUser }) {
  const location = useLocation(); // useLocation inside Router context

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/preferences" element={<Quiz />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<SignUp setUser={setUser} />} />
        <Route path="/profile" element={user ? <Profile setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/time" element={<TimePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/calorie" element={<CaloriePage />} />
        <Route path="/ingredients" element={<IngredientPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Render Footer only if the current path is not /quiz */}
      {location.pathname !== "/quiz" && <Footer />}
    </>
  );
}

export default App;
