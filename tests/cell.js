var assert = require('assert');
var Dish   = require('../dish');
var Cell   = require('../cell');

describe('constructor', function() {
  it('has an initial state', function() {
    assert.equal((new Cell()).state.present, 'dead', 'dead in present life');
    assert.equal((new Cell()).state.future, undefined, 'future state unknown');
  });
});

describe('parseKey', function() {
  it('converts a string key into coordinates', function() {
    assert.deepEqual(Cell.prototype.parseKey('1,2'), [1,2]);
    assert.deepEqual(Cell.prototype.parseKey('13, 14'), [13,14]);
  });
});

describe('buildKey', function() {
  it('builds a key containing coords', function() {
    assert.equal(Cell.prototype.buildKey(123, 456), '123,456');
    assert.equal(Cell.prototype.buildKey('foo', 'bar'), 'foo,bar');
  });
});

describe('key', function() {
  it('builds a key for itself', function() {
    var dish = new Dish();
    assert.equal((new Cell(dish, 10, 20).key()), '10,20');
    assert.notEqual((new Cell(dish, 23, 45).key()), '45,23');
  });
});

describe('coords', function() {
  it('returns its own coords as an array', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 2, 3);
    var coords = cell.coords();
    assert.equal(coords[0], 2);
    assert.equal(coords[1], 3);
  });
});

describe('toString', function() {
  it('represents the cell as a bullet char', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    cell.state.present = 'alive';
    assert.equal(cell.toString(), '[•]');
    cell.state.present = 'dead';
    assert.equal(cell.toString(), '[◦]');
  });
});

describe('alive', function() {
  it('returns whether or not the cell is alive', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    cell.state.present = 'alive';
    assert(cell.alive());
    cell.state.present = 'dead';
    assert(!cell.alive());
  });
});

describe('dead', function() {
  it('returns whether or not the cell is dead', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    cell.state.present = 'dead';
    assert(cell.dead());
    cell.state.present = 'alive';
    assert(!cell.dead());
  });
});

describe('spawn', function() {
  it('brings this cell to life', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 1, 2);
    assert(cell.dead());
    cell.spawn();
    assert(cell.alive());
  });
});

describe('generate', function() {
  it('brings this cell to life and adds it to the dish', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 1, 2);
    assert.equal(Object.keys(dish.cells).length, 0);
    assert(cell.dead());
    cell.generate();
    assert(cell.alive());
    assert.equal(Object.keys(dish.cells).length, 1);
  });
});

describe('die', function() {
  it('marks the cell as dead for the next generation', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    assert.equal(cell.state.future, undefined);
    cell.die();
    assert.equal(cell.state.future, 'dead');
  });
});

describe('resusitate', function() {
  it('marks the cell as alive for the next generation', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    assert.equal(cell.state.future, undefined);
    cell.resusitate();
    assert.equal(cell.state.future, 'alive');
  });
});

describe('sustain', function() {
  it('marks the cell as alive for the next generation', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    assert.equal(cell.state.future, undefined);
    cell.sustain();
    assert.equal(cell.state.future, 'alive');
  });
});

describe('nextGen', function() {
  it('returns whether this cell will live on to the next generation',function(){
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);

    cell.die();
    assert.equal(cell.nextGen(), false);

    cell.sustain();
    assert.equal(cell.nextGen(), true);

    cell.die();
    assert.equal(cell.nextGen(), false);

    cell.resusitate();
    assert.equal(cell.nextGen(), true);
  });
  
  it('should *actually* live on to the next generation', function() {
    var dish, cell;

    dish = new Dish("0,0\n1,0\n2,0");
    cell = dish.at(1,0);
    cell.followMe = true;
    assert(cell.alive(), 'initial cell tagged with a marker');

    // Step forward in time, advancing to the next generation of cells
    dish.advance();

    assert(cell.alive(), 'cell lives on');
    assert.strictEqual(cell.followMe, true, 'exact same cell in memory');

    cell = dish.at(1,0);
    
    assert(cell.alive());
    assert.strictEqual(cell.followMe, true);
  });
});

