import { apiClient } from './client';
import type { Character, CharacterCreate, CharacterUpdate, ForkChain, ForkRequest, PreviewResponse } from '@/types/character';

export const characterApi = {
  // 创建角色
  create: (data: CharacterCreate) =>
    apiClient.post<Character>('/characters/', data),

  // 获取公开角色列表
  listPublic: (skip = 0, limit = 20) =>
    apiClient.get<Character[]>('/characters/public', { skip, limit }),

  // 获取用户角色列表
  listUser: (authorId: string) =>
    apiClient.get<Character[]>(`/characters/user/${authorId}`),

  // 获取单个角色
  get: (id: string) =>
    apiClient.get<Character>(`/characters/${id}`),

  // 更新角色
  update: (id: string, data: CharacterUpdate) =>
    apiClient.put<Character>(`/characters/${id}`, data),

  // 删除角色
  delete: (id: string) =>
    apiClient.delete(`/characters/${id}`),

  fork: async (id: string, forkRequest?: ForkRequest): Promise<Character> => {
    const response = await apiClient.post<Character>(`/characters/${id}/fork`, forkRequest || {});
    return response
  },

  // 获取 Fork 链
  getForkChain: async (id: string): Promise<ForkChain> => {
    const response = await apiClient.get<ForkChain>(`/characters/${id}/fork-chain`);
    return response
  },

  // 预览角色对话
  preview: (id: string, message: string) =>
    apiClient.post<PreviewResponse>(`/characters/${id}/preview`, {
      character_id: id,
      message,
    }),
};