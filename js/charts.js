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
    var iq;
    var seriesBenchmarkTarget;

    for (iq = 0; iq < 2; iq++) {
      if(dataSet.yAxis[iq] != undefined ) {
        dataSet.yAxis[iq].min = optionRefs.axis[iq].min == '' ? undefined : optionRefs.axis[iq].min;
        dataSet.yAxis[iq].max = optionRefs.axis[iq].max == '' ? undefined : optionRefs.axis[iq].max;

        // If there is an issue with aligning both the series while setting max uncomment
        // if(optionRefs.axis[iq].max != undefined) {
        //   dataSet.yAxis[iq].alignTicks = false;
        //   if( iq > 0) {
        //     dataSet.yAxis[iq].gridLineWidth = 0;
        //   }
        // }
          if(optionRefs.axis[0].targetBenchmark != '') {
            if (optionRefs.axis[0].targetSeries == '' || (optionRefs.axis[0].targetSeries != 2 && dataSet.yAxis.length == 1)) {
              seriesBenchmarkTarget = 0;
            }
            if (optionRefs.axis[0].targetSeries == 2 && dataSet.yAxis.length == 2) {
              seriesBenchmarkTarget = 1;
            }
            else {
              seriesBenchmarkTarget = 0;
            }
            dataSet.yAxis[seriesBenchmarkTarget].plotLines = [{
                color: '#666', // Color value
                dashStyle: 'longdash', // Style of the plot line. Default to solid
                value: optionRefs.axis[0].targetBenchmark, // Value of where the line will appear
                width: 2, // Width of the line
                zIndex: 5,
                label: {
                  text: optionRefs.axis[0].targetLabel, // Content of the label.
                  align: 'left', // Positioning of the label.
                  style: {
                    color: 'black'
                  }
                }
            }]
          }
      }
    }

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
                if (this.point.explanation != '' || this.point.explanation != undefined) {
                  point = '<span style="font-size: 10px">' + this.series.name + ': ' + pointValue + '</span><br /><span style="font-size: 10px">' + this.point.explanation + '</span>';
                }
                if (this.point.explanation == '' || this.point.explanation == undefined) {
                  point = '<span style="font-size: 10px">' + this.series.name + ': ' + pointValue + '</span>';
                }

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
