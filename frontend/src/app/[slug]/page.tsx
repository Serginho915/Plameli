export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="container">
      <h1>Page: {params.slug}</h1>
    </div>
  );
}
