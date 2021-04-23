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
        .range([0, innerWidth])
        .nice(); // define scale for data

    const yScale = d3
        .scalePoint()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.5); // define width of bars (height for horizontal scatter plot)

    const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3
        .axisBottom(xScale)
        .tickSize(-innerHeight);

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth);

    g.append('g')
        .call(yAxis)
        .select('.domain')
        .remove(); // country axis labels

    const xAxisG = g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.select('.domain')
        .remove(); // country axis labels; // population axis labels

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 45)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Population');

    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', (d) => yScale(yValue(d)))
        .attr('cx', (d) => xScale(xValue(d)))
        .attr('r', 12);

    g.append('text')
        .attr('class', 'bar-title')
        .attr('y', -10)
        .text('Top Countries by Population 2021');
}; // function to render

function barChart(file_name) {
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

barChart('auto-mpg'); // Enter filename without extension

// To load different csv go to lines 7, 8, 45 and 51
