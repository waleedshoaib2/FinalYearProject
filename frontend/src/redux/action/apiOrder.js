import {
  orderReset,
  getOrderDetailRequest,
  getOrderDetailSuccess,
  getOrderDetailFailed,
} from "../slices/orderSlice";
import { logout } from "./apiUserAction";
import { baseURL } from "../../lib/axiosAPI";
import axios from "axios";

export const startStripeCheckOut = (order, userInfo) => {
  return async (dispatch) => {
    try {
      const userToken = userInfo.token;
      console.log(userInfo);

      order["customerID"] = userInfo.id;

      console.log(order);

      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      };

      const response = await fetch(
        "http://localhost:4000/stripe/create-checkout-session",
        config
      );
      const data = await response.json();

      // Handle potential errors
      if (!response.ok) {
        // Handle 401 (Unauthorized) error
        if (response.status === 401) {
          dispatch(logout());
        } else {
          console.log("Error during checkout:", data.message || data);
        }
        return; // Stop execution
      }

      window.location = data.url;
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
};

export const getOrderDetail = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch(orderReset());
      dispatch(getOrderDetailRequest());
      let { user } = getState();
      user = user.userInfo;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Bearer: `${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/orders/${id}`,
        config
      );
      dispatch(getOrderDetailSuccess(data));
    } catch (error) {
      dispatch(
        getOrderDetailFailed(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        )
      );
    }
  };
};
