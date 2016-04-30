# xs-dom

A virtual-dom library tailored to Cycle.js

## Want to try this stuff out?

```
$ npm install xs-dom
```

## Basic usage

```js
import {init, h} from 'xs-dom'
import styles from 'xs-dom/lib/module/style'
import klass from 'xs-dom/lib/module/classes'

const rootElement = document.querySelector('#app')
const xsdom = init([styles, klass], rootElement)

const view = h('div', {}, [ h('h1', 'Hello World!') ])

xsdom.patch(view)

```

This has started a fork of snabbdom to TypeScript,
but will continue to evolve into a more and more specific solution
for Cycle.js. No priority will be given to it working outside of Cycle.js
(though it may still work in other places).
