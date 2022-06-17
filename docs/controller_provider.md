# **[frontend]** The controller provider

The backend api is mostly separated from the frontend. To not lose this separation, we use in components a controller, that is an object containing each method of the api. This object is called a controller.

To be available in all the components, we use a controller provider and a custom hook. The app must be wrapped in the provider. You should specify the controller to the provider:

```tsx
const controller = // here create a custom controller

<Provider controller={controller}>
  <App />
</Provider>
```


Therefore in components, we can use the controller:

```tsx
import { useController } from "@jitsi-magnify/core";

function MyComponent() {
  const controller = useController();

    const handleClick = () => {
        controller.doSomething("hello");
    }

  return <button onClick={handleClick} />;
}
```

The library will provide a few controllers:

- A controller `DefaultController` calling routes from the django app
- A controller `LogController` only making console.logs
- A controller `MockController` with only `jest.fn()` mocks
