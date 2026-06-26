import styles from "./LegalPage.module.scss";

interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalPage({ eyebrow, title, updated, sections }: LegalPageProps) {
  return (
    <section className={styles.legalPage}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>{updated}</p>
        </header>

        <div className={styles.content}>
          {sections.map((section) => (
            <section className={styles.section} key={section.title}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p className={styles.paragraph} key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className={styles.list}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell) => (
                            <td key={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
