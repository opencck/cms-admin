import i18n from './plugins/i18n.js';

export default {
    ssr: false,
    server: {
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 4000,
    },
    router: {
        base: '/admin/',
    },
    /*
     ** Headers of the page
     */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: ['~/assets/less/main.less'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '~/plugins/components.js',
        '~/plugins/sweetalert2.js',
        '~/plugins/axios.js',
        '~/plugins/api.js',
        '~/plugins/vuetify.js',
        '~/plugins/draggable.js',
        '~/plugins/vuethemask.js',
        '~/plugins/tinymce.js',
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module',
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/proxy',
        '@nuxtjs/axios',
        'nuxt-i18n',
    ],
    /**
     * i18n (translations)
     * See https://i18n.nuxtjs.org/basic-usage
     */
    i18n,
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        baseURL: '/api/admin/',
    },
    /*
     ** Build configuration
     */
    build: {
        extractCSS: true,
        /*
		optimization: {
			splitChunks: {
				cacheGroups: {
					styles: {
						name: 'styles',
						test: /\.(css|vue)$/,
						chunks: 'all',
						enforce: true,
					},
				},
			},
		},
		*/
        extend(config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.devtool = 'source-map';
            }
        },
    },
    proxy:
        process.env.NODE_ENV !== 'production'
            ? {
                  '/api/': { target: process.env.PROXY_API_URL || 'http://192.168.99.100:5000/' },
              }
            : {},
};
