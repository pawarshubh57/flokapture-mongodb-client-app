var baseAddress = $.fn.baseAddress();
// $.fn.getLicenseDetails("no");
var userId = window.localStorage.getItem("userId");
var option = getParameterByName("opt");
var prjctId = window.localStorage.getItem("prjctId");
var projectIdList = window.localStorage.getItem("projectIds");
var objName = "";
var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("userRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
    $("#mainnav-menu").metisMenu();
});

$(document).ready(function () {
    coverageReport();
    /*
    fillProjectDropDown();
    $("#btnshow").click(function () {
        coverageReport();
    });
    */
    if (option === "1") {
        document.getElementById("divCheckbox").style.display = "inline";
        $("#reportName")[0].innerHTML = "Inventory Report";
    }
    else if (option === "2") {
        $("#reportName")[0].innerHTML = "Progress Report ";
    }
    else if (option === "3") {
        $("#reportName")[0].innerHTML = "Workflows by Project Report";
    } else {
        $("#reportName")[0].innerHTML = "";
    }
});

function callSkipSame() {
    coverageReport();
}

function coverageReport() {
    var projectId = prjctId; // $("#ddlProjectType").val(); todo
    if (option === "1") {
        $("#reportName")[0].innerHTML = "Inventory Report";
        var skipSame = document.getElementById("chkSkipSame").checked;
        var businessName = document.getElementById("chkBusinessSame").checked;
        var langauageId;

        jQuery.ajax({
            type: "GET",
            url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId,
            success: function (projectDetails) {
                if (projectDetails != null) {
                    langauageId = projectDetails.LanguageId;
                    jQuery.ajax({
                        type: "GET",
                        url: baseAddress + "Report/GetAllInventoryReports?projectId=" + projectId +
                            "&skipSame=" + skipSame + "&businessName=" + businessName,
                        success: function (result) {
                            var data = result;
                            if (data != null) {
                                var l = 1;
                                for (var k = 0; k < data.length; k++) {
                                    data[k].SrNo = l;
                                    l++;
                                }
                                inventoryForAccess(langauageId, data);
                                $("#divInventoryReport")[0].style.visibility = "visible";
                            }
                        }
                    });
                }
            }
        });

    } else if (option === "2") {
        $("#reportName")[0].innerHTML = "Progress Report ";

        jQuery.ajax({
            type: "GET",
            url: baseAddress + "Report/GetAllActionWorkflowActivity?projectId=" + projectId,
            success: function (result) {
                var data = result;
                if (data != null) {
                    var l = 1;
                    for (var k = 0; k < data.length; k++) {
                        data[k].SrNo = l;
                        data[k].WorkflowName = data[k].ActionWorkflows.TechnicalAndBusinessName;
                        data[k].OriginObject = data[k].ActionWorkflows.OriginObject;
                        l++;
                    }
                    $("#tblCoverageReport")
                        .ejGrid({
                            width: "100%",
                            dataSource: data,
                            allowPaging: true,
                            allowSearching: true,
                            allowResizing: true,
                            allowResizeToFit: true,
                            scrollSettings: { height: 500, frozenRows: 0 },
                            pageSettings: { pageSize: 20 },
                            toolbarSettings: {
                                showToolbar: true,
                                toolbarItems: [
                                    ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                                ]

                            },
                            allowScrolling: false,
                            columns: [
                                { field: "SrNo", headerText: "Sr#", width: "5%" },
                                { field: "OriginObject", headerText: "Origin Object", width: "25%" },
                                { field: "WorkflowName", headerText: "Workflow Name", width: "30%" },
                                { field: "BusinessFunction", headerText: "Business Function", width: "15%" },
                                { field: "Annotation", headerText: "Annotation", width: "15%" },
                                { field: "DeactivateStatement", headerText: "Deactivated Statement", width: "15%" }
                            ],
                            toolbarClick: function (e) {
                                var gridObj = $("#tblCoverageReport")[0];
                                if (e.itemName === "Excel Export") {
                                    exportGrid(gridObj);
                                    return false;
                                }
                                return true;
                            },
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            }
                        });
                    return true;
                }
                return true;
            }
        });
        $.ajaxSetup({
            async: false
        });
        $.get(baseAddress + "ProjectMaster/GetAllDashBoardCoverage?projectId=" + projectId + "", function (data) {
            var sampleData = [];
            var workflows = data.Charts[0].data;
            for (var i = 1; i < data.Charts.length; i++) {
                sampleData.push(data.Charts[i]);
            }
            var settings = {
                title: "Workflow(s) summary",
                description: "Total Workflow(s): " + data.Charts[0].data,
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
            // setup the chart
            $('#barAppCoverageDashboard').jqxChart(settings);
        });

        $("#divCoverageReport")[0].style.visibility = "visible";

    } else if (option === "3") {
        $("#reportName")[0].innerHTML = "Workflows by Project Report";
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "Report/GetAllWorksProjectReport?projectId=" + projectId,
            success: function (result) {
                var data = result;
                if (data != null) {
                    var l = 1;
                    for (var k = 0; k < data.length; k++) {
                        data[k].SrNo = l;
                        l++;
                    }
                    $("#tblWorkflowProjectReport")
                        .ejGrid({
                            width: "100%",
                            dataSource: data,
                            allowPaging: true,
                            allowSearching: true,
                            allowResizing: true,
                            allowResizeToFit: true,
                            scrollSettings: { height: 500, frozenRows: 0 },
                            pageSettings: { pageSize: 20 },
                            toolbarSettings: {
                                showToolbar: true,
                                toolbarItems: [ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search]
                            },
                            allowScrolling: false,
                            columns: [
                                { field: "SrNo", headerText: "Sr#", width: "4%" },
                                { field: "OriginObject", headerText: "Origin Object", width: "20%" },
                                { field: "TechnicalAndBusinessName", headerText: "Workflow Name", width: "30%" },
                                // { field: "TechnicalName", headerText: "Technical Starting Point", width: "20%" },
                                { field: "LoC", headerText: "LoC", width: "6%" },
                                { field: "Mcc", headerText: "MCC", width: "6%" },
                                { field: "TotalBusinessRules", headerText: "B. Function", width: "6%" },
                                { field: "TotalDeactivated", headerText: "Deactivated", width: "9%" },
                                { field: "TotalAnnotations", headerText: "Annotated", width: "9%" }
                            ],
                            toolbarClick: function (e) {
                                var gridObj = $("#tblWorkflowProjectReport")[0];
                                if (e.itemName === "Excel Export") {
                                    exportGrid(gridObj, 'excel');
                                    return false;
                                }
                                return true;
                            },
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            }
                        });
                }
            }
        });
        $("#divWorkflowProjectReport")[0].style.visibility = "visible";
    }
}

