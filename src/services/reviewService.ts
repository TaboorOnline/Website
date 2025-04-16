import { useQuery } from '@tanstack/react-query';
import { Review } from '../types/types';
import reviewsData from '../data/reviews.json';

const processReviews = (): Review[] => {
  const allReviews = (reviewsData.reviews as Review[]) || [];

  return allReviews.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    if (isNaN(dateB)) return -1; 
    if (isNaN(dateA)) return 1;  

    return dateB - dateA;
  });
};

export const useReviews = () => {
  return useQuery({
    queryKey: ['approvedReviews'],
    queryFn: processReviews,     
  });
};