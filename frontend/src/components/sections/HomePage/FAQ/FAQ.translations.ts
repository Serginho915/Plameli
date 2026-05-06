import { ComponentTranslations } from "@/hooks/useTranslation.ts";

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface FAQTranslations {
  title: string;
  categories: {
    all: string;
    payment: string;
    education: string;
    accounting: string;
    taxes: string;
  };
  items: FAQItem[];
}

export const translations: ComponentTranslations<FAQTranslations> = {
  ru: {
    title: "Часто задаваемые вопросы",
    categories: {
      all: "Все",
      payment: "Оплата",
      education: "Обучение",
      accounting: "Бухгалтерия",
      taxes: "Налоги",
    },
    items: [
      {
        category: "all",
        question: "Какую одежду мне сегодня надеть?",
        answer: "In the realm of digital dreams, pixels dance and weave stories untold, crafting vibrant tapestries of light and shadow that captivate the wandering eye and spark the imagination's flame."
      },
      {
        category: "all",
        question: "Как поддержать мотивацию в течение дня?",
        answer: "Inner sparks ignite with every small victory, fueling determination as challenges transform into stepping stones toward success."
      },
      {
        category: "all",
        question: "Что помогает снять стресс после работы?",
        answer: "Evening whispers of tranquility unfold as serene moments cradle the mind, releasing tension and inviting peaceful rest."
      },
      {
        category: "all",
        question: "Какие привычки улучшают креативность?",
        answer: "Imagination blooms when curiosity dances freely, painting vivid ideas on the canvas of an inspired mind."
      },
      {
        category: "all",
        question: "Как лучше организовать рабочее пространство?",
        answer: "Order and simplicity harmonize, crafting a sanctuary where thoughts flow effortlessly and productivity thrives."
      },
      {
        category: "all",
        question: "Стоит ли сегодня взять зонт?",
        answer: "Beneath the silver clouds, whispers of rain prepare to kiss the earth, painting droplets of life upon the canvas of a bustling city that never sleeps."
      }
    ]
  },
  bg: {
    title: "Често задавани въпроси",
    categories: {
      all: "Всички",
      payment: "Плащане",
      education: "Обучение",
      accounting: "Счетоводство",
      taxes: "Данъци",
    },
    items: [
      {
        category: "all",
        question: "Какви дрехи да облека днес?",
        answer: "In the realm of digital dreams, pixels dance and weave stories untold, crafting vibrant tapestries of light and shadow that captivate the wandering eye and spark the imagination's flame."
      },
      {
        category: "all",
        question: "Как да поддържам мотивацията си през деня?",
        answer: "Inner sparks ignite with every small victory, fueling determination as challenges transform into stepping stones toward success."
      },
      {
        category: "all",
        question: "Какво помага за облекчаване на стреса след работа?",
        answer: "Evening whispers of tranquility unfold as serene moments cradle the mind, releasing tension and inviting peaceful rest."
      },
      {
        category: "all",
        question: "Какви навици подобряват креативността?",
        answer: "Imagination blooms when curiosity dances freely, painting vivid ideas on the canvas of an inspired mind."
      },
      {
        category: "all",
        question: "Как най-добре да организирам работното си пространство?",
        answer: "Order and simplicity harmonize, crafting a sanctuary where thoughts flow effortlessly and productivity thrives."
      },
      {
        category: "all",
        question: "Трябва ли да взема чадър днес?",
        answer: "Beneath the silver clouds, whispers of rain prepare to kiss the earth, painting droplets of life upon the canvas of a bustling city that never sleeps."
      }
    ]
  }
};

export default translations;