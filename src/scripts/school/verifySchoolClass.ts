export const verifySchoolClass = (
  schools: {
    classes: {
      year_id: string;
    }[];
    id: string;
    name: string;
    is_active: boolean;
    director: {
      id: string;
      cpf: string;
      name: string;
    };
  }[],
  year_id_data = '',
) => {
  const verify = schools.map((el) => {
    let is_class = false;

    const classesData = el.classes.filter(
      ({ year_id }) => year_id === year_id_data,
    );
    is_class = classesData.length > 0;

    return { ...el, is_class };
  });
  return verify;
};
