import React from "react";
import { logout } from "../../redux/action/apiUserAction";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { adminCreateCategory } from "../../lib/axiosAPI";
import DisplayPending from "../../components/DisplayPending";
import Alert from "@mui/material/Alert";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { userInfo } = useSelector((state) => state.user);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");


  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState();
  const [createSuccess, setCreateSuccess] = React.useState(false);

  const [formError, setFormError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPending(true);
    setFormError(null);

  
    if (!name || !description) {
      setFormError('Please fill in both the name and description fields');
      setPending(false); 
      return; 
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
   

    try {
      const res = await adminCreateCategory(userInfo, formData);
      setPending(false);
      setCreateSuccess(true); 
    } 
    catch (error) {
      setPending(false);
      if (error.response.status === 401) {
        dispatch(logout());
      } else {
        setError(error.response.data.message || "An unknown error occurred"); 
      }
      setCreateSuccess(false);
    }
  };

  return (
    <div className="auth">
      <DisplayPending pending={pending} />
      <form className="adminCreateProduct__container" onSubmit={submitHandler}>
        {createSuccess ? (
          <Alert severity="success">Upload Succeed</Alert>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : null}

        <div className="auth__title">Create new Category</div>

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
