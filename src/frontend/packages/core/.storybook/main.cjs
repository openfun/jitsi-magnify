module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/preset-scss',
    '@bbbtech/storybook-formik/register',
    'storybook-addon-react-router-v6'
  ],
  "framework": {
    name: "@storybook/react-vite",
    options: {}
  },
  "features": {
    "storyStoreV7": true
  },
  "core": {
    "builder": "@storybook/builder-vite"
  },
  docs: {
    autodocs: true
  }
}
