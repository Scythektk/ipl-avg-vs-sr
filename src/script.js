const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
    const xValue = (d) => d.Population; // Change to second column heading of csv
    const yValue = (d) => d.Country; // Change to first column heading of csv
    const margin = { top: 80, bottom: 70, right: 35, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]); // define scale for data

    const yScale = d3
        .scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1); // define width of bars (height for horizontal bar chart)

    const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3
        .axisBottom(xScale)
        .tickSize(-innerHeight); // FIXME: tickFormat(format('.3s') is not working

    g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line')
        .remove(); // country axis labels

    const xAxisG = g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.select('.domain')
        .remove(); // country axis labels; // population axis labels

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 45)
        .attr('x', innerWidth/2)
        .attr('fill', 'black')
        .text('Population');

    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', (d) => yScale(yValue(d)))
        .attr('width', (d) => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());

    g.append('text')
        .attr('class', 'bar-title')
        .attr('y', -10)
        .text('Top Countries by Population 2021');
}; // function to render

function barChart(file_name) {
    d3.csv(`../data/${file_name}.csv`).then((data) => {
        data.forEach((d) => {
            d.Population = +d.Population * 1000;
        });
        render(data);
    });
}

barChart('population'); // Enter filename without extension

// To load different csv go to lines 7, 8, 45 and 51
