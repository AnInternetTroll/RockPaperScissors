# Developing
To run in development you can use the following command

```sh
deno run --no-check --allow-net --allow-read --unstable --watch ./src/Server.ts
```

or if on a normal computer `./src/Server.ts` should be enough. 

# Production

The same command should work just fine, but you might prefer to bundle all frontend javascript you may use `deno bundle --no-check src/View.tsx view.js` and change `index.html` to import it. Now you may bundle those files for offline use. 

## Dependencies:

- deno
- preact
- terser
