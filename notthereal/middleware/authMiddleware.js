import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const protect = async (req, res, next) => {
  let token;
 
 
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) { 
      // Extract the token after the 'Bearer ' prefix

      token = req.headers.authorization.split(' ')[1]; 
    }

    if (!token) {
      throw new Error("Not Authorized, no Token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decoded.id).select("-password");
console.log(req.user)
    next(); 
  } catch (error) {
    console.log("Error:", error); // More informative error logging
    res.status(401).json({ message: "Not authorized, token failed" }); 
  }
};

const admin = (req, res, next) => {
  console.log("in admin middleware")
  try {
    if (req.user && req.user.isAdmin) {
      console.log("in admin middleware true bhai")
      next();
    } else {
      console.log(req.user)
      throw new Error("Not authorized as an Admin");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const declineDemo = (req, res, next) => {
  try {
    // disable demo user & ad
    if (
      req.user &&
      (req.user._id.equals(process.env.Demo_User_ID) ||
        req.user._id.equals(process.env.Demo_Admin_ID))
    ) {
      throw new Error(
        "Demo User don't have permission for current operation. Try create an account"
      );
    }
    next();
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export { protect, admin, declineDemo };
