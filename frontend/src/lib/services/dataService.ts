import { apiClient } from '../apiClient';

export interface PageData {
  slug: string;
  title: Record<string, string>;
  content: Record<string, string>;
}

const mockPages: PageData[] = [
  {
    slug: 'about',
    title: {
      en: 'About Us',
      ru: 'О нас',
      bg: 'За нас',
    },
    content: {
      en: 'We are a team of dedicated developers.',
      ru: 'Мы — команда преданных своему делу разработчиков.',
      bg: 'Ние сме екип от всеотдайни разработчици.',
    },
  },
  {
    slug: 'contact',
    title: {
      en: 'Contact Us',
      ru: 'Контакты',
      bg: 'Контакти',
    },
    content: {
      en: 'Get in touch with us at hello@plameli.com',
      ru: 'Свяжитесь с нами по адресу hello@plameli.com',
      bg: 'Свържете се с нас на hello@plameli.com',
    },
  },
];

export const dataService = {
  async getPageBySlug(slug: string): Promise<PageData | null> {
    console.log(`[Data Service] Fetching page for slug: ${slug}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const page = mockPages.find((p) => p.slug === slug);
    return page || null;
  },

  async getAllPages(): Promise<PageData[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPages;
  },
};
