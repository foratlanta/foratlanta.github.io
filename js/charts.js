// charts.js
var csvData;
var chartData;

$.ajax({
    url: '../data/data.csv',
    type: 'GET',
    async: false,
    success: parseCSV
});

function parseCSV(csv) {
    var data = $.parse(csv);
    if (data.errors.length === 0) {
        csvData = data.results.rows;
    }
}

$('.report-chart-container').each(function(index, element) {

    // get chart name
    var chartName = $(element).data('source');
    var chartId = $(element).attr('id');

    // fetch the options set in the YAML using the Id
    var optionRefs = _.find(chartOptions, {
        id: chartId
    });

    // get chart data
    chartData = _.where(csvData, {
        Chart: chartName
    });

    // filter the data for series
    var dataSet = Jam.filter(chartData, 'Metric', optionRefs);

    // set chart options
    var options = {
        title: {
            text: ''
        },
        chart: {
            backgroundColor: 'transparent'
        },
        credits: {
            enabled: false
        },
        legend: {
            borderWidth: 0,
            symbolRadius: 8,
            symbolWidth: 10,
            symbolHeight: 10
        },
        colors: ['#6084ac', '#d63f44', '#c87d35', '#e76c47', '#A60000', '#455789', '#87b5d8', '#ecd435'],
        plotOptions: {
            column: {
                borderColor: '#ddd',
                pointPlacement: 'on',
            },
            series: {
                grouping: $(element).data('series-grouping'),
                shadow: false,
                minPointLength: 2,
                pointPadding: 0.1,
                groupPadding: 0,
                marker: {
                    fillColor: '#fff',
                    lineWidth: 2,
                    lineColor: null,
                    symbol: 'circle',
                    radius: 4
                },
            }
        },
        tooltip: {
            formatter: function() {
                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                var sDate = new Date(this.x);
                head = '<span style="font-size: 12px">' + monthNames[sDate.getMonth()] + ' ' + sDate.getFullYear() + '</span><br/>';

                pointValue = this.y;
                if (this.point.yFormat == 'percentage') {
                    pointValue = Math.round(this.y * 100) + '%';
                }
                point = '<span style="font-size: 10px">' + this.series.name + ': ' + pointValue + '</span>';
                return head + point;
            }
        },
        series: dataSet.series,
        yAxis: dataSet.yAxis,
        xAxis: [{
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e of %b'
            },
            gridLineWidth: 1,
            gridLineDashStyle: 'longdash',
            gridLineColor: '#ddd',
            tickmarkPlacement: 'outside',
        }],
    }

    $(element).highcharts(options);
});

/**
 * allows the map legend to show/hide series in the crime rate chart
 * --== EXPERIMENTAL ==--
 */
var mapChart = $('#ps_crime_rates').highcharts();
//$('#ps_crime_rates').after('<img src="/img/APD-zones.svg" width="300">');
$('.map-toggle').each(function(index, element) {
    //for(var zone in mapChart.series)
    for (var i = 0; i < mapChart.series.length; i++) {
        if ($(this).data('series') == mapChart.series[i].name) {
            var target_series = mapChart.series[i];
            $(this).click(function(e) {
                e.preventDefault();
                if (target_series.visible) {
                    target_series.hide();
                } else {
                    target_series.show();
                }
            });
        }
    }
});