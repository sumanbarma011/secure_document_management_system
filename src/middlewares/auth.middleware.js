import Jwt from "jsonwebtoken";
const authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({
        message: "TOKEN NOT FOUND!! ",
        success: false,
      });
    }
    const token = authHeader.split(" ")[1];
    const decodeToken = Jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized Access", success: false });
  }
};
export default authorization;
