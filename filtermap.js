var fs = require('fs');
var maps = require('./maps');

//'field=val1, val2, val3'
//field might be continent, region-un, name
//val might be `Africa, Europe, Asia, North America, South America`
main(process.argv[2]);

function main(argv) {
	if (argv) {
		var argArray = argv.split('=');
		var field = argArray[0];
		var values = argArray[1].split(',');
		values = values.map(function(item) {
			return item.trim();
		});
		var result = customMap(maps, field, values);

		var name = values.join('');
		var data = name + ' = ' + JSON.stringify(result);
		var fileName = name + '.js';

		fs.writeFile(fileName, data, function (err) {
			if (err) throw err;
			console.log('Saved as %s under your current folder.', fileName);
			console.log('You can invoke the data object as "%s"', name);
		});
	}
}

function customMap(obj, field, values) {
	var map = {};

	for (var key in obj) {
		if (key !== 'features') {
			map[key] = obj[key];
		} else {
			console.log(key);
			var features = obj[key].filter(function (e) {
				return filterData(e, field, values);
			});

			console.log(key);

			console.log('Exported Countries on ' + values.join(', ') + ': ' + features.length);

			map[key] = features;
		}
	}
	return map;
}

function filterData(obj, field, values) {
	for (var key in obj) {
		if (key === 'properties') {
			var o = obj[key];
			for (var p in o) {
				if (o.hasOwnProperty(field)) {
					if (values.indexOf(o[field]) > -1) {
						return true;
					}					
				}
			}
			return false;
		}
	}
}



