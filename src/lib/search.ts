import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface SearchResult {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export async function searchProducts(searchTerm: string): Promise<SearchResult[]> {
  if (!searchTerm.trim()) return [];
  
  const itemsRef = collection(db, 'items');
  const q = query(
    itemsRef,
    where('name', '>=', searchTerm),
    where('name', '<=', searchTerm + '\uf8ff'),
    limit(5)
  );

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        price: typeof data.price === 'number' ? data.price : Number(data.price) || 0
      } as SearchResult;
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