describe('evolve', function() {
  it('dies with fewer than two neighbours (rule #1)', function() {
    var dish = new Dish("1,2");
    var cell = dish.at(1,2);

    assert.equal(cell.numOfLivingNeighbours(), 0);
    assert(cell.alive(), 'alive in the present...');
    cell.evolve();
    assert(!cell.nextGen(), '...will not live on to the next generation');
  });

  it('lives on with two alive neighbours (rule #2)', function() {
    var dish = new Dish("0,0\n0,1\n,0,2");
    var cell = dish.at(0,1);

    assert.equal(cell.numOfLivingNeighbours(), 2);
    assert(cell.alive(), 'alive in the present...');
    cell.evolve();
    assert(cell.nextGen(), '...will live on to the next generation');
  });

  it('lives on with three alive neighbours (rule #2)', function() {
    var dish = new Dish("0,0\n0,1\n,1,0\n1,1");
    var cell = dish.at(0,0);

    assert.equal(cell.numOfLivingNeighbours(), 3);
    assert(cell.alive(), 'alive in the present...');
    cell.evolve();
    assert(cell.nextGen(), '...will live on to the next generation');
  });

  it('dies with more than 3 neighbours (rule #3)', function() {
    var dish = new Dish("0,0\n0,1\n,1,0\n1,1\n0,2");
    var cell = dish.at(0,1);

    assert.equal(cell.numOfLivingNeighbours(), 4);
    assert(cell.alive(), 'alive in the present...');
    cell.evolve();
    assert(!cell.nextGen(), '...will not live on to the next generation');
  });

  it('comes back to life with exactly 3 neighbours (rule #4)', function() {
    var dish = new Dish();
    var cell = dish.at(0,1);

    assert(cell.dead(), 'dead in the present...');
    (new Cell(dish, 0, 0)).generate();
    (new Cell(dish, 0, 2)).generate();
    (new Cell(dish, 1, 1)).generate();
    assert.equal(cell.numOfLivingNeighbours(), 3);
    cell.evolve();
    assert(cell.nextGen(), '...resusitated in the next generation');
  });
});

describe('completeEvolution', function() {
  it('moves a cell along to the next generation', function() {
    var dish = new Dish();
    var cell = new Cell(dish, 0, 0);
    cell.dead();
    cell.state = { present: 'foo', future: 'bar' };
    cell.completeEvolution();
    assert.deepEqual(cell.state, { present: 'bar', future: 'bar' });
  });
});

describe('numOfLivingNeighbours', function() {
  it('returns the number of surrounding cells that are alive', function() {
    var dish, neighbours;

    dish = new Dish();
    assert.equal(dish.at(0,0).numOfLivingNeighbours(), 0);

    dish = new Dish("0,2\n0,3");
    assert.equal(dish.at(0,2).numOfLivingNeighbours(), 1);

    dish = new Dish("0,1\n0,2\n0,3");
    assert.equal(dish.at(0,2).numOfLivingNeighbours(), 2);
  });
});

describe('aliveNeighbours', function() {
  it('returns an array of surrounding cells that are alive', function() {
    var dish, neighbours;
    
    dish = new Dish();
    neighbours = dish.at(0,0).aliveNeighbours();
    assert(Array.isArray(neighbours));
    assert.equal(neighbours.length, 0);

    dish = new Dish("0,0\n0,1\n0,2\n1,0\n1,1\n2,1\n2,2");
    neighbours = dish.at(1,1).aliveNeighbours();
    assert(Array.isArray(neighbours));
    assert.equal(neighbours.length, 6);
    neighbours = neighbours.filter(function(neighbour) {
      return neighbour.alive();
    });
    assert.equal(neighbours.length, 6);
  });
});

describe('neighbours', function() {
  it('returns an array of all surrounding cells', function() {
    var dish = new Dish("0,0\n0,1\n0,2\n1,0\n1,1\n2,1\n2,2");
    var neighbours = dish.at(1,1).neighbours();
    var expected = [[2,0],[1,0],[0,0],[2,1],[0,1],[2,2],[1,2],[0,2]];
    var actual = neighbours.map(function(neighbour) {
      return neighbour.coords(); 
    });

    assert(Array.isArray(neighbours));
    assert.equal(neighbours.length, 8);
    assert.deepEqual(actual, expected);
    assert(neighbours[0].dead());
    assert(neighbours[1].alive());
    assert(neighbours[2].alive());
    assert(neighbours[3].alive());
    assert(neighbours[4].alive());
    assert(neighbours[5].alive());
    assert(neighbours[6].dead());
    assert(neighbours[7].alive());
  });
});