function inventoryForAccess(languageId, data) {
    var projectId = $("#ddlProjectType").val();
    var skipSame = document.getElementById("chkSkipSame").checked;
    var businessName = document.getElementById("chkBusinessSame").checked;
    if (languageId === 6) {
        $("#tblInventoryReport")
            .ejGrid({
                width: "100%",
                dataSource: data,
                allowPaging: true,
                allowSearching: true,
                scrollSettings: { height: 500, frozenRows: 0 },
                allowResizing: true,
                allowResizeToFit: true,
                pageSettings: { pageSize: 20 },
                toolbarSettings: {
                    showToolbar: true,
                    toolbarItems: [
                        ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                    ]
                },
                allowScrolling: false,
                columns: [
                    { field: "SrNo", headerText: "Sr#", width: "3%" },
                    { field: "ObjectName", headerText: "Object Name", width: "12%" },
                    { field: "ExtenstionType", headerText: "Type", width: "4%" },
                    { field: "Loc", headerText: "LoC", width: "5%" },
                    { field: "Complexity", headerText: "Complexity", width: "4%" },
                    { field: "ExternalCall", headerText: "External Call", width: "7%" },
                    // { field: "InternalCall", headerText: "Internal Call", width: "7%" },
                    { field: "CalledFrom", headerText: "Called From", width: "8%" },
                    { field: "UsesEntities", headerText: "Uses Entities", width: "8%" },
                    { field: "UsesQueries", headerText: "Uses Queries", width: "8%" },
                    { field: "UsesReports", headerText: "Uses Reports", width: "8%" },
                    //  { field: "UsesObjects", headerText: "Uses Objects", width: "8%" },
                    { field: "ParticipateInWorkflow", headerText: "Paricipate In Workflow", width: "11%" },
                    { field: "Description", headerText: "Description", width: "13%" },
                    { field: "UploadedDocuments", headerText: "Uploaded Documents", width: "13%" }
                ],
                toolbarClick: function (e) {
                    //var gridObj = $("#tblInventoryReport")[0];
                    if (e.itemName === "Excel Export") {
                        downloadInventoryForReport(projectId, skipSame, businessName);
                        // exportGrid(gridObj);
                        return false;
                    }
                    return true;
                },
                queryCellInfo: function (args) {
                    $(args.cell)
                        .attr({
                            "data-toggle": "tooltip",
                            "data-container": "body",
                            "title": args.data[args.column.field]
                        });
                }
            });
    } else {
        $("#tblInventoryReport")
            .ejGrid({
                width: "100%",
                dataSource: data,
                allowPaging: true,
                allowSearching: true,
                scrollSettings: { height: 500, frozenRows: 0 },
                allowResizing: true,
                allowResizeToFit: true,
                pageSettings: { pageSize: 20 },
                toolbarSettings: {
                    showToolbar: true,
                    toolbarItems: [
                        ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                    ]
                },
                allowScrolling: false,
                columns: [
                    { field: "SrNo", headerText: "Sr#", width: "3%" },
                    { field: "ObjectName", headerText: "Object Name", width: "10%" },
                    { field: "ExtenstionType", headerText: "Type", width: "4%" },
                    { field: "Loc", headerText: "LoC", width: "4%" },
                    { field: "Complexity", headerText: "Complexity", width: "4%" },
                    { field: "ExternalCall", headerText: "External Call", width: "7%" },
                    // { field: "InternalCall", headerText: "Internal Call", width: "6%" },
                    { field: "CalledFrom", headerText: "Called From", width: "8%" },
                    { field: "UsesEntities", headerText: "Uses Entities", width: "7%" },
                    { field: "ParticipateInWorkflow", headerText: "Paricipate In Workflow", width: "10%" },
                    { field: "Description", headerText: "Description", width: "6%" },
                    { field: "Tags", headerText: "Tags", width: "13%" },
                    { field: "UploadedDocuments", headerText: "Uploaded Documents", width: "13%" }
                ],
                toolbarClick: function (e) {
                    // var gridObj = $("#tblInventoryReport")[0];
                    if (e.itemName === "Excel Export") {
                        // exportGrid(gridObj);
                        downloadInventoryForReport(projectId, skipSame, businessName);
                        return false;
                    }
                    return true;
                },
                queryCellInfo: function (args) {
                    $(args.cell)
                        .attr({
                            "data-toggle": "tooltip",
                            "data-container": "body",
                            "title": args.data[args.column.field]
                        });
                }
            });
    }
}


