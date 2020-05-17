// Configuration for your app
const DotEnv = require(`dotenv`);
const webpack = require(`webpack`);
const envparsers = require(`./config/envparser`);
const path = require('path')

module.exports = function(ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ["i18n", "axios"],

    css: ["app.styl"],

    extras: [
      "roboto-font",
      "material-icons" // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],

    framework: {
      cssAddon: true,
      // all: true, // --- includes everything; for dev only!

      components: [
        "QLayout",
        "QHeader",
        "QDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QBtn",
        "QIcon",
        "QList",
        "QItem",
        "QItemSection",
        "QItemLabel",
        "QInput",
        "QBtnDropdown",
        "QAvatar",
        "QCard",
        "QCardSection",
        "QCardActions",
        "QTable",
        "QTh",
        "QTr",
        "QTd",
        "QSelect",
        "QSeparator",
        "QDialog",
        "QSpace",
        "QCheckbox",
        "QCircularProgress",
        "QImg",
        "QRadio",
        "QTabs",
        "QTab",
        "QRouteTab",
        "QTabPanels",
        "QTabPanel",
        "QExpansionItem",
        "QRange",
        "QOptionGroup",
        "QChip",
        "QField",
        "QBtnGroup",
        "QPagination",
        "QInfiniteScroll",
        "QSpinnerDots",
        "QSpinner",
        "QScrollArea",
        "QTooltip",
        "QBar",
        "QMenu"
      ],

      directives: ["Ripple", "GoBack", "ClosePopup"],

      // Quasar plugins
      plugins: [
        "Notify",
        'Meta',
        'Dialog'
      ]

      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      env: envparsers(),
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            fix: true
          }
        });

        // Create an alias for our helper
        cfg.resolve.alias.env = path.resolve(__dirname, 'config/helpers/env.js')

        // Make our helper function Global
        cfg.plugins.push(
          new webpack.ProvidePlugin({
            'env': 'env' // this variable is our alias, it's not a string
          })
        )

      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        "/api": {
          target: "https://dev.oppscience.com/api",
          // target: "http://localhost:8080/api",
          changeOrigin: true,
          pathRewrite: {
            "^/api": ""
          }
        }
      }
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      }
    }
  };
};
