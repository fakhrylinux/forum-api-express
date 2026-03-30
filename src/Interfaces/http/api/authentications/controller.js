import LoginUserUseCase from "../../../../Applications/use_case/LoginUserUseCase.js";
import RefreshAuthenticationUseCase from "../../../../Applications/use_case/RefreshAuthenticationUseCase.js";
import LogoutUserUseCase from "../../../../Applications/use_case/LogoutUserUseCase.js";

class AuthenticationsController {
  constructor(container) {
    this._container = container;

    this.postAuthenticationController =
      this.postAuthenticationController.bind(this);
    this.putAuthenticationController =
      this.putAuthenticationController.bind(this);
    this.deleteAuthenticationController =
      this.deleteAuthenticationController.bind(this);
  }

  async postAuthenticationController(req, res, next) {
    try {
      const loginUserUseCase = this._container.getInstance(
        LoginUserUseCase.name,
      );
      const { accessToken, refreshToken } = await loginUserUseCase.execute(
        req.body,
      );

      res.status(201).json({
        status: "success",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationController(req, res, next) {
    try {
      const refreshAuthenticationUseCase = this._container.getInstance(
        RefreshAuthenticationUseCase.name,
      );
      const accessToken = await refreshAuthenticationUseCase.execute(req.body);

      res.json({
        status: "success",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationController(req, res, next) {
    try {
      const logoutUserUseCase = this._container.getInstance(
        LogoutUserUseCase.name,
      );
      await logoutUserUseCase.execute(req.body);

      res.json({
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthenticationsController;
