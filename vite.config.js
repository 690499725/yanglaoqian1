import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	plugins: [
		vue(),
		{
			name: 'copy-vr-folder',
			closeBundle() {
				// 获取当前文件的目录
				const __filename = fileURLToPath(import.meta.url)
				const __dirname = dirname(__filename)
				
				// 创建目标目录
				const distDir = resolve(__dirname, 'dist')
				const vrDir = resolve(distDir, 'vr')
				mkdirSync(vrDir, { recursive: true })
				
				// 复制vr文件夹
				const sourceDir = resolve(__dirname, 'vr')
				const copyDir = (src, dest) => {
					const fs = require('fs')
					const path = require('path')
					
					// 确保目标目录存在
					if (!fs.existsSync(dest)) {
						fs.mkdirSync(dest, { recursive: true })
					}
					
					// 读取源目录
					const entries = fs.readdirSync(src, { withFileTypes: true })
					
					for (const entry of entries) {
						const srcPath = path.join(src, entry.name)
						const destPath = path.join(dest, entry.name)
						
						if (entry.isDirectory()) {
							// 递归复制子目录
							copyDir(srcPath, destPath)
						} else {
							// 复制文件
							fs.copyFileSync(srcPath, destPath)
						}
					}
				}
				
				copyDir(sourceDir, vrDir)
			}
		}
	],
	server: {
		port: 3000,
		open: false,
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
})
