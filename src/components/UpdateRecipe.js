import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function UpdateRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredientId: "", quantity: "" }
  ]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeLoading, setRecipeLoading] = useState(true);
  // 🔐 Protect page + fetch recipe then ingredients, map names -> ids
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        setRecipeLoading(true);

        // 1) Fetch recipe by trying multiple possible endpoints (fallback)
        let recipe = null;
        const candidateEndpoints = [
          `/api/chef/recipe/${id}`,
          `/api/chef/update/${id}`,
          `/api/chef/${id}`
        ];

        for (const ep of candidateEndpoints) {
          try {
            const r = await API.get(ep);
            recipe = r.data || {};
            console.log(`Fetched recipe from ${ep}`, recipe);
            break;
          } catch (err) {
            console.warn(`GET ${ep} failed:`, err.response?.status, err.response?.data || err.message);
            // try next endpoint
          }
        }

        if (!recipe) {
          throw new Error('Recipe not found on any known endpoint');
        }

        setName(recipe.name || "");
        setDescription(recipe.description || "");

        // create baseline ingredient rows preserving original names
        const originalIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
        const baseline = originalIngredients.length > 0
          ? originalIngredients.map((ing) => ({ ingredientId: "", quantity: ing.quantity || "", originalName: ing.name || ing.label || "" }))
          : [{ ingredientId: "", quantity: "", originalName: "" }];

        setIngredients(baseline);
        console.log("Recipe baseline:", recipe);

        // 2) Fetch ingredient options and map names -> ids
        const res = await API.get("/api/ingredient");
        const data = res && res.data ? res.data : [];
        const normalized = Array.isArray(data) ? data : [];
        setIngredientOptions(normalized);

        // map baseline rows to ingredientIds where possible
        const mapped = baseline.map((row) => {
          if (!row.originalName) return row;
          const match = normalized.find((opt) => String(opt.name).toLowerCase() === String(row.originalName).toLowerCase());
          return {
            ...row,
            ingredientId: match ? (match.id ?? match._id ?? match.ingredientId ?? "") : ""
          };
        });

        setIngredients(mapped);
        console.log("Ingredient options:", normalized);
        console.log("Mapped ingredients:", mapped);
      } catch (error) {
        console.error("Failed to load recipe or ingredients", error);
        alert("Failed to load recipe ❌");
        navigate("/UserProfile");
      } finally {
        setRecipeLoading(false);
      }
    };

    load();
  }, [navigate, id]);

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

  // ✅ Update Recipe
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

    const payload = {
      name,
      description,
      ingredients: ingredients.map((it) => ({
        ingredientId: Number(it.ingredientId),
        quantity: it.quantity
      }))
    };

    try {
      setLoading(true);

      // Validate ingredient IDs before sending to backend
      const invalid = ingredients.some((it) => {
        return it.ingredientId === "" || it.ingredientId == null || isNaN(Number(it.ingredientId));
      });

      if (invalid) {
        alert("Please select a valid ingredient for every row.");
        setLoading(false);
        return;
      }

      console.log("Updating recipe payload:", payload);

      await API.put(`/api/chef/update/${id}`, payload);

      alert("Recipe Updated Successfully ✅");
      navigate("/UserProfile");

    } catch (error) {
      console.error(error);
      alert("Failed to update recipe ❌");
    } finally {
      setLoading(false);
    }
  };

  if (recipeLoading) {
    return (
      <div className="container mt-4">
        <h3>Loading recipe...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Update Recipe 🍽</h3>

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
            {loading ? "Updating..." : "Update Recipe"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default UpdateRecipe;
