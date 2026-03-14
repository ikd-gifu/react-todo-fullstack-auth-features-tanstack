import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // React 18 以降の新しいレンダリング方法
import { Router } from './routers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

// anStack Query のキャッシュ本体
// アプリ全体で1つの QueryClient を共有する
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5分
      gcTime: 1000 * 60 * 10, // 10分
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 同じ共有キャッシュを参照するようpropsで渡す */}
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </StrictMode>,
)
