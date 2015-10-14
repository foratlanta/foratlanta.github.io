/**
 * Jam
 * @return {Array}
 *
 * Return an array
 */
var Jam = (function() {
    var has = function(obj, target) {
        return _.any(obj, function(value) {
            return _.isEqual(value, target);
        });
    };

    var keys = function(data, field) {
        return _.reduce(data, function(memo, item) {
            var key = _.pick(item, field);
            if (!has(memo, key)) {
                memo.push(key);
            }
            return memo;
        }, []);
    };

    /**
     * Group data
     * @param  {[type]} source [description]
     * @param  {[type]} name   [description]
     * @return {[type]}        [description]
     */
    var group = function(data, field) {
        var stems = keys(data, field);
        return _.map(stems, function(stem) {
            return {
                key: stem,
                vals: _.map(_.where(data, stem), function(item) {
                    return _.omit(item, field);
                })
            };
        });
    };

    /**
     * Return one or more series arrays after grouping by the metric and calculating the x and y positions
     * @param  {Array} data         [description]
     * @param  {String} xAxisRef     Metric
     * @param  {Object} yAxisOptions ooptions object
     * @return {Array}
     */
    var series = function(data, xAxisRef, yAxisOptions) {
        var series = [];
        var yAxisOptions = yAxisOptions;
        var xAxisRef = xAxisRef;
        _.each(yAxisOptions.axis, function(axis, index) {
            if (!_.isEmpty(axis)) {
                _.each(group(data, xAxisRef), function(item) {

                    var set = _.assign({
                        name: item.key[xAxisRef],
                        type: axis.type,
                        yAxis: index,
                        useCsvMetricForXaxisLabel: axis.label,
                        data: _.map(item.vals, function(element) {
                            var rDate = new Date(Date.parse(element.Date));
                            colorValue = null;
                            additionalInfo = element.Explanation;
                            xVal = Date.UTC(rDate.getFullYear(), rDate.getMonth());
                            yVal = (_.isNumber(element[axis.metric]) && !_.isNaN(element[axis.metric])) ? element[axis.metric] : 0;

                            if (element.Explanation.length > 0) {
                              colorValue = '#cc0000';
                            }

                            return {
                                x: xVal,
                                y: yVal,
                                yFormat:axis.format,
                                color: colorValue,
                                fillColor: colorValue,
                                xFormat:rDate,
                                explanation: additionalInfo
                            }
                        })
                    });

                    if (!_.isEmpty(yAxisOptions.axis[1]) && (axis.useCsvMetricForXaxisLabel == undefined || axis.useCsvMetricForXaxisLabel == false)) {
                        set.name = axis.label
                    }

                    series.push(set);
                });
            }

        });
        if (_.size(series) === 1) {
            series[0].showInLegend = false;
        }

        return series;

    }

    /**
     * Return y axis values for one or more y axis
     * The position of the axis is set by the index of the grouped series
     *
     * @param  {Array} data
     * @param  {String} xAxisRef
     * @param  {Object} yAxisOptions
     * @return {Array}
     */
    var yAxis = function(data, xAxisRef, yAxisOptions) {
        var yAxis = [];
        var yAxisOptions = yAxisOptions;
        var xAxisRef = xAxisRef;

        _.each(yAxisOptions.axis, function(axis, index) {
            if (!_.isEmpty(axis)) {
                var set = _.assign({
                    title: {
                        text: axis.label,
                    },
                    opposite: index,
                    gridLineWidth: 1,
                    gridLineDashStyle: 'longdash',
                    gridLineColor: '#ddd',
                    type: axis.type,
                    yAxis: index,
                    min: null,
                    labels: {
                        formatter: function() {
                            if (axis.format == 'percentage') {
                                return Math.round(this.value * 100) + '%';
                            }
                            return Math.round(this.value);
                        }
                    },
                });

                if (!_.isEmpty(yAxisOptions.axis[1])) {
                    set.min = null;
                }
                yAxis.push(set);
            }

        });
        return yAxis;

    }

    /**
     * Return the filtered chart options
     * @param  {Array} data
     * @param  {String} xAxisRef     Metric value : Metric
     * @param  {Array} yAxisOptions Array with all yaxis objects
     * @return {Array}
     */
    group.filter = function(data, xAxisRef, yAxisOptions) {
        return {
            series: series(data, xAxisRef, yAxisOptions),
            yAxis: yAxis(data, xAxisRef, yAxisOptions)
        }
    }
    return group;
}());
