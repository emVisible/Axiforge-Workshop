import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import WelcomePage from "@/pages/WelcomePage"; // 新增
import HallPage from "@/pages/HallPage"; // 新增
import CreateCharacterPage from "@/pages/CreateCharacterPage";
import CharacterDetailPage from "@/pages/CharacterDetailPage";
import EditCharacterPage from "@/pages/EditCharacterPage";
import MyCharactersPage from "@/pages/MyCharactersPage";
import NotFoundPage from "@/pages/NotFoundPage";
import StoryReadPage from "@/pages/StoryReadPage";
import StoryEditPage from "@/pages/StoryEditPage";

// 在 Routes 里加

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 介绍页 */}
            <Route index element={<WelcomePage />} />

            {/* 角色大厅 */}
            <Route path="hall" element={<HallPage />} />

            {/* 创建角色 */}
            <Route path="create" element={<CreateCharacterPage />} />

            {/* 我的角色 */}
            <Route path="my-characters" element={<MyCharactersPage />} />

            {/* 角色详情 */}
            <Route path="characters/:id" element={<CharacterDetailPage />} />

            {/* 编辑角色 */}
            <Route path="characters/:id/edit" element={<EditCharacterPage />} />
            <Route
              path="characters/:id/stories/:storyId"
              element={<StoryReadPage />}
            />
            <Route
              path="characters/:id/stories/:storyId/edit"
              element={<StoryEditPage />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
