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
`for ((;;))./scripts/linguist-node.js &&sleep .1`

Tested on `Darwin 23.5.0 arm64 arm`