# @autots/custom-lib-name

some description.

## Features

+ typescript features & vanilla js  

## Installing

```
$ npm install @autots/custom-lib-name -S
```

Using yarn:

```
$ yarn add @autots/custom-lib-name
```

## Example

### layouts

```
<section id="demo">
  <div class="child"></div>
</section>
```

**Note:** write some notes.

### import as a module

```
import CustomLibName from '@autots/custom-lib-name';

// 1. The simplest way
new CustomLibName();
```

### import as a lib

```
<script src="dist/custom-lib-name.min.js"></script>

<script>
  var demo = new AutoTs.CustomLibName(config);
</script>
```

## Config

| Name | Type | Default | Optional | Description |


## Develop

The **entry** file must be named as `index.ts` and put this file in the `src` root directory.

## Todo