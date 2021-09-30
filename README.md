# Developing
To run in development you can use the following command

```sh
deno run --no-check --allow-net --allow-read --unstable --watch ./src/Server.ts
```

or if on a normal computer `./src/Server.ts` should be enough. 

## Tests

Tests go into the `tests/` folder and they use [`Deno.test`](https://deno.land/manual@v1.14.2/testing). The naming scheme should be `{ module_name }.test.{ js | ts | jsx | tsx }`. 

# Production

The same command should work just fine, but you might prefer to bundle all frontend javascript you may use `deno bundle --no-check src/View.tsx view.js` and change `index.html` to import it. Now you may bundle those files for offline use. 

## Dependencies:

- deno
- preact
- terser
