import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { AppError } from '../../errors';
import prisma from '../../prisma';
import { ISessionRequest } from '../../interfaces';

export const createSessionService = async ({
  login,
  password,
}: ISessionRequest): Promise<{
  token: string;
}> => {
  const user = await prisma.user.findUnique({
    where: { login },
  });

  if (!user) {
    throw new AppError('Login or password invalid', 403);
  }

  const passwordMatch = compareSync(password, user.password);
  if (!passwordMatch) {
    throw new AppError('Login or password invalid', 403);
  }

  const token = jwt.sign({ role: user.role }, process.env.SECRET_KEY!, {
    subject: user.id,
    expiresIn: '7d',
  });

  return { token: token };
};
