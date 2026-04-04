import TokenManager from "jsonwebtoken";
import config from "../../Commons/config.js";
import AuthenticationError from "../../Commons/exceptions/AuthenticationError.js";

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token && token.indexOf("Bearer ") !== -1) {
    try {
      req.user = await TokenManager.verify(
        token.split("Bearer ")[1],
        config.auth.accessTokenKey,
      );
      return next();
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }

  throw new AuthenticationError("Missing authentication");
}

export default authenticateToken;
