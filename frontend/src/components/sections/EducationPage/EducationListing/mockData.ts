export interface CourseItem {
  id: string;
  title: string;
  type: "image";
  mediaSrc: string;
  startDate: string;
  format: string; // "Online" | "Live" | "Offline"
  price: string;
  level: string;  // "beginner" | "experienced" | "business"
  goal: string;   // "launch" | "taxes" | "profession" | "optimization"
}

export interface WebinarItem {
  id: string;
  title: string;
  type: "video";
  mediaSrc: string;
  poster: string;
  startDate: string;
  format: string; // "Online" | "Live" | "Offline"
  price: string;
  level: string;  // "beginner" | "experienced" | "business"
  goal: string;   // "launch" | "taxes" | "profession" | "optimization"
}

export type EducationItem = CourseItem | WebinarItem;

export const getMockCourses = (lang: string): CourseItem[] => {
  const isRu = lang === "ru";
  return [
    {
      id: "c1",
      title: isRu
        ? "Основы финансового учета и отчетности"
        : "Основи на финансовото счетоводство и отчетност",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "12 Апр 2026",
      format: "Online",
      price: "€150",
      level: "beginner",
      goal: "profession",
    },
    {
      id: "c2",
      title: isRu
        ? "Международные стандарты финансовой отчетности (МСФО)"
        : "Международни стандарти за финансова отчетност (МСФО)",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "18 Апр 2026",
      format: "Live",
      price: "€320",
      level: "business",
      goal: "taxes",
    },
    {
      id: "c3",
      title: isRu
        ? "Налогообложение и налоговая оптимизация бизнеса"
        : "Данъчно облагане и данъчна оптимизация за бизнеса",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "25 Апр 2026",
      format: "Offline",
      price: "€250",
      level: "experienced",
      goal: "taxes",
    },
    {
      id: "c4",
      title: isRu
        ? "Финансовый анализ и планирование для руководителей"
        : "Финансов анализ и планиране за мениджъри",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "02 Май 2026",
      format: "Online",
      price: "€180",
      level: "business",
      goal: "optimization",
    },
    {
      id: "c5",
      title: isRu
        ? "Бухгалтерия для начинающих предпринимателей"
        : "Счетоводство за начинаещи предприемачи",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "10 Май 2026",
      format: "Live",
      price: "€90",
      level: "beginner",
      goal: "launch",
    },
    {
      id: "c6",
      title: isRu
        ? "Консолидированная финансовая отчетность холдингов"
        : "Консолидирана финансова отчетност на холдинги",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "15 Май 2026",
      format: "Offline",
      price: "€450",
      level: "business",
      goal: "taxes",
    },
    {
      id: "c7",
      title: isRu
        ? "Управление корпоративными финансовыми рисками"
        : "Управление на корпоративните финансови рискове",
      type: "image",
      mediaSrc: "/images/Education/course.png",
      startDate: "20 Май 2026",
      format: "Live",
      price: "€280",
      level: "experienced",
      goal: "optimization",
    },
  ];
};

export const getMockWebinars = (lang: string): WebinarItem[] => {
  const isRu = lang === "ru";
  return [
    {
      id: "w1",
      title: isRu
        ? "Нововведения в налоговых декларациях 2026 года"
        : "Нововъведения в данъчните декларации за 2026 година",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "12 Апр 2026",
      format: "Live",
      price: "€15",
      level: "experienced",
      goal: "taxes",
    },
    {
      id: "w2",
      title: isRu
        ? "Автоматизация финансовой отчетности с помощью Excel"
        : "Автоматизация на финансовата отчетност с помощта на Excel",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "15 Апр 2026",
      format: "Online",
      price: isRu ? "Бесплатно" : "Безплатно",
      level: "beginner",
      goal: "taxes",
    },
    {
      id: "w3",
      title: isRu
        ? "Аудит и внутренний финансовый контроль"
        : "Одит и вътрешен финансов контрол",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "22 Апр 2026",
      format: "Live",
      price: "€40",
      level: "business",
      goal: "profession",
    },
    {
      id: "w4",
      title: isRu
        ? "Как правильно читать балансовый отчет компании"
        : "Как правилно да четем баланса на фирмата",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "28 Апр 2026",
      format: "Online",
      price: "€10",
      level: "beginner",
      goal: "optimization",
    },
    {
      id: "w5",
      title: isRu
        ? "Законные методы оптимизации НДС в бизнесе"
        : "Законни методи за оптимизация на ДДС в бизнеса",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "05 Май 2026",
      format: "Live",
      price: "€25",
      level: "experienced",
      goal: "taxes",
    },
    {
      id: "w6",
      title: isRu
        ? "Управленческий учет для малого бизнеса с нуля"
        : "Управленско счетоводство за малък бизнес от нулата",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "12 Май 2026",
      format: "Live",
      price: "€20",
      level: "beginner",
      goal: "profession",
    },
    {
      id: "w7",
      title: isRu
        ? "Сложные вопросы учета основных средств"
        : "Сложни въпроси при отчитане на дълготрайни активи",
      type: "video",
      mediaSrc: "https://vjs.zencdn.net/v/oceans.mp4",
      poster: "/images/Education/webinar.png",
      startDate: "19 Май 2026",
      format: "Online",
      price: "€35",
      level: "business",
      goal: "optimization",
    },
  ];
};
