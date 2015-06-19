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

    dataSet.yAxis[0].min = optionRefs.axis[0].min == '' ? undefined : optionRefs.axis[0].min;
    dataSet.yAxis[0].max = optionRefs.axis[0].max == '' ? undefined : optionRefs.axis[0].max;
    dataSet.yAxis[1].min = optionRefs.axis[1].min == '' ? undefined : optionRefs.axis[1].min;
    dataSet.yAxis[1].max = optionRefs.axis[1].max == '' ? undefined : optionRefs.axis[1].max;


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
        colors: ['#6084ac', '#d63f44','#068f28' ,'#c87d35', '#e76c47', '#A60000', '#455789', '#87b5d8', '#ecd435'],
        plotOptions: {
            column: {
                borderColor: '#ddd',
                pointPlacement: 'between',
            },
            series: {
                grouping: $(element).data('series-grouping'),
                pointPlacement: 'between',
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
                head = '<span style="font-size: 12px">' + monthNames[this.point.xFormat.getMonth()] + ' ' + this.point.xFormat.getFullYear() + '</span><br/>';
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
    console.log(options);
    $(element).highcharts(options);
});
