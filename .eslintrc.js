module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: ['@nuxtjs', 'eslint:recommended', 'plugin:vue/essential', '@vue/prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        //ecmaVersion: 2018,
        parser: 'babel-eslint',
        sourceType: 'module',
    },
    plugins: ['vue'],
    rules: {
        'no-console': 'off',
        'vue/require-prop-types': 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/this-in-template': 'off',
        'vue/multiline-html-element-content-newline': [
            2,
            {
                ignoreWhenEmpty: true,
                ignores: ['pre', 'textarea'],
                allowEmptyLines: false,
            },
        ],
    },
};
