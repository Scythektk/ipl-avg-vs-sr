const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
    const xValue = (d) => d.SR;
    const yValue = (d) => d.Avg;
    const margin = { top: 80 , bottom: 50, right: 35, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const circleRadius = 10;

    const xAxisLabel = 'Strike Rate'
    const yAxisLabel = 'Average';

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice(); // define scale for data

    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, yValue) - 2, d3.max(data, yValue) + 0.5])
        .range([innerHeight, 0]) // define width of bars (height for horizontal scatter plot)

    const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3
        .axisBottom(xScale)
        .tickSize(-innerHeight);

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').remove(); // y axis labels

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'middle')
        .text(yAxisLabel);

    const xAxisG = g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.select('.domain')
        .remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 45)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);

    var tooltip = d3.select('body')
        .append("div")
        .attr('class', 'tooltip')
        .style('opacity', 0)

    var mouseover = function (event, d) {
        d3.select(this).transition()
            .duration('100')
            .attr("r", circleRadius + 3);

        tooltip.transition()
            .duration(100)
            .style('opacity', 1);

        var left = d3.pointer(event)[0] + 30;
        var top = d3.pointer(event)[1] + 50;

        tooltip
            .html(d.PLAYER + '<br/>Avg: ' + d.Avg + '<br/>SR: ' + d.SR)
            .style('left', `${left}px`)
            .style('top', `${top}px`);
    };

    var mouseout = function (d) {
        d3.select(this).transition()
            .duration(200)
            .attr('r', circleRadius);

        tooltip.transition()
            .duration(200)
            .style('opacity', 0);
    };

    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', (d) => yScale(yValue(d)))
        .attr('cx', (d) => xScale(xValue(d)))
        .attr('r', circleRadius)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

    g.append('text')
        .attr('class', 'bar-title')
        .attr('y', -30)
        .attr('padding', '10px')
        .text('IPL Batsmen: Avg vs SR');
};

function scatterPlot(file_name) {
    d3.csv(`../data/${file_name}.csv`).then((data) => {
        data.forEach((d) => {
            d.PLAYER = d.PLAYER;
            d.Mat = +d.Mat;
            d.Inns = +d.Inns;
            d.Runs = +d.Runs;
            d.Avg = +d.Avg;
            d.SR = +d.SR;
            d.Cent = +d.Cent;
            d.HalfCent = +d.HalfCent;
            d.Fours = +d.Fours;
            d.Sixes = +d.Sixes;
        });
        render(data);
    });
}

scatterPlot('iplBatters'); // Enter filename without extension

// To load different csv go to lines 7, 8, 45 and 51