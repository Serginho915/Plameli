'use client';

import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="home-container fade-in">
      <div className="home-hero">
        <h1 className="home-title">
          {t('welcome')}
        </h1>
        <p className="home-description">
          {t('description')}
        </p>
      </div>

      <div className="home-grid">
        <Link href="/about" className="card glass">
          <h2 className="card-title">
            {t('about')} <span>-&gt;</span>
          </h2>
          <p className="card-text">
            Build the future with our state-of-the-art framework.
          </p>
        </Link>

        <Link href="/contact" className="card glass">
          <h2 className="card-title">
            Contact <span>-&gt;</span>
          </h2>
          <p className="card-text">
            Get in touch with our experts.
          </p>
        </Link>
      </div>
    </main>
  );
}
