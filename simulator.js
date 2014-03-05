var Dish   = require('./dish');
var mode   = process.argv[2] || 'output';
var amount = process.argv[3] || 5;
var input  = '';

process.stdin.on('data', function(buffer) {
  var line = buffer.toString();

  if (line == Dish.eof().join(',') + "\n") {
    var dish = new Dish(input);

    switch (mode) {
      case 'grid':
        for (var i = 1; i <= amount; i++) {
          console.log('#' + i);
          console.log(dish.grid());
          dish.advance();
        }
      break;

      default:
        console.log('Output:');
        console.log(dish.output());
      break;
    }

    process.exit();
  } else {
    input += line;
  }  
});

