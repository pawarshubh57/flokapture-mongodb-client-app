var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectId = getParameterByName("prjId");

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    $("#divDatabaseSchema").html("");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ViewDataBaseSchema/GetViewDatabaseSchema?projectId=" + projectId,
        success: function (entryPoints) {
            if (entryPoints != null) {
                $("#divDatabaseSchema").ejGrid({
                    width: "99%",
                    dataSource: entryPoints,
                    allowPaging: true,
                    pageSettings: { pageSize: 20 },
                    allowSorting: true,
                    showHeader: false,
                    allowResizing: true,
                    allowResizeToFit: true,
                    toolbarSettings: {
                        showToolbar: true,
                        toolbarItems: [
                            ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                        ]
                    },
                    columns: [
                        { field: "RowId", headerText: "Sr#", width: "5%" },
                        { field: "EntityName", headerText: "Entity Name", width: "15%" },
                        { field: "FieldNo", headerText: " Attribute Number", width: "10%" },
                        { field: "FieldName", headerText: "Attribute Name", width: "20%" },
                        { field: "Length", headerText: "Length", width: "7%" },
                        { field: "DataType", headerText: "Data Type", width: "15%" },
                        { field: "Description", headerText: "Description", width: "25%" }
                    ],
                    toolbarClick: function (e) {
                        var gridObj = $("#divDatabaseSchema")[0];
                        if (e.itemName === "Excel Export") {
                            exportGrid(gridObj, "DbSchema.xlsx");
                            return false;
                        }
                        return true;
                    },
                });
            }
            var gridObj = $("#divDatabaseSchema").data("ejGrid");
            gridObj.refreshContent(); // Refreshes the grid contents only
            gridObj.refreshContent(true); // Refreshes the template and grid contents

        }
    });

});

function exportGrid(tableName,fileName) {
    $("#dvRpt")[0].style.display = "inline";
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);
    var rows = gridObj.model.dataSource;
    var tblData = $("#tblData");
    tblData.html("");
    var tableHeaders = [];
    // var headerRow = $("<tr />");
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        tableHeaders.push(headerDetails.HeadersText[k]);
        // var cell = $("<td style='font-weight: bold;'>" + headerDetails.HeadersText[k] + "</td>");
        // headerRow.append(cell);
    }
    // tblData.append(headerRow);

    var htmlTable = {
        FileName: fileName,
        Rows: [],
        Headers: tableHeaders
    };
    // htmlTable.Rows[index].push(pString);
    for (var i = 0; i < rows.length; i++) {
        // var dataRow = $("<tr />");
        var row = [];
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var fieldName = rows[i][field];
            row.push(fieldName);
            // var dataCell = $("<td>" + fieldName + "</td>");
            // dataRow.append(dataCell);
        }
        htmlTable.Rows.push({ RowCells: row });
        // tblData.append(dataRow);
        // if (i >= 600) break;
    }
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "FileObjectMethodReference/ExportToExcelFromData",
        data: { TableHeaders: htmlTable.Headers, FileName:htmlTable.FileName, HtmlTableRows: htmlTable.Rows },
        success: function (path) {
            var element = document.createElement('a');
            element.href = path;
            element.target = "_blank";
            window.open(path, "_self");
            $body.removeClass("loading");
        },
        error: function() {
            $body.removeClass("loading");
        }
    });
    /*
    $("#tblData").excelExport({ type: 'excel', escape: 'false', htmlContent: 'true', fileName: "Report.xlsx" });
    $("#dvRpt")[0].style.display = "none";
    */
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