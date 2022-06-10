# Developement tools

## Tests

Frontend tests are written using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). On the frontend, unit tests are located in each component folder. They can be run using the command `yarn test` inside the `src/frontend` folder.

Backend tests are located in the `tests` folder. They can be run using the command `make test-back`. It will run the backend tests inside a docker. 

## Storybook

To develop the components of the frontend library in isolation, you can use `yarn storybook` inside the `src/frontend` folder. It will start a storybook server that presents each component in a separate page with some controls to interact with it. This works by writing a story for each component. Stories are located also in the folder of the component they present. 

## CSS modules

CSS can be writen in a `styles.module.css` next to the component it belongs to. This way, the component can be styled using a directive `import classes from './styles.module.css';` and then use the classes in the component `<div className={classes.root} />`.

## Rollup

The frontend library is compiled using [Rollup](https://rollupjs.org/guide/en/index.html). It is a tool similar to webpack, but usually more adapted for the usecase frontend libraries. The frontend library is compiled to both a ES6 module and a CommonJS module.

## Components structure

A typical component folder could look like this:

```
MyComponent
├── index.ts
├── styles.module.css
├── MyComponent.stories.tsx
├── MyComponent.tsx
└── MyComponent.test.tsx
```

`index.ts` is the entry point of the component. It can be used to export the component:

```
export { default } from "./MyComponent";
```

Another `src/components/index.ts` exposes the component in a named way: 

```
export { default as MyComponent } from "./MyComponent";
```

Finaly a top level `src/index.ts` exports all, folder by folder. If you add a complete folder, do not forget to add it to the `src/index.ts`:

```
export * from './components';
```
