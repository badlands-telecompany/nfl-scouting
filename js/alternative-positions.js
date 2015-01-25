/**
 * Return the player's data from alternates.js
 * @param playerName the name of the player
 * @return The data of the player from alternates.js
 */
function getPlayer(playerName)
{
	// TODO tansform alternates such that the key is the player's name
	var players = alternates.players
	for (var i = 0; i < players.length; i++)
	{
		var a = players[i];
		if (a.name === playerName)
		{
			return a;
		}
	}
	return null;
}

function drawCurrentPosition(playerName)
{
	var player = getPlayer(playerName);
	$('.details #position-title').html('Current Position (' + player.position + ')');
	$('.details .current-plot').html('');

	var margin = {left: 10, right: 10, top: 10, bottom: 10};
	var width = 680 - margin.left - margin.right,
		height = 190 - margin.top - margin.bottom;

	var svg = d3.select('.current-plot')
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

	var scatter = svg.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	d3.csv('js/transformed-' + player.position + '.csv', function(data) {
		
		data.forEach(function(d) {
			d.id = +d.id;
			d.x = +d.x;
			d.y = +d.y;
			if (d.x === player.x && d.y === player.y) d.type = 'selected';
			else d.type = 'player';
		});

		// scales
		var x = d3.scale.linear()
			.domain( [d3.min(data, function(d) { return d.x; }),
				d3.max(data, function(d) { return d.x; })] )
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([d3.min(data, function(d) { return d.y; }),
				d3.max(data, function(d){ return d.y; })])
			.range([height, 0]);

		scatter.selectAll('.player')
				.data(data)
				.enter()
				.append('circle')
					.attr('class', function (d) { return d.type; })
					.attr('cx', function(d) { return x(d.x); })
					.attr('cy', function(d) { return y(d.y); })
					.attr('r', function(d) { return d.type === 'selected' ? 5 : 3 });
	});

}

function drawAlternates(playerName)
{
	// clear alternative positions
	$('.alternatives').html('');

	function drawPositionPlot(alternative, div)
	{
		var margin = {left: 10, right: 10, top: 10, bottom: 10};
		var width = 680 - margin.left - margin.right,
			height = 75 - margin.top - margin.bottom;

		var svg = div.append('svg')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom);

		var scatter = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		d3.csv('js/transformed-' + alternative.position + '.csv', function(data) {
			data.forEach(function(d) {
				d.id = +d.id;
				d.x = +d.x;
				d.y = +d.y;
				d.type = 'player';
			});

			data.push({
				x: alternative.x,
				y: alternative.y,
				type: 'selected'
			});

			// scales
			var x = d3.scale.linear()
				.domain( [d3.min(data, function(d) { return d.x; }),
					d3.max(data, function(d) { return d.x; })] )
				.range([0, width]);

			var y = d3.scale.linear()
				.domain([d3.min(data, function(d) { return d.y; }),
					d3.max(data, function(d){ return d.y; })])
				.range([height, 0]);

			scatter.selectAll('.player')
				.data(data)
				.enter()
				.append('circle')
					.attr('class', function (d) { return d.type; })
					.attr('cx', function(d) { return x(d.x); })
					.attr('cy', function(d) { return y(d.y); })
					.attr('r', function(d) { return d.type === 'selected' ? 5 : 3 });
		});
	}


	var positions = ['DL', 'OL', 'LB', 'CB', 'FB', 'S', 'QB', 'WB', 'RB', 'TE'];

	var player = getPlayer(playerName);

	// sort the alternatives positions according to their position in the array
	player.alternatives.sort(function(a ,b) {
		var aPos = a.position;
		var bPos = b.position;

		var aIndex = 0;
		var bIndex = 0;
		for (var i = 0; i < positions.length; i++)
		{
			if (positions[i] === aPos) aIndex = i;
			else if (positions[i] === bPos) bIndex = i;
		}

		return aIndex - bIndex;
	});

	console.log(player);

	var aDiv = d3.select('.alternatives');

	for (var i = 0; i < player.alternatives.length; i++)
	{
		var alternative = player.alternatives[i];

		var pDiv = aDiv.append('div')
			.attr('class', 'position');

		pDiv.append('div')
			.attr('class', 'title')
			.text(alternative.position);

		var plotDiv = pDiv.append('div')
			.attr('class', 'plot');

		drawPositionPlot(alternative, plotDiv);
	}
}