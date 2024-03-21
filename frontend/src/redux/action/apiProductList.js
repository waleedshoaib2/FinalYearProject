import {
  updateProductStart,
  updateProductSuccess,
  updateProductFailed,
  productListReset,
} from "../slices/productListSlice";
import axios from "axios";

export const getProductList = async (dispatch, search = "") => {
  if (search === null) {
    search = "";
  }

  dispatch(productListReset());
  dispatch(updateProductStart());

  try {
    const result = await axios.get(
      `http://localhost:4000/product/CustomerGetProduct/?search=${search}`
    );

    dispatch(updateProductSuccess(result.data));
    console.log(result.data);
  } catch (error) {
    dispatch(
      updateProductFailed(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
