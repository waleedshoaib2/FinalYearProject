import React from "react";
import { startStripeCheckOut } from "../../redux/action/apiOrder.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Checkout({ cartItems }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { userInfo } = useSelector((state) => state.user);

  function checkoutHandler(e) {
    e.preventDefault();
    if (!userInfo) {
      navigate("/login?redirect=cart");
    } else if (cartItems.length > 0) {
      dispatch(startStripeCheckOut({ orderItems: cartItems }, userInfo));
    }
  }

  return (
    <div className="cart_checkout">
      <h1 className="cart_checkout__subtotal">
        Subtotal: $
        {cartItems
          .reduce((init, a) => {
            return init + (a.price * a.qty) / 100;
          }, 0)
          .toFixed(2)}
      </h1>
      <h1 className="cart_checkout__itemsCount">
        Total Items: {cartItems.length}
      </h1>
      <div
        className="black-rounded-button margin-block-start-16"
        onClick={checkoutHandler}
      >
        Checkout
      </div>
    </div>
  );
}
