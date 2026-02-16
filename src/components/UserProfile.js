import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function UserProfile() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUsername = localStorage.getItem("username");

  if (!token) {
    navigate("/login");
  } else {
    setUsername(savedUsername);
    fetchRecipes();
  }
}, [navigate]);

  const fetchRecipes = async () => {
  try {
    const token = localStorage.getItem("token");
   

    const res = await API.get("/api/chef/my-recipes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Fetched Recipes:", res.data);

    setRecipes(Array.isArray(res.data) ? res.data : [res.data]);

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};

  const handleDelete = async (id) => {
   
    try {
      await API.delete(`/api/chef/delete/${id}`);
      fetchRecipes(); // refresh list
      alert("Recipe deleted successfully ✅");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete recipe ❌");
    }
  };

  const   handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, {username} 👋</h3>
       

        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/addrecipe")}
          >
            + Add Recipe
          </button>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="row">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow border-0 h-100">
                <div className="card-body">

                  <h5 className="fw-bold text-primary">

                    {/* here need to add recipe name  */}
                     {recipe.name}
                  </h5>

                  <p className="text-muted">
                    {recipe.description}
                  </p>

                  <hr />

                  <ul className="list-group list-group-flush">
                    {recipe.ingredients.map((item, i) => (
                      <li key={i} className="list-group-item px-0">
                        {item.name} - 
                        <span className="text-success ms-1">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/update/${recipe.id}`)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-danger btn-sm"      
                      onClick={() => handleDelete(recipe.id)}
                    >
                  
                      Delete
                    </button>
                  
                  </div>

                </div>
              </div>
            </div>
          ))
        ) : (
          <h5>No Recipes Found</h5>
        )}
      </div>

    </div>
  );
}

export default UserProfile;
