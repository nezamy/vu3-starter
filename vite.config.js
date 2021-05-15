import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		VitePWA({
			manifest: {
				// mode: 'development',
				start_url: 'http://localhost',
				base: '/',
				name: "Vue App",
				short_name: "Vue App",
				icons: [{
				  "src": "/PWA/images/hello-icon-128.png",
					"sizes": "128x128",
					"type": "image/png"
				  }, {
					"src": "/PWA/images/hello-icon-144.png",
					"sizes": "144x144",
					"type": "image/png"
				  }, {
					"src": "/PWA/images/hello-icon-152.png",
					"sizes": "152x152",
					"type": "image/png"
				  }, {
					"src": "/PWA/images/hello-icon-192.png",
					"sizes": "192x192",
					"type": "image/png"
				  }, {
					"src": "/PWA/images/hello-icon-256.png",
					"sizes": "256x256",
					"type": "image/png"
				  }, {
					"src": "/PWA/images/hello-icon-512.png",
					"sizes": "512x512",
					"type": "image/png"
				  }],
				lang: "ar-EG",
			}
		})
	],
	resolve: {
		alias: {
		  '@': path.resolve(__dirname, '/src'),
		},
	},
})
