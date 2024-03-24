import React, { useState } from "react";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/newsletter/"
      );
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Send the Newsletter </button>
    </div>
  );
};

export default Newsletter;
