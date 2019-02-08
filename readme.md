# Vanilla Tunes

Vanilla Javascript ES6 SPA iTunes API search. 

I am using Javascript ES6 to simulate a SPA based on Components, handling state and rendering templates.


## Getting Started

### Installing

Just install package.json dependencies

```
npm install
```

## Dev Server

Run a dev server by using:

```
npm run dev
```

This will open a new window in browser poiting to localhost:9999. 
You can change the port and other options in webpack.dev.js 
Or the npm command in package.json scripts section.

## Deployment

To build the JS and use this in production run:

```
npm run build
```

## SaSS watcher

Open a new terminal window/tab and run the SaSS watcher in case you need it:

```
npm run sass
```

## Dependencies

* [Babel](https://babeljs.io/) - JS compiler 
* [Node-Sass](https://github.com/sass/node-sass) - Sass compiler
* [Webpack](https://github.com/webpack/webpack) - Used to build the JS and to run a dev server
* [es6-symbol](https://github.com/medikoo/es6-symbol) - Polyfill to make sure the environment implements Symbol globally for old browsers or < es6

## Authors

* **Francisco M.Montenegro** - [franciscosurf](https://github.com/franciscosurf)


## Based on 

I wanted to replicate Reactive UI without using any frameworks. Just ES6 Vanilla Javascript.
So I followed the guidelines from this great post: https://medium.com/@iamwill.us/yet-another-post-about-creating-components-with-es6-vanilla-javascript-e57eca42f611
