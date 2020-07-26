
var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
window.localStorage.setItem("prjctId", 0);

$body = $("body");

$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("landingRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});

$(document).ready(function () {
    tickersBinds();
    bindProjectTable();
    loadDataForGraph();
    $("#ddlProjectType").click(workProduct);
});

var tickersBinds = function () {
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectTickersCount?projectId=" + projectIdList,
        success: function (tickerCount) {
            if (tickerCount !== null) {
                const t = tickerCount;
                $("#pClassesScreens")[0].innerHTML = t.NoOfClsses; //+ " / " + t.NoOfScreens;
                $("#pNoOfPackgesLines")[0].innerHTML = t.NoOfLines;
                $("#pNoOfActionWorkflows")[0].innerHTML = t.NoOfWorkflows; // + " / ";
                $("#pNoOfEntities")[0].innerHTML = t.NoOfEntities + " / " + t.NoOfAttributes;
                $("#cntBusinessFunctions")[0].innerHTML = (t.NoOfBusinessFuns && t.NoOfBusinessFuns) === 0 ? "0" : t.NoOfBusinessFuns;;
                $("#pNoOfTags")[0].innerHTML = t.NoOfTags === 0 ? "0" : t.NoOfTags;
                $("#pNoOfAnnotation")[0].innerHTML = t.NoOfAnnotation === 0 ? "0" : t.NoOfAnnotation;
                $("#pNoOfDeactivated")[0].innerHTML = t.NoOfDeavtivate === 0 ? "0" : t.NoOfDeavtivate;
                $body.removeClass("loading");
            }
        }
    });
};

var bindProjectTable = function () {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/Get?projectsIds=" + projectIdList,
        success: function (data) {
            if (data !== null) {
                drawTable(data, "tblAllProjects");
            }
        }
    });
};

function loadDataForGraph() {
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        // url: baseAddress + "General/GetNameValue?entity=ProjectMaster&id=0&pids=" + projectIdList + "",
        url: baseAddress + "ProjectMaster/GetAllProjects?projectId=" + projectIdList,
        success: function (result) {
            if (result != null) {
                $.each(result, function (i, p) {
                    $("#ddlProjectType").append(`<option value=${p.ProjectId}>${p.ProjectName}</option>`);
                });
                workProduct();
            }
        }
    });

    $.get(baseAddress + "ProjectMaster/GetApplicationPieChart?projectId=" + projectIdList + "&opt=opt", function (data) {
        if (typeof data !== "undefined") {
            // ReSharper disable once QualifiedExpressionMaybeNull
            // ReSharper disable once PossiblyUnassignedProperty
            const dataSet = data;

            // ReSharper disable once QualifiedExpressionMaybeNull
            $.plot($("#demo-flot-donutApp"), dataSet.Charts, {
                series: { pie: { show: true } },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 0,
                        y: 0
                    },
                    defaultTheme: true
                }
            });

            // ReSharper disable once QualifiedExpressionMaybeNull
            var dtTable = data.Charts;
            window.Morris.Bar({
                element: "demo-morris-barApp123",
                data: data.Charts,
                xkey: "label",
                ykeys: ["data"],
                labels: ["Count"],
                gridEnabled: true,
                gridLineColor: "transparent",
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable.length; i++) {
                        if (dtTable[i].label !== row.label) {
                            continue;
                        } else {
                            clr = dtTable[i].color;
                        }
                    }
                    return clr;
                },
                resize: true,
                hideHover: "auto"
            });
        }
    });

    $.get(baseAddress + "ProjectMaster/GetApplicationLOCChart?projectId=" + projectId + "&opt=opt", function (data2) {
        if (data2 !== null) {
            var dataSet2 = data2;
            // ReSharper disable once QualifiedExpressionMaybeNull
            var dtTable = data2.Charts;
            window.Morris.Bar({
                element: 'demo-morris-barAppLOC',
                data: dataSet2.Charts,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['Lines of Code (LoC)'],
                gridEnabled: false,
                gridLineColor: 'transparent',
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable.length; i++) {
                        if (dtTable[i].label !== row.label) {
                            continue;
                        } else {
                            clr = dtTable[i].color;
                        }
                    }
                    return clr;
                },
                resize: true,
                hideHover: 'auto'
            });
            $.plot($("#demo-morris-barAppActionWorkFlow"), dataSet2.Charts, {
                series: {
                    pie: {
                        show: true
                    }
                },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 0,
                        y: 0
                    },
                    defaultTheme: true
                }
            });
        }
    });
}

