var widthLarge = 1200
var heightLarge = 550
var widthMedium = 680
var heightMedium = 460
var widthHalf = 500
var heightHalf = 300
var widthSmall = 350
var heightSmall = 240

    function redraw() {
        d3.selectAll("svg").remove()
        makechartAll()
    }

    function legend(myChart, svg, data, myLegend, wl, hl) {

        myChart.legends = [];
        svg.selectAll("title_text")
            // .data()
            // .enter()
            .append("text")
            .attr("x", wl)
            .attr("y", hl)
            .attr("transform", "translate(50,30)")
            .style("font-family", "sans-serif")
            .style("font-size", "14px")
            .style("color", "Black")
            .text(function(d) {
                return d;
            });

        // Get a unique list of Owner values to use when filterin
        var filterValues = dimple.getUniqueValues(data, "Label");

        // Get all the rectangles from our now orphaned legend
        myLegend.shapes.selectAll("circle")

        .on("click", function(e) { // Add a click event to each rectangle
            var hide = false; // This indicates whether the item is already visible or not
            var newFilters = [];

            // If the filters contain the clicked shape hide it
            filterValues.forEach(function(f) {
                if (f === e.aggField.slice(-1)[0]) {
                    hide = true;
                } else {
                    newFilters.push(f);
                }
            });

            // Hide the shape or show it
            if (hide) {
                d3.select(this).style("opacity", 0.2);
            } else {
                newFilters.push(e.aggField.slice(-1)[0]);
                d3.select(this).style("opacity", 0.8);
            }

            // Update the filters
            filterValues = newFilters;

            // Filter the data
            myChart.data = dimple.filterData(data, "Label", filterValues);

            // Passing a duration parameter makes the chart animate. Without it there is no transition
            myChart.draw(100);
        });

        // // add dblclick method to filter all other series
        // .on("dblclick", function (e) {
        //   var hide = false; // This indicates whether the item is already visible or not
        //   var newFilters = [];

        //   // If the filters contain the clicked shape hide it
        //   filterValues.forEach(function (f) {
        //     if (f === e.aggField.slice(-1)[0]) {
        //       newFilters.push(f);
        //     } else {
        //       hide = true;
        //     }
        //   });

        //   // Hide the shape or show it
        //   if (hide) {
        //     d3.select(this).style("opacity", 0.2);
        //   } else {
        //     newFilters.push(e.aggField.slice(-1)[0]);
        //     d3.select(this).style("opacity", 0.8);
        //   }

        //   // Update the filters
        //   filterValues = newFilters;

        //   // Filter the data
        //   myChart.data = dimple.filterData(data, "Label", filterValues);

        //   // Passing a duration parameter makes the chart animate. Without it there is no transition
        //   myChart.draw(100);

        // });

    }