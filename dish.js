'use strict';

var Cell = require('./cell');


/**
 * Initialize a petri `Dish` of bacteria cells.
 * Accept positive integer pairs each on their own line, terminated by -1,-1
 *
 * Example:
 * 1,2
 * 2,2
 * 3,2
 * -1,-1
 *
 * @param {String} coordinates
 */
var Dish = function(input) {
  this.cells = {};
  this.input(input);
};

/**
 * When x & y are supplied, check they represent the eof.
 * When no arguments are provided, return the eof.
 *
 * @param {Integer|null}
 * @param {Integer|null}
 * @return {Boolean|Array}
 */
Dish.eof = function(x, y) {
  var e = -1;
  return (arguments.length === 2) ?
    (x === e && y === e) :
    [e, e];
};

/**
 * Find positive & negative integers in the input string
 *
 * @param {String}
 * @return {Array}
 */
Dish.parse = function(string) {
  var digits = ((string || '').match(/(-?\d+)\n?/g) || []);

  return digits.map(function(d) {
    return parseInt(d, 10);
  });
};

/**
 * Add a cell to this Dish's fake 'grid'
 * (It's actually just a hash of locations, for quicker look-up)
 *
 * @param {Object} Cell instance
 */
Dish.prototype.add = function(cell) {
  if (!this.occupied(cell.x, cell.y)) {
    this.cells[cell.key()] = cell;
  }
};

/**
 * Check if a cell already occupies the given coordinates.
 *
 * @param {Integer} x coord
 * @param {Integer} y coord
 * @return {Boolean}
 */
Dish.prototype.occupied = function(x, y) {
  return !!this.cells[Cell.buildKey(x, y)];
};

/**
 * Advance to the next generation of cells
 */
Dish.prototype.advance = function() {
  this.input(this.output());
};

/**
 * Return the cell at the given coordinates
 * (Creating a new one if the cell is empty)
 *
 * @param {Object|String} Accept either x, y or [x, y] for ease of use
 * @return {Object}
 */
Dish.prototype.at = function(x, y) {
  var args = (arguments.length === 1) ? Cell.parseKey(x) : arguments;
  var key  = Cell.buildKey.apply(null, args);

  return this.cells[key] || new Cell(this, x, y);
};

/**
 * Return a hash of keys and their corresponding cells.
 *
 * This differs from the `cells` property, in that it also includes
 * neighbouring cells of the _existing_ cells.
 *
 * e.g. If `this.cells` contains an entry at 0,0
 * then `getCells` will return 0,0 and the 8 surrounding
 *
 * @return {Object}
 */
Dish.prototype.getCells = function() {
  var cells = {};

  var addCell = function(cell) {
    cells[cell.key()] = cell;
  };

  for (var key in this.cells) {
    var cell = this.at(key);

    addCell(cell);
    cell.neighbours().forEach(addCell);
  }

  return cells;
};

/**
 * Spawn new life in this dish, according to the input data
 *
 * @see constructor
 * @param {String} input digits
 */
Dish.prototype.input = function(input) {
  var integers = Dish.parse(input);

  for (var i = 0, l = integers.length; i < l; i+=2) {
    var x = integers[i];
    var y = integers[i+1];

    if (!Dish.eof(x, y)) {
      this.at(x, y).generate();
    }
  }
};

/**
 * Begin evolving each cell.
 *
 * Build their new coordinates in the same format as they were originally
 * input (i.e. One coord per line) terminated with the eof.
 *
 * Then, complete the cell evolution & return the output.
 *
 * @return {String}
 */
Dish.prototype.output = function() {
  var output = [];
  var cells  = this.getCells();
  var key;

  for (key in cells) {
    var cell = cells[key];

    cell.beginEvolution();

    if (cell.nextGen()) {
      output.push(cell.coords());
    }
  }

  for (key in cells) {
    this.at(key).completeEvolution();
  }

  output.push(Dish.eof());
  output = output.join("\n");

  return output;
};

/**
 * Determine the size of the 'grid' by looking for the cell
 * with the highest coordinates
 *
 * @return {Array} of coordinates
 */
Dish.prototype.size = function() {
  var x = 0;
  var y = 0;

  for (var key in this.cells) {
    var cell = this.cells[key];
    x = cell.x > x ? cell.x : x;
    y = cell.y > y ? cell.y : y;
  }

  return [x + 1, y + 1];
};

/**
 * Convert this Dish to a ascii grid showing dead & alive cells at
 * the current evolution.
 *
 * @return {String}
 */
Dish.prototype.grid = function() {
  var str   = '';
  var size  = this.size();
  var xAxis = size[0];
  var yAxis = size[1];

  for (var x = 0, l = xAxis; x < l; x++) {
    for (var y = 0; y < yAxis; y++) {
      str += this.at(x, y).toString();
    }
    str += "\n";
  }

  return str;
};


module.exports = Dish;