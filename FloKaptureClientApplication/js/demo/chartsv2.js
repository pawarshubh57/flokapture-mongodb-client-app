
// Charts.js
// ====================================================================
// This file should not be included in your project.
// This is just a sample how to initialize plugins or components.
//
// - ThemeOn.net -



$(document).ready(function () {

    // MORRIS BAR CHART
    // =================================================================
    // Require MorrisJS Chart
    // -----------------------------------------------------------------
    // http://morrisjs.github.io/morris.js/
    // =================================================================
    Morris.Bar({
        element: 'demo-morris-bar',
        data: [
			{ y: 'Foo_App', a: 100, b: 90 },
			{ y: 'Foo2_App', a: 75, b: 65 },
			{ y: 'Foo3_App', a: 20, b: 15 },
			{ y: 'Foo4_App', a: 50, b: 40 },
			{ y: 'Foo5_App', a: 75, b: 95 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Java', 'JSP/Servelts'],
        gridEnabled: false,
        gridLineColor: 'transparent',
        barColors: ['#247A00', '#FFD800'],
        resize: true,
        hideHover: 'auto'
    });

    // MORRIS BAR CHART
    // =================================================================
    // Require MorrisJS Chart
    // -----------------------------------------------------------------
    // http://morrisjs.github.io/morris.js/
    // =================================================================
    Morris.Bar({
        element: 'demo-morris-bar1',
        data: [
			{ y: 'Java', a: 100000 },
			{ y: 'JSP', a: 75000 },
			{ y: 'Servlets', a: 20000 },
			{ y: 'Others', a: 40000 }
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Lines of Code (LoC)'],
        gridEnabled: false,
        gridLineColor: 'transparent',
        barColors: ['#177bbb'],
        resize: true,
        hideHover: 'auto'
    });

    // MORRIS BAR CHART
    // =================================================================
    // Require MorrisJS Chart
    // -----------------------------------------------------------------
    // http://morrisjs.github.io/morris.js/
    // =================================================================
    Morris.Bar({
        element: 'demo-morris-bar2',
        data: [
			{ y: 'Foo_App', a: 22, b: 70 },
			{ y: 'Foo2_App', a: 12, b: 65 },
			{ y: 'Foo3_App', a: 5, b: 55 },
			{ y: 'Foo4_App', a: 45, b: 40 },
			{ y: 'Foo5_App', a: 23, b: 45 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['#Actions/Workflow', 'Objects Involved'],
        gridEnabled: false,
        gridLineColor: 'transparent',
        barColors: ['#7F0000', '#FF6A00'],
        resize: true,
        hideHover: 'auto'
    });

    // Flot tooltip
    // =================================================================
    $("<div id='demo-flot-tooltip'></div>").css({
        position: "absolute",
        display: "none",
        padding: "10px",
        color: "#fff",
        "text-align": "right",
        "background-color": "#1c1e21"
    }).appendTo("body");


    $("#demo-flot-line").bind("plothover", function (event, pos, item) {

        if (item) {
            var x = item.datapoint[0].toFixed(2), y = item.datapoint[1];
            $("#demo-flot-tooltip").html("<p class='h4'>" + item.series.label + "</p>" + y)
				.css({ top: item.pageY + 5, left: item.pageX + 5 })
				.fadeIn(200);
        } else {
            $("#demo-flot-tooltip").hide();
        }

    });




    // FLOT PIE CHART
    // =================================================================
    // Require Flot Charts
    // -----------------------------------------------------------------
    // http://www.flotcharts.org/
    // =================================================================
    var dataSet = [
		{ label: "Java", data: 4119630000, color: "#177bbb" },
		{ label: "JSP", data: 1012960000, color: "#a6c600" },
		{ label: "Servlets", data: 727080000, color: "#8669CC" },
		{ label: "Others", data: 344120000, color: "#f84f9a" }
    ];

    $.plot('#demo-flot-donut', dataSet, {
        series: {
            pie: {
                show: true,
                combine: {
                    color: '#999',
                    threshold: 0.1
                }
            }
        },
        legend: {
            show: false
        }
    });


    
});
