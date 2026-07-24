import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  theme: {
    extend: {
      tokens: {
        colors: {
          ink: { value: '#191f28' },
          muted: { value: '#6b7684' },
          subtle: { value: '#8b95a1' },
          grape: { value: '#3182f6' },
          violet: { value: '#1b64da' },
          cream: { value: '#e8f3ff' },
          surface: { value: '#f2f4f6' },
          line: { value: '#e5e8eb' },
          mint: { value: '#e8faf2' },
          peach: { value: '#fff3e0' },
          softNavy: { value: '#eef1f5' },
          success: { value: '#00a56a' },
        },
        fonts: {
          sans: {
            value:
              '"Pretendard Variable", Pretendard, Inter, system-ui, -apple-system, sans-serif',
          },
        },
      },
    },
  },
})
