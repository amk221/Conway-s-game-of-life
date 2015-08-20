var Dish   = require('./dish');
var mode   = process.argv[2] || 'output';
var amount = process.argv[3] || 5;
var input  = '';

process.stdin.on('data', function(buffer) {
  var line = buffer.toString();
  var inputted = (line == Dish.eof().join(',') + "\n")
  input += line;

  if (inputted) {
    var dish = new Dish(input);

    if (mode === 'grid') {
      for (var i = 0; i < amount; i++) {
        process.stdout.write('#' + i + "\n");
        process.stdout.write(dish.grid());
        dish.advance();
      }
    } else {
      process.stdout.write('Output:' + "\n");
      process.stdout.write(dish.output());
    }

    process.exit();
  }
});

