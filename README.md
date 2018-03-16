# babel-plugin-transform-mia-js-core-dependencies
A Babel plugin to transform mia-js-core dependencies to CommonJS.

## Prerequisites
- A mappings file created with mia-js-core StaticDependencies lib like the given example `mappingsFile.js`
- You have to tell the plugin where to find the mappings file via plugin options, see `run.js` or below

```
...
plugins: [
    [
        'babel-plugin-transform-mia-js-core-dependencies',
        {mappingsFile: path.resolve(__dirname, './mappingsFile.js')}
    ]
]
...
```

## Test the plugin

```node run.js transform.js```

The source code from `transform.js` will be transpiled by the plugin and the result will be printed on screen.

## What's going to be transpiled
- `const CronJobExecutionModel = Shared.models('generic-cronJobExecutionModel')` is going to be `const CronJobExecutionModel = require('/absolute/path/to/model')`
- `const accessKeys = Shared.config('SomeConfig').accessKeys` is going to be `const accessKeys = require('/path/to/SomeConfig').accessKeys`
- `const oneAccessKey = Shared.config('SomeConfig').accessKeys.one` is going to be `const oneAccessKey = require('/path/to/SomeConfig').accessKeys.one`
- `const anotherAccessKey = Shared.config('SomeConfig.accessKeys.two')` is going to be `const anotherAccessKey = require('/path/to/SomeConfig').accessKeys.two`
- `const allModels = Shared.models()` is going to be untouched
- `const identity = 'SomeConfig'; Shared.config(identity)` is going to be untouched 
- If no mapping for a particular dependency was found it remains untouched