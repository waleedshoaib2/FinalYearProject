import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/action/apiCart.js";

export default function AddCart({ productInfo }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(productInfo);
  function addToCartHandler(e) {
    console.log(e);
    e.preventDefault();
    window.scrollTo(0, 0);
    dispatch(addToCart(productInfo, 1)); // Always add one unit to the cart
    navigate("/cart");
  }

  return (
    <div className="productDetailPage__pricesContainer">
      <div className="productDetailPage__price">
        $ {productInfo.price / 100}
      </div>
      <div className="productDetailPage__addCart">
        <h1 className="black-rounded-button" onClick={addToCartHandler}>
          Add To Cart
        </h1>
      </div>
    </div>
  );
}
