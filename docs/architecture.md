# Architecture

This project is divided in 4 main parts:

- `src/frontend`: A frontend library, published as `@jitsi-magnify/frontend-lib` on NPM. 
- `src/demo/frontend`: A frontend demo, published as `@jitsi-magnify/frontend-demo`: a simple react app that show a typical usecase for the components, the views, the code provided by the front library
- `src/magnify`: A backend library, published as `magnify` on PyPI, that exposes a typical django configuration, and some apps (currently only one)
- `src/demo/backend`: A backend demo: a django project that show how to integrate the apps in an actual project

The demo projects are designed for the usecase of openfun, but can be used a a basis for your own project. The apps published on PyPI can be used independantly in your own django project.

## Local/distant packages

One of the difficulties of using a library is to use it in the repository using the latest modifications (and so benefits from the monorepo structure), but to expose it so the community can use it directly.  

On the frontend, this can be achieved by using `yarn workspace` to install the local library as a dependency of the demo project, as if it was a normal library. Therefore, the demo project can use the local library, but the library can also be fetched from npm is the context is not the developement one.

On the backend, by using `pip install -e ...`, we can achieve someting similar, by installing the local library but keeping the link, so any change to the library will be reflected in the demo project. On a production project however, it is better to use the library directly from the PyPI repository.
