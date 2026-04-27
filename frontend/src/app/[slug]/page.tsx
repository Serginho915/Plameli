'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { dataService, PageData } from '@/lib/services/dataService';
import { useTranslation } from '@/hooks/useTranslation';

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, language } = useTranslation();
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await dataService.getPageBySlug(slug);
        setPageData(data);
      } catch (error) {
        console.error('Failed to fetch page data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="error-container">
        <h1>{t('no_content')}</h1>
        <p>Slug: {slug}</p>
        <Link href="/" className="back-link">{t('home')}</Link>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="breadcrumb">
        <Link href="/" className="back-link">
          &larr; {t('home')}
        </Link>
      </div>
      
      <article className="content-box glass">
        <h1 className="page-title">
          {pageData.title[language] || pageData.title['en']}
        </h1>
        <div className="page-content">
          <p>{pageData.content[language] || pageData.content['en']}</p>
        </div>
      </article>
      
      <footer className="page-info glass">
        <p>
          {t('slug_content')} <strong>{slug}</strong>
          <span className="id-badge">ID: {pageData.slug}</span>
        </p>
      </footer>
    </div>
  );
}
