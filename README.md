# vue-maplibre-gl

[![npm](https://img.shields.io/npm/v/vue-maplibre-gl.svg?style=flat-square)](https://www.npmjs.com/package/vue-maplibre-gl)
[![TypeScript](https://img.shields.io/badge/-TypeScript-informational?style=flat-square)](https://www.typescriptlang.org/)
[![size](https://img.shields.io/bundlephobia/minzip/vue-maplibre-gl?label=size&style=flat-square)](https://bundlephobia.com/package/vue-maplibre-gl)
[![vue3](https://img.shields.io/badge/vue-3.x-brightgreen.svg?style=flat-square)](https://vuejs.org/)
[![MaplibreGL-JS](https://img.shields.io/badge/Maplibre%20GL%20JS-2.x-brightgreen?style=flat-square)](https://maplibre.org/projects/maplibre-gl-js/)

A small Vue 3 plugin for [maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js). Only additional dependency is [mitt](https://github.com/developit/mitt).

## Features

- Supports MapLibre GL JS v2.x
- Typescript support
- Components for map, controls, sources, markers and layers
- Support for custom controls
- Customizable style switch which reloads sources and layers automatically
- Frame rate control included
- Support for multiple instances and global access by `useMap(key: string | symbol)`
- Small size

## Table of contents

- [Installation](#installation)
- [Usage](#usage)

# Installation

```shell
yarn add vue-maplibre-gl maplibre-gl mitt
```

## Default import

Global Install:

```typescript
import VueMaplibreGl from 'vue-maplibre-gl'

app.use(VueMaplibreGl)
```

Add CSS:

```scss
@import "~maplibre-gl/dist/maplibre-gl.css";
@import "~vue-maplibre-gl/dist/vue-maplibre-gl.css";
```

Use specific components:

```typescript
import { MglMap } from 'vue-maplibre-gl'

app.component('MglMap', MglMap)
```

or in a parent components `.vue` file

```html

<script>
	import { MglMap } from 'vue-maplibre-gl'

	export default {
		components: {
			MglMap
		},
		// ...
	}
</script>
```

# Usage

See [/dev/serve.vue](https://github.com/razorness/vue-maplibre-gl/blob/master/dev/serve.vue) for a real world example.

# Demo

```shell
git clone https://github.com/razorness/vue-maplibre-gl.git
cd vue-maplibre-gl
yarn
yarn dev
```

## PRs welcome ♥

If you have ideas, improvements, suggestions etc. don't hesitate to open a pull request.

### Todos

- [ ] Usage examples
- [ ] Demo
- [ ] API documentation
- [ ] Support `v-model:...` for some basic props
- [x] Add layer events
- [ ] Add [Web-types](https://github.com/JetBrains/web-types)
- [x] Add [frame rate control](https://github.com/mapbox/mapbox-gl-framerate)

## License

[MIT](http://opensource.org/licenses/MIT)
