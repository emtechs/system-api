import prisma from '../../prisma';
import { SchoolReturnSchema, ServerArraySchema } from '../../schemas';

export const retrieveSchoolService = async (id: string) => {
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const [school, servers, total, years] = await Promise.all([
    prisma.school.findUnique({
      where: { id },
      select,
    }),
    prisma.schoolServer.findMany({
      where: { school_id: id },
      select: {
        role: true,
        dash: true,
        server: { select: { id: true, name: true, cpf: true } },
      },
      orderBy: { server: { name: 'asc' } },
    }),
    prisma.schoolServer.count({ where: { school_id: id } }),
    prisma.year.findMany({ where: { classes: { some: { school_id: id } } } }),
  ]);

  return {
    school: SchoolReturnSchema.parse(school),
    servers: { total, result: ServerArraySchema.parse(servers) },
    years,
  };
};
