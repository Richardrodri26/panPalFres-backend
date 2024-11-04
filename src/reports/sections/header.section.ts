import type { Content } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/helpers';

const logo: Content = {
  image: 'src/assets/Picture1.jpg',
  width: 120,
  height: 100,
  alignment: 'center',
  margin: [0, 0, 0, 20],
};

const currentDate: Content = {
  text: `${DateFormatter.getDDMMMMYYYY(new Date())}`,
  alignment: 'right',
  margin: [20, 30],
  width: 150,
};

interface HeaderOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export const headerSection = (options: HeaderOptions): Content => {
  const { showDate = true, showLogo = true, subTitle, title } = options;

  const headerLogo: Content = showLogo ? logo : null;

  const headerDate: Content = showDate ? currentDate : null;

  const headerSubTitle: Content = {
    text: subTitle,
    margin: [0, 2, 0, 0],
    style: {
      bold: true,
      fontSize: 16,
    },
    alignment: 'center',
  };

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            margin: [0, 15, 0, 0],
            style: {
              bold: true,
              fontSize: 22,
            },
            alignment: 'center',
          },
          subTitle ? headerSubTitle : null,
        ],
      }
    : null;

  return {
    columns: [headerLogo, headerTitle, headerDate],
  };
};
