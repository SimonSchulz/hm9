import { Router } from "express";
import { passwordValidation } from "../../user/validation/password.validation";
import { loginOrEmailValidation } from "../../user/validation/login.or.emaol.validation";
import { inputValidationResultMiddleware } from "../../core/utils/input-validtion-result.middleware";
import { authLoginHandler } from "./handlers/login.handler";
import { accessTokenGuard } from "./guards/access.token.guard";
import { getUserDataHandler } from "./handlers/get-user-data.handler";
import { loginValidation } from "../../user/validation/login.validation";
import { emailValidation } from "../../user/validation/email.validation";
import { registrationHandler } from "./handlers/registration.handler";
import { resendConfirmationEmail } from "./handlers/email-resending.handler";
import { confirmRegistration } from "./handlers/registration-confirmation.handler";
import { codeValidation } from "../../user/validation/confirm-code.validation";
import { emailResendValidation } from "../../user/validation/email.resend.validation";
import { refreshTokenHandler } from "./handlers/refresh.handler";
import { logoutHandler } from "./handlers/logout.handler";
import { requestLogMiddleware } from "../middlewares/request-log.middleware";
import { refreshTokenGuard } from "./guards/refresh.token.guard";

export const authRouter = Router();

authRouter.post(
  "/login",
  requestLogMiddleware,
  passwordValidation,
  loginOrEmailValidation,
  inputValidationResultMiddleware,
  authLoginHandler,
);
authRouter.post(
  "/registration-confirmation",
  requestLogMiddleware,
  codeValidation,
  inputValidationResultMiddleware,
  confirmRegistration,
);
authRouter.post(
  "/registration",
  requestLogMiddleware,
  passwordValidation,
  loginValidation,
  emailValidation,
  inputValidationResultMiddleware,
  registrationHandler,
);
authRouter.post(
  "/registration-email-resending",
  requestLogMiddleware,
  emailResendValidation,
  inputValidationResultMiddleware,
  resendConfirmationEmail,
);
authRouter.get("/me", accessTokenGuard, getUserDataHandler);
authRouter.post("/refresh-token", refreshTokenGuard, refreshTokenHandler);
authRouter.post("/logout", refreshTokenGuard, logoutHandler);