var workProduct = function () {
    $.ajaxSetup({
        async: false
    });
    var prjId = $("#ddlProjectType").val();
    prjId = prjId || 0;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetAllDashBoardCoverage?projectId=" + prjId,
        success: function (data) {
            var sampleData = [];
            var workflows = data.Charts[0].data;
            for (var i = 1; i < data.Charts.length; i++) {
                sampleData.push(data.Charts[i]);
            }
            var settings = {
                title: "Workflow(s) summary",
                description: "Total WorkFlows: " + data.Charts[0].data,
                showLegend: true,
                enableAnimations: true,
                padding: { left: 1, top: 1, right: 1, bottom: 1 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: sampleData,
                xAxis:
                {
                    unitInterval: 1,
                    dataField: 'label',
                    gridLines: { visible: true },
                    flip: false
                },
                valueAxis:
                {
                    unitInterval: workflows / 10,
                    minValue: 0,
                    maxValue: workflows,
                    flip: true,
                    labels: {
                        visible: true
                    }
                },
                colorScheme: 'scheme01',
                seriesGroups:
                    [
                        {
                            type: 'column',
                            orientation: 'horizontal',
                            columnsGapPercent: 50,
                            toolTipFormatSettings: { thousandsSeparator: ',' },
                            series: [
                                { dataField: 'data', displayText: 'Percentage(%)' }
                            ]
                        }
                    ]
            };
            $('#barAppCoverageDashboard').jqxChart(settings);
        }
    });
};

function drawTable(data, tableName) {
    if (tableName === "tblAllProjects") {
        for (let i = 0; i < data.length; i++) {
            drawRow(data[i], tableName, i + 1);
        }
    } else {
        for (let j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, j + 1);
        }
    }
}

function drawRow(rowData, tableName, srNo) {
    var row = $("<tr title='record_" + rowData.ProjectId + "' id='projectTr_" + rowData.ProjectId + "' />");
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.ProjectName + " </td>"));
    row.append($("<td>" + rowData.LanguageMaster.LanguageName + " </td>"));
    row.append($("<td>" + rowData.TotalFiles + " </td>"));
    row.append($("<td>" + Math.round(rowData.ProjectSize) + " MB </td>"));
    row.append($("<td>" + rowData.UploadedDate + " </td>"));
    row.append($("<td>" + rowData.ProcessedDate + " </td>"));
    row.append($("<td><a href='#' onclick='setLocalStorage(" + rowData.ProjectId + ", " + rowData.LanguageMaster.LanguageId + ",\""+rowData.ProjectName+"\");'><button class='btn btn-mint'>Load</button></a></td>"));
    $("#" + tableName).append(row);
}

var setLocalStorage = function (prjId, languageId, projectName) {
    window.localStorage.setItem("prjctId", prjId);
    window.localStorage.setItem("gridPageNumber", 1);
    window.localStorage.setItem("languageId", languageId);
    window.localStorage.setItem("projectName", projectName);
    window.location = "projects_workspace.html?pid=" + prjId;
    /*
    $.fn.actionAuditLog(userId, 'Project Load', prjId).then(function () {
        window.localStorage.setItem("prjctId", prjId);
        window.localStorage.setItem("gridPageNumber", 1);
        window.localStorage.setItem("languageId", languageId);
        window.localStorage.setItem("projectName", projectName);
        window.location = "projects_workspace.html?pid=" + prjId;
    }).catch(function (e) {
        console.log(e);
    });
    */
};