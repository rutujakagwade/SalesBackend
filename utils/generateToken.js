import jwt from "jsonwebtoken";
import { webcrypto } from "crypto";

// Sign JWT consistently
export const signJWT = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// Generate random invite token
export const randomInvite = () =>
  [...webcrypto.getRandomValues(new Uint32Array(4))]
    .map((n) => n.toString(16))
    .join("");
