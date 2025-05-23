import { notFound } from 'next/navigation';
import { App } from '@/components/App/App';

export default function ModulePage({ params }: { params: { id: string } }) {
  if (!params.id) return notFound();

  return (
    <App>
      <h1>Product ID: {params.id}</h1>;
    </App>
  );
}
