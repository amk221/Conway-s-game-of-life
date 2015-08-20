'use strict';

/**
 * Initialise a `Cell`, associating it with a given petri `Dish`
 *
 * @param {Object} dish
 * @param {x} Initial X coordinate of the cell within the dish
 * @param {y} Initial Y coordinate of the cell within the dish
 */
var Cell = function(dish, x, y) {
  this.dish = dish;
  this.x = x;
  this.y = y;
  this.state = {
    present: 'dead',
    future: undefined
  };
};

/**
 * Build a unique key from the coordinates passed in
 *
 * @param {Number} x
 * @param {Number} y
 * @return {String}
 */
Cell.buildKey = function(x, y) {
  return x + ',' + y;
};

/**
 * Accept a key string and parse it into a coordinates array e.g. "3,4"
 *
 * @param {String}
 * @return {Array}
 */
Cell.parseKey = function(key) {
  return key.split(',');
};

/**
 * Offset integers used to find a cell's nearest neighbours.
 */
Cell.offsets = [
  [-1, 1], [0, 1], [1, 1],
  [-1, 0],         [1, 0],
  [-1,-1], [0,-1], [1,-1]
];

/**
 * Return this cell's unique key
 *
 * @return {String}
 */
Cell.prototype.key = function() {
  return Cell.buildKey(this.x, this.y);
};

/**
 * Return the X and Y coordinates of this cell
 *
 * @return {Array}
 */
Cell.prototype.coords = function() {
  return [this.x, this.y];
};

/**
 * Convert this cell to a string representing its alive/dead state
 *
 * @return {String}
 */
Cell.prototype.toString = function() {
  return this.alive() ? '▓▓' : '░░';
};

/**
 * Return whether or not this cell is alive in its current state.
 *
 * @return {Boolean}
 */
Cell.prototype.alive = function() {
  return this.state.present === 'alive';
};

/**
 * Return whether or not this cell is dead in its current state.
 *
 * @return {Boolean}
 */
Cell.prototype.dead = function() {
  return !this.alive();
};

/**
 * Spawn this cell into life
 */
Cell.prototype.spawn = function() {
  this.state.present = 'alive';
};

/**
 * Kill this cell by marking it as dead
 * (in the next evolutionary step)
 */
Cell.prototype.die = function() {
  this.state.future = 'dead';
};

/**
 * Bring this cell back to life by marking it as alive
 * (in the next evolutionary step)
 */
Cell.prototype.resusitate = function() {
  this.state.future = 'alive';
};

/**
 * Sustain this cell by marking it as alive
 * (in the next evolutionary step)
 */
Cell.prototype.sustain = function() {
  this.state.future = 'alive';
};

/**
 * Shortcut function for spawning a new cell to life _and_
 * simultaneously adding it to the dish.
 */
Cell.prototype.generate = function() {
  this.spawn();
  this.dish.add(this);
};

/**
 * Return whether or not this cell will be present in the next
 * generation of cells.
 *
 * @return {Boolean}
 */
Cell.prototype.nextGen = function() {
  return this.state.future === 'alive';
};

/**
 * Determine the future state of this cell by beginning the
 * evolutionary process according to the 4 rules outlined in the PDF
 */
Cell.prototype.beginEvolution = function() {
  var neighbours = this.numOfLivingNeighbours();

  if (this.alive()) {
    if (neighbours < 2 || neighbours > 3) {
      this.die();
    } else if (neighbours === 2 || neighbours === 3) {
      this.sustain();
    }
  } else if (neighbours === 3) {
    this.resusitate();
  }
};

/**
 * Complete the evolutionary process by moving this cell's computed future
 * to be the present.
 */
Cell.prototype.completeEvolution = function() {
  this.state.present = this.state.future;
};

/**
 * Begin and complete a full evolutionary cycle,
 * moving this cell into the future
 */
Cell.prototype.evolve = function() {
  this.beginEvolution();
  this.completeEvolution();
};

/**
 * Return the number of neighbouring cells that are alive.
 *
 * @return {Number}
 */
Cell.prototype.numOfLivingNeighbours = function() {
  return Object.keys(this.aliveNeighbours()).length;
};

/**
 * Return an array of neighbouring cells that are alive.
 *
 * @return {Array}
 */
Cell.prototype.aliveNeighbours = function() {
  return this.neighbours().filter(function(neighbour) {
    return neighbour.alive();
  });
};

/**
 * Return an array of neighbouring cells
 *
 * @return {Array}
 */
Cell.prototype.neighbours = function() {
  var neighbours = [];

  for (var i = 0, l = Cell.offsets.length; i < l; i++) {
    var coords = Cell.offsets[i];
    var x      = this.x + coords[0];
    var y      = this.y + coords[1];
    var cell   = this.dish.at(x, y);

    if (cell) {
      neighbours.unshift(cell);
    }
  }

  return neighbours;
};


module.exports = Cell;