function showData(dvCtrl) {
    $("#dvData").html(dvCtrl.innerHTML);
    objName = dvCtrl.title;

    $("#ViewDataHeader").html("Document(s) Uploaded for object " + objName);
    // Log this action...
    var desc = $("#ViewDataHeader").html();
    var audit = {
        postData: {
            OptionUsed: "Inventory Details",
            PrimaryScreen: "Inventory Details",
            UserId: userId,
            ProjectId: $("#ddlProjectType").val(),
            BriefDescription: "Viewed: <b>" + desc + "</b>"
        }
    };
    $.fn.auditActionLog(audit).then(function (d) {
        console.log(d);
        $("#viewData").modal("show");
        // $('#tblInventoryReport').jqxGrid('selectrow', -1);
    }).catch(function (e) {
        console.log(e);
    });
    return false;
}

function fillProjectDropDown() {
    if (prjctId !== 0) {
        $("#btnshow").click();
    }
}
/*
function fillProjectDropDown() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "General/GetEntity?entity=ProjectMaster",
        success: function (result) {
            $("#ddlProjectType").append("<option value=" + 0 + "> Select</option>");

            $.each(result,
                function (key, value) {
                    if (projectIdList.match(new RegExp("(?:^|,)" + value.Value + "(?:,|$)"))) {
                        $("#ddlProjectType").append("<option value=" + value.Value + ">" + value.Name + "</option>");
                    }
                });
            $('#ddlProjectType').ejDropDownList({
                showCheckbox: false,
                width: 320,
                height: 29,
                value: prjctId
            });
            if (prjctId !== 0) {
                $("#btnshow").click();
            }
        }
    });
};
*/

