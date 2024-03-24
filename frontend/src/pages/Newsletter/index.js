import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

const Newsletter = () => {
  let { userInfo } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");

  const sendTokenToBackend = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/newsletter",
        {
          token: userInfo.token,
          email: email,
        },
        {
          // Config object for headers
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Correct header format
          },
        }
      );
      console.log("Token and email sent successfully:", response);
    } catch (error) {
      console.error("Error sending token and email:", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "16px 4px",
        color: "white",
        backgroundColor: "#000300",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <div style={{ gridColumnSpan: 2, marginBottom: "4px" }}>
          <h1
            style={{
              fontSize: "2xl",
              fontWeight: "bold",
              paddingBottom: "2px",
            }}
          >
            Want tips & tricks to optimize your flow?
          </h1>
          <p>Sign up to our newsletter and stay up to date.</p>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              sm: { flexDirection: "row" },
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <input
              style={{
                padding: "3px",
                flex: 1,
                borderRadius: "4px",
                color: "black",
              }}
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              style={{
                backgroundColor: "#00df9a",
                color: "black",
                borderRadius: "4px",
                fontWeight: "medium",
                width: "200px",
                marginLeft: "4px",
                marginTop: "6px",
                padding: "6px 3px",
              }}
              onClick={sendTokenToBackend}
            >
              Notify Me
            </button>
          </div>
          <p>
            We care bout the protection of your data. Read our{" "}
            <span style={{ color: "#00df9a" }}>Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
