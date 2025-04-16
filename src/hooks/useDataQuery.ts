import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Generic hook for querying data from a local JSON file
export function useLocalQuery<T = any>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey'>
) {
  return useQuery<T, Error, T>({
    queryKey: key,
    queryFn,
    ...options,
  });
}

// Example: Fetch all services from local JSON
export function useServices(options?: UseQueryOptions<any, Error, any>) {
  return useLocalQuery(
    ['services'],
    async () => {
      const res = await fetch('/data/services.json');
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json();
    },
    options
  );
}

// Example: Fetch a single service by id from local JSON
export function useService(id: string, options?: UseQueryOptions<any, Error, any>) {
  return useLocalQuery(
    ['services', id],
    async () => {
      const res = await fetch('/data/services.json');
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      return data.find((item: any) => item.id === id);
    },
    {
      enabled: !!id,
      ...options,
    }
  );
}