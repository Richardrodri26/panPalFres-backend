import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { footerSection } from './sections/footer.section';
import { User } from 'src/auth/entities/user.entity';

interface ReportOptions {
  title?: string;
  subTitle?: string;
  users: User[];
}

export const getUsersReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { title, subTitle, users } = options;

  return {
    pageOrientation: 'landscape',
    header: headerSection({
      title: title ?? 'Lista de usuarios',
      subTitle: subTitle ?? 'Usuarios del sistema',
    }),
    footer: footerSection,
    pageMargins: [40, 110, 40, 60],
    content: [
      {
        layout: 'lightHorizontalLines', //'lightHorizontalLines', // optional // customLayout01
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['auto', '*', '*', 50],

          body: [
            ['Id', 'Nombre Completo', 'Correo Electronico', '¿Activo?'],
            ...users.map((country) => [
              country.id.toString(),
              country.fullName,
              country.email,
              country.isActive ? 'Activo' : 'Inactivo',
            ]),

          ],
        },
      },

    ],
  };
};