# luapack

Packaging multiple lua files into one, without modifying a lot of code.

I wrote script-packer and rewrote it a couple of weeks ago but i was not satisfied with the result. I wanted to be able to use `require` so that writing code can be as simple as possible.

Currently breaks stack traces and stuff, something that i might write something for later

## How does it work?

Packing process was inspired by webpack, luapack inserts a replacement for the `require` function to act as a proxy. next it will scan from the input file for any files that the file requires and saves these into the packed file. Now when you require something it will come from the saved one instead of using the normal require.

This does come with some cons.
- No procedural file names.
  - `require(file + '.lua')` will not work
- Stack traces become sort of useless

stuff i need to do:
- Make it respect lua's `package.path`. Right now its just relative paths and such

## Usage

Install with npm: `npm i -g Luxizzle/luapack`

### Build

```sh
Usage: luapack build <input>

Builds pack

options:
  -o, --output <file="packed.lua">      File to save to
  -m, --minify                          Minify output using luamin
```

