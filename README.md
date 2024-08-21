# bun-linguist-hang

There is an issue where `bun` will hang intermittently when running `linguist-js`.

Node.js runs the same code without problems (but slower!).

Tested with:
 * `bun@1.1.20`
 * `bun@1.1.24`
 * `node@20.10.0`
 * `node@22.6.0`

This repo contains files to easily reproduce the hang.

Simply run `./scripts/linguist-node.js` or `./scripts/linguist-bun.js`. However many
times I run `-node` it works ("99 files found in 1,048ms") but `-bun` either works
("99 files found in 461ms") or hangs indefinitely. 

It seems like the bigger the folder you run linguist over, the more chance there is
of a hang in bun. To keep this reproduction self contained it is just running over
the contents of `node_modules` (which is quite small) so you may need to run `-bun`
a few times.

In order to repeatedly run the command and see if it hangs you can try the following
(tested with `zsh`):

`for ((;;))./scripts/linguist-bun.js &&sleep .1`

or 

`for ((;;))./scripts/linguist-node.js &&sleep .1`

I've [patched](https://bun.sh/docs/install/patch) the `linguist-js` dependency to make 
it easier to see where the hang happens. You can opt into additional logging of the 
data coming back from `createReadStream` with the `LOG_READ_STREAM` environment variable
(e.g. `LOG_READ_STREAM=1 ./scripts/linguist-bun.js`). 

The output is very noisy but shows you where it gets stuck - it is in one of two places:

 1. Between `**** CHECKING IF <path> IS BINARY ****` and `**** <path> IS (NOT) BINARY ****`
 2. Between `**** GETTING CONTENT FOR <path>> ****` and `GOT <count> characters FOR <path> ****`

Tested on `Darwin 23.5.0 arm64 arm`

## Fix

The patches to `linguist-js` which have been added on this branch switch to using sync
file access rather than streams which seems to bypass the problem.

Specifically, the following async code is no longer called:

 * https://github.com/Nixinova/LinguistJS/blob/main/src/helpers/read-file.ts#L9
 * https://github.com/gjtorikian/isBinaryFile/blob/4.0.10/src/index.ts#L106 (bypassed by 
   calling `isBinaryFileSync` instead of `isBinaryFile`)

It seems like the hang could occur in either of these places