import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">
          🍲 RecipeHub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link text-light" to="/">Home</Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link text-light" to="/recipes">Recipes</Link>
            </li>
            
            <li className="nav-item ms-3">
              <Link className="btn btn-warning px-4 fw-semibold" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
