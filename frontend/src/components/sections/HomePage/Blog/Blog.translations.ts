import { ComponentTranslations } from "@/hooks/useTranslation";

export interface BlogItem {
  author: string;
  title: string;
  href: string;
}

export interface BlogTranslations {
  title: string;
  readMore: string;
  authorPrefix: string;
  items: BlogItem[];
}

export const translations: ComponentTranslations<BlogTranslations> = {
  ru: {
    title: "полезные материалы",
    readMore: "Читать",
    authorPrefix: "Автор:",
    items: [
      {
        author: "Олена Шопова",
        title: "Как начать каръеру бухгалтера в Болгарии с нуля?",
        href: "/blog/how-to-start"
      },
      {
        author: "Олена Шопова",
        title: "Налогообложение для фрилансеров в 2024 году",
        href: "/blog/taxes-2024"
      },
      {
        author: "Олена Шопова",
        title: "Особенности регистрации фирмы в Болгарии",
        href: "/blog/company-registration"
      },
      {
        author: "Олена Шопова",
        title: "Как открыть банковский счет иностранцу",
        href: "/blog/bank-account"
      },
      {
        author: "Олена Шопова",
        title: "Подача годовой налоговой декларации",
        href: "/blog/tax-declaration"
      },
      {
        author: "Олена Шопова",
        title: "Преимущества работы через ЕООД",
        href: "/blog/eood-benefits"
      }
    ]
  },
  bg: {
    title: "полезни материали",
    readMore: "Прочети",
    authorPrefix: "Автор:",
    items: [
      {
        author: "Олена Шопова",
        title: "Как да започнете кариера като счетоводител в България от нулата?",
        href: "/blog/how-to-start"
      },
      {
        author: "Олена Шопова",
        title: "Данъчно облагане за фрийлансъри през 2024 г.",
        href: "/blog/taxes-2024"
      },
      {
        author: "Олена Шопова",
        title: "Особености при регистрация на фирма в България",
        href: "/blog/company-registration"
      },
      {
        author: "Олена Шопова",
        title: "Как да отворите банкова сметка за чужденец",
        href: "/blog/bank-account"
      },
      {
        author: "Олена Шопова",
        title: "Подаване на годишна данъчна декларация",
        href: "/blog/tax-declaration"
      },
      {
        author: "Олена Шопова",
        title: "Предимства на работата чрез ЕООД",
        href: "/blog/eood-benefits"
      }
    ]
  },
};
