import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/action/apiUserAction";
import { adminGetCategorybyID, adminUpdateCategory } from "../../lib/axiosAPI";
import DisplayPending from "../../components/DisplayPending";
import Alert from "@mui/material/Alert";

export default function AdminEditCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  let { userInfo } = useSelector((state) => state.user);

  const [pending, setPending] = React.useState(true);
  const [error, setError] = React.useState();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [updateSuccess, setUpdateSuccess] = React.useState(false);

  React.useEffect(() => {
    adminGetCategorybyID(userInfo, params.id)
      .then(function (res) {
        const data = res.data;
        setName(data.name);
        setDescription(data.description);
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

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setPending(true);
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);

    console.log(name, description);
    adminUpdateCategory(userInfo, params.id, formData)
      .then(function (res) {
        setUpdateSuccess(true);
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

  return (
    <div className="auth">
      <DisplayPending pending={pending} />
      <form
        className="adminEditCategory__container"
        onSubmit={updateCategoryHandler}
      >
        {updateSuccess ? (
          <Alert severity="success">Update Succeed</Alert>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : null}
        <div className="auth__title">Edit Category</div>

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
          Update
        </button>
        <button
          className="auth-button"
          type="submit"
          onClick={() => navigate("/admin/categorylist")}
        >
          Go Back
        </button>
      </form>
    </div>
  );
}