function getTableHeaderProperties(tblModel) {
    var tblColumns = tblModel.columns;
    var headerDetails = {};
    var headerFields = [];
    var headersText = [];
    for (var k = 0; k < tblColumns.length; k++) {
        headerFields.push(tblColumns[k].field);
        headersText.push(tblColumns[k].headerText);
    }
    headerDetails["HeaderFields"] = headerFields;
    headerDetails["HeadersText"] = headersText;
    return headerDetails;
}

/*
function exportGrid(tableName) {
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);
    var rows = gridObj.model.dataSource;
    var tblData = $("#tblData");
    tblData.html("");
    var headerRow = $("<tr />");
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        var cell = $("<td style='font-weight: bold;'>" + headerDetails.HeadersText[k] + "</td>");
        headerRow.append(cell);
    }

    tblData.append(headerRow);
    for (var i = 0; i < rows.length; i++) {
        var dataRow = $("<tr />");
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var fieldName = rows[i][field];
            var dataCell = $("<td>" + fieldName + "</td>");
            dataRow.append(dataCell);
        }
        tblData.append(dataRow);
    }
    $("#tblData").excelExport({ type: 'excel', escape: 'false', htmlContent: 'true', fileName: "Report.xlsx" });
}
*/

function exportGrid(tableName) {
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);
    var rows = gridObj.model.dataSource;
    var tblData = $("#tblData");
    tblData.html("");
    var tableHeaders = [];
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        tableHeaders.push(headerDetails.HeadersText[k]);
    }
    var htmlTable = {
        Rows: [],
        Headers: tableHeaders
    };
    for (var i = 0; i < rows.length; i++) {
        var row = [];
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var fieldName = rows[i][field];
            row.push(fieldName);
        }
        htmlTable.Rows.push({ RowCells: row });
    }
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "FileObjectMethodReference/ExportToExcelFromData",
        data: { TableHeaders: htmlTable.Headers, HtmlTableRows: htmlTable.Rows },
        success: function (path) {
            var element = document.createElement('a');
            element.href = path;
            element.target = "_blank";
            window.open(path, "_self");
            $body.removeClass("loading");
        },
        error: function () {
            $body.removeClass("loading");
        }
    });
}

function downloadInventoryForReport(projectId, skipSame, businessName) {
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/ExportInventoryToExcel?projectId=" + parseInt(projectId) + "&skipSame=" + skipSame + "&businessName=" + businessName,
        type: 'GET',
        contentType: "application/xlsx; charset=utf-8",
        headers: "Content-Type: application/xlsx",
        success: function (data) {
            downloadFile(data);
        }
    });
}

function downloadFile(path) {
    var element = document.getElementById("a123456");
    element.href = path;
    element.target = "_blank";
    window.open(path, "_self");
}

/*
function downloadFile(path) {
    var element = document.createElement("a");
    element.setAttribute("href", path);
    element.setAttribute("download", "WorkflowByProjectReport.xls");
    element.target = "_blank";
    document.body.appendChild(element);
    element.click();
}
*/

function projectWorkspace() {
    location.href = "projects_workspace.html?pid=" + prjctId;
}