/**
 * Created by qcrtrash on 2017/11/19.
 */
var density = function () {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        margin = {top: 20, right: 30, bottom: 30, left: 40};

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        margin = {top: 20, right: 30, bottom: 30, left: 40};

    var x = d3.scaleLinear()
        .domain([-25, 20])
        .rangeRound([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
        .domain([-25, 20])
        .rangeRound([height - margin.bottom, margin.top]);

    var color = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([0, 1.8]); // Points per square pixel.

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).ticks(null, ".1f"))
        .select(".tick:last-of-type text")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode());
        })
        .attr("y", -3)
        .attr("dy", null)
        .attr("font-weight", "bold")
        .text("Carats");

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y).ticks(null, ".1s"))
        .select(".tick:last-of-type text")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode());
        })
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("y (USD)");

    d3.tsv("/static/data/density.tsv", function (d) {
        d.x = +d.x;
        d.y = +d.y;
        return d;
    }, function (error, density) {
        if (error) throw error;

        x.domain(d3.extent(density, function (d) {
            return d.x;
        })).nice();
        y.domain(d3.extent(density, function (d) {
            return d.y;
        })).nice();

        svg.insert("g", "g")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .attr("stroke-linejoin", "round")
            .selectAll("path")
            .data(d3.contourDensity()
                .x(function (d) {
                    return x(d.x);
                })
                .y(function (d) {
                    return y(d.y);
                })
                .size([width, height])
                .bandwidth(10)
                (density))
            .enter().append("path")
            .attr("fill", function (d) {
                return color(d.value);
            })
            .attr("d", d3.geoPath());
    });
};