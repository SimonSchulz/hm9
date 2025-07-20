import { usersRepository } from "../../../user/repositories/user.repository";
import { addMinutes } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { nodemailerService } from "../../domain/nodemailer.service";
import { emailExamples } from "../../utils/email-messages";
import crypto from "crypto";

export async function resendConfirmationEmail(
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const email = req.body.email;
    const user = await usersRepository.findByLoginOrEmail(email);

    if (!user) {
      res.sendStatus(HttpStatus.NoContent);
      return;
    }

    if (user.emailConfirmation.isConfirmed) {
      res.status(HttpStatus.BadRequest).send({
        errorsMessages: [
          { field: "email", message: "Email is already confirmed" },
        ],
      });
      return;
    }

    const newCode = crypto.randomUUID();
    const newExpiration = addMinutes(new Date(), 10).toISOString();

    await usersRepository.updateConfirmation(
      user._id.toString(),
      newCode,
      newExpiration,
    );

    nodemailerService.sendEmail(
      user.email,
      newCode,
      emailExamples.registrationEmail,
    );

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    next(error);
  }
}
