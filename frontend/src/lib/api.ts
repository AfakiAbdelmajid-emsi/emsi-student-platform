// frontend/src/lib/api.ts

export async function fetchFromBackend(endpoint: string) {
    const response = await fetch(`http://localhost:8000/${endpoint}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
  
    return await response.json();
  }