import prisma from '../../prisma';
import { randomBytes } from 'crypto';
import { AppError } from '../../errors';
import { mailGenerator, sendEmail } from '../../utils';
import { IRecoveryPasswordRequest } from '../../interfaces';

export const sendEmailRecoveryService = async ({
  login,
}: IRecoveryPasswordRequest) => {
  try {
    const user = await prisma.user.findUnique({
      where: { login },
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let token = await prisma.token.findUnique({ where: { user_id: user.id } });
    if (!token) {
      token = await prisma.token.create({
        data: {
          user_id: user.id,
          token: randomBytes(32).toString('hex'),
        },
      });
    }

    const link = `${process.env.BASE_URL}/password/${user.id}/${token.token}`;

    if (user.name && user.email) {
      const arrayUserName = user.name.split(' ');
      const emailName =
        arrayUserName.length > 1
          ? arrayUserName[0] + ' ' + arrayUserName[1]
          : arrayUserName[0];

      const emailContent = {
        body: {
          greeting: 'Prezado',
          signature: 'Atenciosamente',
          name: emailName,
          intro:
            'Você recebeu este e-mail porque uma solicitação de redefinição de senha para sua conta foi recebida.',

          action: {
            instructions: 'Clique no botão abaixo para redefinir sua senha:',
            button: {
              color: '#006CBE',
              text: 'Redefina sua senha',
              link: link,
            },
          },

          outro:
            'Se você não solicitou uma redefinição de senha, nenhuma outra ação será necessária de sua parte.',
        },
      };

      const emailBody = mailGenerator.generate(emailContent);

      await sendEmail(user.email, 'Password reset', emailBody);

      return 'password reset link sent to your email account';
    }
  } catch (error) {
    throw new AppError(
      'Unfortunately, the email could not be sent, we apologize for the inconvenience and ask that you try again later.',
      404,
    );
  }
};
