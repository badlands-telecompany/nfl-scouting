function getPlayerDetails(d) {
	for (var i = 0; i < players.length; i++) {
		var player = players[i];

		if (player.pos === d.pos && player.name == d.name) {
			return player;
		}
	}
	return undefined;
}


function updateSelected(d) {
	var player = getPlayerDetails(d);

	$('.position-comparison .player-name').html(player.name);
}


function drawPosition(pos)
{
	// clear
	$('.position-plot').html('');

	var margin = {left: 20, right: 20, top: 10, bottom: 10},
		width  = 600 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;

	var svg = d3.select('.position-plot')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom);

	var scatter = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	d3.csv('js/transformed-' + pos + '.csv', function(data) {
		data.forEach(function(d) {
			d.id = +d.id;
			d.x = +d.x;
			d.y = +d.y;
		});

		// scales
		var x = d3.scale.linear()
			.domain( [d3.min(data, function(d) { return d.x; }),
				d3.max(data, function(d) { return d.x; })] )
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([d3.min(data, function(d) { return d.y; }),
				d3.max(data, function(d){ return d.y; })])
			.range([height, 0]); // need the reverse because highest value should be placed at 0.

		// add regions
		scatter.selectAll('.better-players')
			.data(data)
			.enter()
			.append('rect')
				.attr('id', function(d) { return d.id + 'b'; })
				.attr('class', 'better-players')
				.attr('x', function(d) { return x(d.x); })
				.attr('y', 0)
				.attr('width', function(d) { return width - x(d.x); })
				.attr('height', function(d) { return y(d.y); })
				.attr('clicked', false);

		// add regions
		scatter.selectAll('.likely-better-players')
			.data(data)
			.enter()
			.append('rect')
				.attr('id', function(d) { return d.id + 'lb'; })
				.attr('class', 'likely-better-players')
				.attr('x', function(d) { return x(d.x); })
				.attr('y', function(d) { return y(d.y); })
				.attr('width', function(d) { return width - x(d.x); })
				.attr('height', function(d) { return height-y(d.y); })
				.attr('clicked', false);

		scatter.selectAll('.worse-players')
			.data(data)
			.enter()
			.append('rect')
				.attr('id', function(d) { return d.id + 'w'; })
				.attr('class', 'worse-players')
				.attr('x', 0)
				.attr('y', function(d) { return y(d.y); })
				.attr('width', function(d) { return x(d.x); })
				.attr('height', function(d) { return height - y(d.y); })
				.attr('clicked', false);

		scatter.selectAll('.likely-worse-players')
			.data(data)
			.enter()
			.append('rect')
				.attr('id', function(d) { return d.id + 'lw'; })
				.attr('class', 'likely-worse-players')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', function(d) { return x(d.x); })
				.attr('height', function(d) { return y(d.y); })
				.attr('clicked', false);

		// add dash strokes

		// x-axis
		scatter.selectAll('.x-dashed-line')
			.data(data)
			.enter()
			.append("line")
				.attr("id", function(d) { return d.id + 'x'; })
				.attr("class", "dashed-line")
				.attr("x1", 0)
				.attr("y1", function(d) { return y(d.y); })
				.attr("x2", width)
				.attr("y2", function(d){ return y(d.y); })
				.attr('clicked', false)
				.style("stroke-dasharray", ("3, 3"));

		// y-axis
		scatter.selectAll('.y-dashed-line')
			.data(data)
			.enter()
			.append("line")
				.attr("id", function(d) { return d.id + 'y'; })
				.attr("class", "dashed-line")
				.attr("x1", function(d) { return x(d.x); })
				.attr("y1", 0)
				.attr("x2", function(d) { return x(d.x); })
				.attr("y2", height)
				.attr('clicked', false)
				.style("stroke-dasharray", ("3, 3"));


		// add circles
		var circle = scatter.selectAll('.player')
			.data(data)
			.enter()
			.append('circle')
				.attr('id', function(d) { return d.id + 'c'; })
				.attr('class', 'player')
				.attr('cx', function(d) { return x(d.x); })
				.attr('cy', function(d) { return y(d.y); })
				.attr('r', 5)
				.on('mouseover', function(d) {
					function makeVisible(elem) {
						elem.style('visibility', 'visible')
					}

					var b = d3.select($('#' + d.id + 'b')[0]);
					var w = d3.select($('#' + d.id + 'w')[0]);
					var lb = d3.select($('#' + d.id + 'lb')[0]);
					var lw = d3.select($('#' + d.id + 'lw')[0]);
					var xAxis = d3.select($('#' + d.id + 'x')[0]);
					var yAxis = d3.select($('#' + d.id + 'y')[0]);

					makeVisible(b); 
					makeVisible(w);
					makeVisible(lb);
					makeVisible(lw); 
					makeVisible(xAxis); 
					makeVisible(yAxis);

					// update comparison table
					// updateHovered(d);
				})
				.on('mouseout', function(d) {
					function hide(elem) {
						if (elem.attr('clicked') === 'false') {
							elem.style('visibility', 'hidden');
						}
					}

					var b = d3.select($('#' + d.id + 'b')[0]);
					var w = d3.select($('#' + d.id + 'w')[0]);
					var lb = d3.select($('#' + d.id + 'lb')[0]);
					var lw = d3.select($('#' + d.id + 'lw')[0]);
					var xAxis = d3.select($('#' + d.id + 'x')[0]);
					var yAxis = d3.select($('#' + d.id + 'y')[0]);

					hide(b); 
					hide(w); 
					hide(lb);
					hide(lw);
					hide(xAxis); 
					hide(yAxis);

				})
				.on('click', function(d) {
					function unClick(elems) {
						for (var i = 0; i < elems.length; i++) {
							var elem = d3.select(elems[i]);
							elem.style('visibility', 'hidden');
							elem.attr('clicked', false);
						}
					}
					function click(elem) {
						elem.style('visibility', 'visible')
							.attr('clicked', true);
					}
					function removeStroke(elems) {
						for (var i = 0; i < elems.length; i++) {
							var elem = d3.select(elems[i]);
							elem.style('stroke-width', 1);
						}
					}

					unClick( $('.better-players') );
					unClick( $('.worse-players') );
					unClick( $('.likely-better-players') );
					unClick( $('.likely-worse-players') );
					unClick( $('.dashed-line') );
					removeStroke( $('.player') );

					var b = d3.select($('#' + d.id + 'b')[0]);
					var w = d3.select($('#' + d.id + 'w')[0]);
					var lb = d3.select($('#' + d.id + 'lb')[0]);
					var lw = d3.select($('#' + d.id + 'lw')[0]);
					var xAxis = d3.select($('#' + d.id + 'x')[0]);
					var yAxis = d3.select($('#' + d.id + 'y')[0]);

					click(b); 
					click(w); 
					click(lb);
					click(lw);
					click(xAxis); 
					click(yAxis);	
					d3.select(this).style('stroke-width', 2);

					// update the comparison table
					updateSelected(d);
				});

		// force click on player with id 12
		$('#12c').d3Click();
	});
}