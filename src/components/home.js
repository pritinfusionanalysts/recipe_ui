import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section className="text-white text-center py-5"
        style={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)"
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">
            Manage Your Recipes Like a Pro 👨‍🍳
          </h1>
          <p className="lead mt-3">
            Add, edit, rate and explore delicious recipes anytime.
          </p>
          <Link to="/recipes" className="btn btn-warning btn-lg mt-4 px-5">
            Explore Now
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container my-5">
        <div className="row text-center g-4">

          <div className="col-md-4">
            <div className="card border-0 shadow h-100 p-4">
              <div className="fs-1 text-primary">📖</div>
              <h4 className="mt-3">Easy Management</h4>
              <p className="text-muted">
                Add, update, and delete recipes easily.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow h-100 p-4">
              <div className="fs-1 text-danger">⭐</div>
              <h4 className="mt-3">Rate & Review</h4>
              <p className="text-muted">
                Give ratings and find top recipes quickly.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow h-100 p-4">
              <div className="fs-1 text-success">🔍</div>
              <h4 className="mt-3">Smart Search</h4>
              <p className="text-muted">
                Search recipes by ingredients or name.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-warning text-center py-5">
        <h2 className="fw-bold">Ready to Add Your Recipe?</h2>
        <Link to="/login" className="btn btn-dark btn-lg mt-3 px-5">
          Add Recipe
        </Link>
      </section>

    </div>
  );
}

export default Home;
