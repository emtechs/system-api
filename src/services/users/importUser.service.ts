import { importUser, loadUser } from '../../scripts';

export const importUserService = async (file: Express.Multer.File) => {
  const users = await loadUser(file);

  return await importUser(users);
};
