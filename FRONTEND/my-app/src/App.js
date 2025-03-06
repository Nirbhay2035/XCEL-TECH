import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManageService from "./pages/ManageServices";
import ViewServices from "./pages/ViewServices";
import Navvbar from "./components/Navvbar";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";
import About from "./pages/Aboutus";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <Router>
      <div>
        <Navvbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manage-services" element={<ManageService />} />
          <Route path="/services" element={<ViewServices />} />
          <Route path="/about" element={<About />} />
        </Routes>
        {/* Show Footer to everyone except admins */}
        {!isAdmin && <Footer />}
      </div>
    </Router>
  );
}

export default App;
