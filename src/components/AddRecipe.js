import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function AddRecipe() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredientId: "", quantity: "" }
  ]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Protect page + fetch ingredients
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchIngredients();
  }, [navigate]);

  // ✅ Fetch Ingredients (Token auto attached)
  const fetchIngredients = async () => {
    try {
      const res = await API.get("/api/ingredient");
      const data = res && res.data ? res.data : [];
      const normalized = Array.isArray(data) ? data : [];
      setIngredientOptions(normalized);
      console.log("Fetched ingredients:", normalized);
    } catch (error) {
      console.error("Failed to fetch ingredients", error);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredientId: "", quantity: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleRemove = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const isDuplicateIngredient = () => {
    const ids = ingredients.map(i => i.ingredientId);
    return new Set(ids).size !== ids.length;
  };

  // ✅ Submit Recipe (Token auto attached)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      alert("Please fill all fields ❌");
      return;
    }

    if (isDuplicateIngredient()) {
      alert("Duplicate ingredients selected ❌");
      return;
    }

    try {
      setLoading(true);

      // Validate ingredient IDs before sending to backend
      const invalid = ingredients.some((it) => {
        // treat empty strings, null, undefined or non-numeric values as invalid
        return it.ingredientId === "" || it.ingredientId == null || isNaN(Number(it.ingredientId));
      });

      if (invalid) {
        alert("Please select a valid ingredient for every row.");
        setLoading(false);
        return;
      }

      const payload = {
        name,
        description,
        ingredients: ingredients.map((it) => ({
          ingredientId: Number(it.ingredientId),
          quantity: it.quantity
        }))
      };

      console.log("Submitting recipe payload:", payload);

      await API.post("/api/chef/save", payload);

      alert("Recipe Added Successfully ✅");
      navigate("/UserProfile");

    } catch (error) {
      console.error(error);

      console.log("data:" , payload);
      //alert("Failed to add recipe ❌");
    } 
    /*finally {
      setLoading(false);
    }*/
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Add New Recipe 🍽</h3>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Recipe Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <h5 className="mt-4">Ingredients</h5>

        {ingredients.map((item, index) => (
          <div key={index} className="row mb-3">

            <div className="col-md-5">
              <select
                className="form-select"
                value={item.ingredientId}
                onChange={(e) =>
                  handleChange(index, "ingredientId", e.target.value)
                }
                required
              >
                <option value="">Select Ingredient</option>
                {Array.isArray(ingredientOptions) && ingredientOptions.map((option, idx) => {
                  const id = option?.id ?? option?._id ?? option?.ingredientId ?? idx;
                  const label = option?.name ?? option?.label ?? String(option);
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Quantity (e.g. 500 g)"
                value={item.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", e.target.value)
                }
                required
              />
            </div>

            <div className="col-md-2">
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemove(index)}
                >
                  X
                </button>
              )}
            </div>

          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={handleAddIngredient}
        >
          + Add Ingredient
        </button>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate("/UserProfile")}
          >
            ⬅ Back
          </button>

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Recipe"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddRecipe;
