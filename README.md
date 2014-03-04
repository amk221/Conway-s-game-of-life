# Bacteria

Code created in response to this brief: [PDF](bacteria.pdf).

### Simulator

The simulator script accepts input from the command line and runs 1 evoution of life:

1. Run `node simulator.js`
2. Enter a single coordinate, e.g. 1,2
3. Repeat step 2 as many times as you like
4. Terminate by entering -1,-1

Optionally run `node simulator.js grid 5` to run 5 evolutions of life outputting a grid for each one.

<img src="evolve.png" width="415" height="74">

### Tests

1. Install [Mocha](https://github.com/visionmedia/mocha) `npm install -g mocha`
- Run `mocha tests`

