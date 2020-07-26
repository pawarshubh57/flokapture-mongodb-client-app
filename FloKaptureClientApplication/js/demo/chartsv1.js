
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
			{ y: 'com.java.util', a: 100, b: 90 },
			{ y: 'com.java.bo', a: 75, b: 65 },
			{ y: 'com.myfoo.util', a: 20, b: 15 },
			{ y: 'com.myfoo.bo', a: 50, b: 40 },
			{ y: 'com.java.dao', a: 75, b: 95 },
			{ y: 'com.java.log4j', a: 15, b: 65 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Java', 'JSP/Servelts'],
        gridEnabled: false,
        gridLineColor: 'transparent',
        barColors: ['#177bbb', '#afd2f0'],
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
			{ y: 'Servlets', a: 20000 }
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Lines of Code (LoC)'],
        gridEnabled: false,
        gridLineColor: 'transparent',
        barColors: ['#A17FFF'],
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
			{ y: 'Process Paycheck', a: 22 },
			{ y: 'Process Payments', a: 11 },
			{ y: 'Inquire', a: 44 },
			{ y: 'makePayments', a: 4 },
			{ y: 'printChecks', a: 1 },
			{ y: 'getEmployeeDetails', a: 8 },
			{ y: 'updateEmployee', a: 34 }
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Lines of Code (LoC)'],
        gridEnabled: false,
        gridLineColor: 'transparent',
        barColors: ['#269700'],
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



