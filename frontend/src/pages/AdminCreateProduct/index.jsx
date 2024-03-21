import React from "react";
import { useEffect } from "react";
import { logout } from "../../redux/action/apiUserAction";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminCreateProduct } from "../../lib/axiosAPI";
import DisplayPending from "../../components/DisplayPending";
import Alert from "@mui/material/Alert";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { userInfo } = useSelector((state) => state.user);

  const [img, setImg] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [color, setColor] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState();
  const [createSuccess, setCreateSuccess] = React.useState(false);
  const [categories, setCategories] = React.useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPending(true);

    const formData = new FormData();

    formData.append("image", img);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("color", color);
    formData.append("material", material);

    adminCreateProduct(userInfo, formData)
      .then(function (res) {
        setPending(false);
        setCreateSuccess(true);
      })
      .catch(function (error) {
        setPending(false);
        if (error.response.status === 401) {
          dispatch(logout());
        } else {
          setError(error.response.data.message);
        }
        setCreateSuccess(false);
      });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/categories/");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="auth">
      <DisplayPending pending={pending} />
      <form className="adminCreateProduct__container" onSubmit={submitHandler}>
        {createSuccess ? (
          <Alert severity="success">Upload Succeed</Alert>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : null}

        <div className="auth__title">Create new Product</div>

        <div className="auth__input__container">
          <label htmlFor="update_name">Name: </label>
          <input
            id="update_name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="auth__input__container">
          <label htmlFor="update_material">Material: </label>
          <input
            id="update_material"
            type="text"
            onChange={(e) => setMaterial(e.target.value)}
            value={material}
            required
          />
        </div>
        <div className="auth__input__container">
          <label htmlFor="update_color">Color: </label>
          <input
            id="update_color"
            type="text"
            onChange={(e) => setColor(e.target.value)}
            value={color}
            required
          />
        </div>
        <div className="auth__input__container">
          <label htmlFor="update_description">Description: </label>
          <textarea
            id="update_description"
            className="hide-scrollbar"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        <div className="auth__input__container">
          <label htmlFor="update_category">Category: </label>
          <select
            id="update_category"
            onChange={handleCategoryChange}
            value={category}
            required
          >
            <option value="" disabled selected>
              Select Category
            </option>{" "}
            {categories &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="auth__input__container">
          <label htmlFor="update_price">Price (In Rupees): </label>
          <input
            id="update_price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            min="0"
            required
          />
        </div>

        <div className="product-image-upload__container">
          <label htmlFor="product-image-upload">Image: </label>
          <input
            id="product-image-upload"
            style={{ border: "none ", borderRadius: "0" }}
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>

        <button type="submit" className="auth-button green-button">
          Create
        </button>
        <button
          className="auth-button"
          type="submit"
          onClick={() => navigate("/admin/productlist")}
        >
          Go Back
        </button>
      </form>
    </div>
  );
}
