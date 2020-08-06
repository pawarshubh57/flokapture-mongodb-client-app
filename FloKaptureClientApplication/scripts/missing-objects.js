var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var prjctId = window.localStorage.getItem("prjctId");

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("userRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;

    $("#li_2").hover(function () {
        var secondTab = "Unique Missing Objects";
        $(this).css('cursor', 'pointer').attr('title', secondTab);

    }, function () {
        $(this).css('cursor', 'auto');
    });
});

$(document).ready(function () {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "Report/MissingObjectsReport?projectId=" + prjctId,
        success: function (data) {
            if (data !== "undefined") {
                var l = 1;
                for (var k = 0; k < data.length; k++) {
                    data[k].SrNo = l;
                    data[k].FileName = data[k].FileMaster.FileName;
                    data[k].ProjectName = data[k].ProjectMaster.ProjectName;
                    if (data[k].EntityName === "" || data[k].EntityName === null) data[k].EntityName = "-";
                    l++;
                }
                $("#tblMissingObjectsReport").ejGrid({
                    width: "100%",
                    dataSource: data,
                    allowPaging: true,
                    pageSettings: { pageSize: 20 },
                    allowSorting: true,
                    showHeader: false,
                    allowResizing: true,
                    allowResizeToFit: true,
                    toolbarSettings: {
                        showToolbar: true,
                        toolbarItems: [ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search]
                    },
                    columns: [
                        { field: "SrNo", headerText: "Sr#", width: "4%" },
                        { field: "Type", headerText: "Object Type", width: "6%" },
                        { field: "FileName", headerText: "Object Name", width: "10%" },
                        { field: "EntityName", headerText: "Entity Name", width: "10%" },
                        { field: "CalledObjectName", headerText: "Missing Object Name", width: "10%" },
                        { field: "FromObject", headerText: "From Object", width: "10%" },
                        { field: "Statement", headerText: "Statement", width: "20%" },
                        { field: "ProjectName", headerText: "Project", width: "10%" }
                    ],
                    toolbarClick: function (e) {
                        var gridObj = $("#tblMissingObjectsReport")[0];
                        if (e.itemName === "Excel Export") {
                            exportGrid(gridObj, "MissingObjects.xlsx");
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

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "Report/MissingDistinctObjectReport?projectId=" + prjctId,
        success: function (data) {
            drawTable(data, "distinctObjects");
        }
    });
});

function drawTable(data, tableName) {
    if (tableName === "distinctObjects") {
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i], tableName, '', (i + 1));
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, 'pointer', (j + 1));
        }
    }
}

function drawRow(rowData, tableName, css, srNo) {
    var row = $("<tr title='record_" + rowData.ProjectId + "' id='projectTr_" + rowData.ProjectId + "' />");
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.Type + " </td>"));
    row.append($("<td>" + rowData.CalledObjectName + " </td>"));
    $("#" + tableName).append(row);
}

function exportGrid(tableName, fileName) {
    $("#dvRpt")[0].style.display = "inline";
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
        FileName: fileName,
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
        data: { TableHeaders: htmlTable.Headers, FileName: htmlTable.FileName, HtmlTableRows: htmlTable.Rows },
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
