import './App.css';
import Header from './components/Header';
import Home from './components/home';
import Recipes from './components/recipes';
import Login from './components/login';
import Signup from './components/signup';
import UserProfile from "./components/UserProfile";
import AddRecipe from './components/AddRecipe';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';

function Layout() {
  const location = useLocation();

  // Hide header on this route
  const hideHeaderRoutes = ["/UserProfile","/addrecipe"];

  return (
    <>
      <ToastContainer />

      {/* Show Header only if NOT in hideHeaderRoutes */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/addrecipe" element={<AddRecipe />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
