import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { characterApi } from '@/api/characters';
import type { Character, CharacterCreate, CharacterUpdate, ForkChain, ForkRequest } from '@/types/character';

export const CHARACTER_KEYS = {
  all: ['characters'] as const,
  lists: () => [...CHARACTER_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...CHARACTER_KEYS.lists(), filters] as const,
  details: () => [...CHARACTER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CHARACTER_KEYS.details(), id] as const,
  public: (skip: number, limit: number) => [...CHARACTER_KEYS.all, 'public', { skip, limit }] as const,
  user: (authorId: string) => [...CHARACTER_KEYS.all, 'user', authorId] as const,
};

export const usePublicCharacters = (skip = 0, limit = 20) => {
  return useQuery({
    queryKey: CHARACTER_KEYS.public(skip, limit),
    queryFn: () => characterApi.listPublic(skip, limit),
  });
};

export const useUserCharacters = (authorId: string) => {
  return useQuery({
    queryKey: CHARACTER_KEYS.user(authorId),
    queryFn: () => characterApi.listUser(authorId),
    enabled: !!authorId,
  });
};

export const useCharacter = (id: string) => {
  return useQuery({
    queryKey: CHARACTER_KEYS.detail(id),
    queryFn: () => characterApi.get(id),
    enabled: !!id,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CharacterCreate) => characterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.all });
    },
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CharacterUpdate }) =>
      characterApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.lists() });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => characterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.all });
    },
  });
};


export const useForkCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation<Character, Error, { id: string; forkRequest?: ForkRequest }>({
    mutationFn: ({ id, forkRequest }: { id: string; forkRequest?: import('@/types/character').ForkRequest }) =>
      characterApi.fork(id, forkRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHARACTER_KEYS.all });
    },
  });
};

export const useForkChain = (id: string) => {
  return useQuery<ForkChain>({
    queryKey: [...CHARACTER_KEYS.detail(id), 'fork-chain'],
    queryFn: () => characterApi.getForkChain(id),
    enabled: !!id,
  });
};