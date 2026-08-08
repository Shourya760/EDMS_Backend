import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 */
export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};



// Random Token 
export const generatePasswordToken = () => {
  const bytes = new Uint8Array(32); // 32 bytes = 256 bits
  crypto.getRandomValues(bytes);

  return Array.from(bytes, byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
