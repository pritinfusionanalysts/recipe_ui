import React, { useEffect, useState } from "react";
import axios from "axios";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/user/recipe")
      .then((res) => {
        console.log("API Response:", res.data);
        // If API returns single object
        if (!Array.isArray(res.data)) {
          setRecipes([res.data]);
        } else {
          setRecipes(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load recipes");
        setLoading(false);
      });
  }, []);

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (error) return <h3 className="text-danger text-center mt-5">{error}</h3>;

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">
        My Recipes 🍽
      </h2>

      <div className="row">
        {recipes.map((recipe, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card shadow-lg border-0 h-100">
              <div className="card-body">

                <h5 className="fw-bold text-primary">
                  👨‍🍳 {recipe.chefName}
                </h5>

                <p className="text-muted">
                  {recipe.description}
                </p>

                <hr />

                <h6 className="fw-bold">Ingredients:</h6>
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

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;
