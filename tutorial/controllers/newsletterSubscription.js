import mongoose from "mongoose";
import Product from "../models/productModel.js"; // Import your Product model
import User from "../models/userModel.js"; // Import your User model
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// **2. User Retrieval**
const fetchUsers = async () => {
  try {
    return await User.find({ newsletterSubscribed: true });
  } catch (err) {
    console.error("Error fetching subscribed users:", err);
  }
};

// **3. Product Information**
const fetchProducts = async () => {
  try {
    return await Product.find({});
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

// **4. Email Templating** (Example)
const generateEmailContent = (user, products) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Exciting News Products</title>
        </head>
        <body>
            <h2>Hello ${user.name},</h2>
            <p>Check out these great products:</p>
            <ul>
                ${products
                  .map(
                    (product) => `
                    <li>
                        <strong>${product.name}</strong> - ${product.description}
                        <br>
                        Price: ${product.price}
                        <br>
                        <img src="${product.image}" alt="${product.name}" width="150">
                    </li>
                `
                  )
                  .join("")}
            </ul>
        </body>
        </html>
    `;
};

// 5. Email Transport with Gmail
const sendNewsletters = async () => {
  const users = await fetchUsers();
  const products = await fetchProducts();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME, // Your Gmail address
      pass: process.env.GMAIL_PASSWORD, // Your Gmail password
    },
  });

  users.forEach((user) => {
    const mailOptions = {
      from: process.env.GMAIL_USERNAME, // Your Gmail address
      to: user.email,
      subject: "Discover the Latest Products!",
      html: generateEmailContent(user, products),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
};

export default sendNewsletters;
