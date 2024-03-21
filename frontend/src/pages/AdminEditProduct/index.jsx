import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/action/apiUserAction";
import { adminGetProduct, adminUpdateProduct } from "../../lib/axiosAPI";
import DisplayPending from "../../components/DisplayPending";
import Alert from "@mui/material/Alert";

export default function AdminEditProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  let { userInfo } = useSelector((state) => state.user);

  const [pending, setPending] = React.useState(true);
  const [error, setError] = React.useState();
  const [img, setImg] = React.useState([]);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [categories, setCategories] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [color, setColor] = React.useState("");

  const [createSuccess, setCreateSuccess] = React.useState(false);
  const [material, setMaterial] = React.useState("");
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  React.useEffect(() => {
    adminGetProduct(userInfo, params.id)
      .then(function (res) {
        const data = res.data;
        setImg(data.images);
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setMaterial(data.material);
        setPrice(data.price);
        setColor(data.color);

        setPending(false);
      })
      .catch(function (error) {
        setPending(false);
        if (error.response.status === 401) {
          dispatch(logout());
        } else {
          setError(error.response.data.message);
        }
      });
  }, [dispatch, params.id, userInfo]);

  const updateProductHandler = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPending(true);
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("color", color);

    formData.append("price", price);

    adminUpdateProduct(userInfo, params.id, formData)
      .then(function (res) {
        setCreateSuccess(true);
        setPending(false);
      })
      .catch(function (error) {
        setPending(false);
        if (error.response.status === 401) {
          dispatch(logout());
        } else {
          setError(error.response.data.message);
        }
      });
  };

  React.useEffect(() => {
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
      <form
        className="adminCreateProduct__container"
        onSubmit={updateProductHandler}
      >
        {createSuccess ? (
          <Alert severity="success">Update Succeed</Alert>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : null}
        <div className="auth__title">Edit Product</div>

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
          <label htmlFor="update_price">Price (In Cent): </label>
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
          Update
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
