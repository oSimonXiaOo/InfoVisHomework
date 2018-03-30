/**
 * Created by qcrtrash on 2017/11/15.
 */
var scatter = function () {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        margin = {top: 20, right: 30, bottom: 30, left: 40};

    var x = d3.scaleLinear()
        .rangeRound([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top]);

    d3.tsv("/static/data/scatter.tsv", function (d) {
        d.y = +d.y;
        d.x = +d.x;
        return d;
    }, function (error, scatter) {
        if (error) throw error;

        x.domain(d3.extent(scatter, function (d) {
            return d.x;
        })).nice();
        y.domain(d3.extent(scatter, function (d) {
            return d.y;
        })).nice();

        svg.insert("g", "g")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
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
                .bandwidth(40)
                (scatter))
            .enter().append("path")
            .attr("d", d3.geoPath());

        svg.append("g")
            .attr("stroke", "white")
            .selectAll("circle")
            .data(scatter)
            .enter().append("circle")
            .attr("cx", function (d) {
                return x(d.x);
            })
            .attr("cy", function (d) {
                return y(d.y);
            })
            .attr("r", 2);

        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(x))
            .select(".tick:last-of-type text")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode());
            })
            .attr("y", -3)
            .attr("dy", null)
            .attr("font-weight", "bold")
            .text("Idle (min.)");

        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(y))
            .select(".tick:last-of-type text")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode());
            })
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Erupting (min.)");
    });
};