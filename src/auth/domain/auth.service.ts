import { bcryptService } from "./bcrypt.service";
import { usersRepository } from "../../user/repositories/user.repository";
import { ValidationError } from "../../core/utils/app-response-errors";
import { jwtService } from "./jwt.service";
import { User } from "../../user/domain/user.entity";
import { nodemailerService } from "./nodemailer.service";
import { emailExamples } from "../utils/email-messages";

export const authService = {
  async loginUser(loginOrEmail: string, password: string) {
    const user = await this.checkUserCredentials(loginOrEmail, password);
    if (!user) return null;
    const accessToken = await jwtService.createAccessToken(user._id.toString());
    const refreshToken = await jwtService.createRefreshToken(
      user._id.toString(),
    );
    return { accessToken, refreshToken };
  },

  async checkUserCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const isPassValid = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassValid) return null;
    return user;
  },

  async registerUser(
    login: string,
    pass: string,
    email: string,
  ): Promise<string> {
    const isUser = await usersRepository.checkExistByLoginOrEmail(login, email);
    if (isUser)
      throw new ValidationError("User with this login or email exists");
    const passwordHash = await bcryptService.generateHash(pass);
    const newUser = new User(login, email, passwordHash);
    const id = await usersRepository.create(newUser);

    nodemailerService
      .sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      )
      .catch((er) => console.error("error in send email:", er));
    return id;
  },
};
