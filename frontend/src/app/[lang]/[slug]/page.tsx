export default async function Page({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug } = await params;
  return (
    <div className="container">
      <h1>Page: {slug}</h1>
    </div>
  );
}
