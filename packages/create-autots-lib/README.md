# create-autots-lib

A CLI Tool to Generate Basic TypeScript(Vanilla) Library.

## Usage

### Simplest Way - Recommended 

```
$ npx create-autots-lib target-lib-name
```

This will create a new dir named as `target-lib-name`.

or 

```
# Using Npm:
$ npm init autots-lib target-lib-name

# Using Yarn:
$ yarn create autots-lib target-lib-name
```

And you can pass a option  `--yes / -y` to skip questions asking, and if follow this, the CLI will create a `ts-class` lib.

### Install Globally

```
# Using Npm:
$ npm i create-autots-lib -g

# Using Yarn:
$ yarn global create-autots-lib
```

and then

```
$ create-autots-lib target-lib-name
```

**Note:** We recommend that the `target-lib-name` should be lowercase and also can use `-` to split the words. When followed that, the bundled UMD module lib can get a global variable `AutoTS.TargetLibName`.

Behind that, we use `const { pascalCase } = require('change-case');` to parse the `name` of `package.json` - ignore the scope name (default is `@autots`).

## Template

Now the tpls is download with this CLI tool, so maybe someday the tpls is outdated. We will load tpls from the internet in the future.

### ts-class tpl

The target is to generate a `class-based` library. When used, Users need to `new Lib()` or `new AutoTs.Lib()`.

### ts-utils tpl(in the future, Now is in developing)

The target is to generate a library with *some functions*.

## TODOs

- ts-utils template

## License

MIT