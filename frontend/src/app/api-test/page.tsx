// frontend/src/app/page.tsx
import { fetchFromBackend } from '@/lib/api';

export default async function Home() {
  // Fetch data using our new function
  const apiData = await fetchFromBackend('api/test');

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">API Response:</h1>
      <pre className="mt-4 p-4 bg-red-50 rounded text-red-800">
        {JSON.stringify(apiData, null, 2)}
      </pre>
    </main>
  );
}