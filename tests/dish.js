var assert = require('assert');
var Dish   = require('../dish');
var Cell   = require('../cell');

describe('EOF', function() {
  it('confirms the EOF', function() {
    assert(Dish.prototype.eof(-1,-1));
    assert(!Dish.prototype.eof(2,3));
  });

  it('returns the EOF', function() {
    assert.deepEqual(Dish.prototype.eof(), [-1,-1]);
  });
});

describe('add', function() {
  it('adds a cell to the fake grid', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 1, 2);
    assert.deepEqual(dish.cells, {}, 'No cells to start with');
    dish.add(cell);
    assert.equal(dish.cells['1,2'], cell);
  });
});

describe('occupied', function() {
  it('checks if a cell is occupied', function() {
    var dish = new Dish();
    assert(!dish.occupied(0,0));
    assert(!dish.occupied(1,1));
    dish.add(new Cell(dish, 1,1));
    assert(!dish.occupied(0,0));
    assert(dish.occupied(1,1));
  });
});

describe('parse', function() {
  it('converts input string into array of integers', function() {
    assert.deepEqual(Dish.prototype.parse(''), []);
    assert.deepEqual(Dish.prototype.parse('1,2,3'), [1,2,3]);
    assert.deepEqual(Dish.prototype.parse('a,c,b'), []);
  });
});

describe('at', function() {
  it('returns a cell at the specified position', function() {
    var dish = new Dish();
    var cell1 = new Cell(dish, 2, 3);
    var cell2 = new Cell(dish, 4, 5);
    dish.add(cell1);
    dish.add(cell2);
    assert.equal(dish.at(2,3), cell1);
    assert.notEqual(dish.at(2,3), cell2);
  });

  it('accepts two types of input', function() {
    var dish = new Dish("1,2\n,3,4");
    assert.equal(dish.at('1,2').x, 1);
    assert.equal(dish.at('1,2').y, 2);
    assert.equal(dish.at(3 ,4).x, 3);
    assert.equal(dish.at(3, 4).y, 4);
  });

  it('automatically makes a cell', function() {
    var dish = new Dish();
    assert.equal(dish.at(6,7).x, 6);
    assert.equal(dish.at(8,9).y, 9);
  });
});

describe('input', function() {
  it('spawns cells at the specified coords', function() {
    var dish = new Dish();
    assert(!dish.cells['1,2']);
    dish.input("1,2\n,10,10005");
    assert(dish.cells['1,2'] instanceof Cell);
    assert.equal(dish.cells['10,10005'].x, 10);
    assert.equal(dish.cells['10,10005'].y, 10005);
  });

  it('accommodates erroneous input', function() {
    var dish = new Dish();
    dish.input('!@£$%^&*');
    assert(Object.keys(dish.cells), 0);
  });
});

describe('output', function() {
  it('generates the next generation of input', function(){
    var input, expected, output;

    input    = "1,2\n2,2\n3,2\n-1,-1";
    expected = "2,1\n2,2\n2,3\n-1,-1";
    output   = (new Dish(input)).output();
    assert.equal(output, expected);

    input    = "1,2\n2,2\n3,2\n1000000001,1000000002\n1000000002,1000000002\n1000000003,1000000002\n-1,-1";
    expected = "2,1\n2,2\n2,3\n1000000002,1000000001\n1000000002,1000000002\n1000000002,1000000003\n-1,-1";
    output   = (new Dish(input)).output();
    assert.equal(output, expected);
  });
});

describe('getCells', function() {
  it('returns a hash of cells including neighbours', function() {
    var dish = new Dish("0,0");
    var keys = Object.keys(dish.getCells());
    assert.deepEqual(keys, ['0,0','1,-1','0,-1','-1,-1','1,0','-1,0','1,1','0,1','-1,1']);
  });
});

describe('size', function() {
  it('gets the largest cells', function() {
    var dish = new Dish("0,10\n20,4");
    var cell = new Cell(dish, 10, 10);
    dish.add(cell);
    size = dish.size();
    assert.equal(size[0], 21);
    assert.equal(size[1], 11);
  });
});

describe('grid', function() {
  it('generates a grid', function() {
    var dish = new Dish("0,1\n1,0");
    assert.equal(dish.grid(), "[◦][•]\n[•][◦]\n");
  });
});



