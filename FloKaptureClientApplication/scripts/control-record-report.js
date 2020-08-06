var baseAddress = $.fn.baseAddress();
var prjctId = window.localStorage.getItem("prjctId");

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("userRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});

$(document).ready(function () {
    $body.addClass("loading");
    var controlRecordReports = new ControlRecordReports();
    controlRecordReports.getAllActivities().done(function (res) {
        console.log(res);
        var srNo = 0;
        res.forEach(function (r) {
            r.SrNo = ++srNo;
        });
        $("#controlRecordRpt").ejGrid({
            width: "100%",
            dataSource: res,
            allowPaging: true,
            allowSearching: true,
            allowResizing: true,
            allowResizeToFit: true,
            allowSorting: true,
            allowMultiSorting: true,
            allowTextWrap: true,
            scrollSettings: { height: 500, frozenRows: 0 },
            pageSettings: { pageSize: 25 },
            toolbarSettings: {
                showToolbar: true,
                toolbarItems: [ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search]
            },
            allowScrolling: false,
            columns: [
                { field: "SrNo", headerText: "Sr#", width: "5%" },
                { field: "ObjectName", headerText: "Object Name", width: "15%" },
                { field: "ObjectType", headerText: "Object Type", width: "10%" },
                { field: "Statement", headerText: "Statement", width: "30%" },
                { field: "ControlRecord", headerText: "*Control Record", width: "20%" }
            ],
            toolbarClick: function (e) {
                var gridObj = document.getElementById("controlRecordRpt");
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj, "excel");
                    return false;
                }
                return true;
            }
        });
        $body.removeClass("loading");
    }).fail(function (err) {
        console.log(err);
        $body.removeClass("loading");
    });

});

var ControlRecordReports = function () {
    this.baseAddress = baseAddress;
};

ControlRecordReports.prototype = {
    getAllActivities: function () {
        return $.ajax({ type: "GET", url: baseAddress + "TestResult/ControlRecordUsageReport?projectId=" + prjctId + "&opt=SC" });
    }
};

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

function exportGrid(tableName) {
    $body.addClass("loading");
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);
    var rows = gridObj.model.dataSource;
    var tblData = $("#tblData");
    tblData.html("");

    var excelTable = "<table>";

    var tableHeaders = [];
    var excelRow = "<tr>";
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        tableHeaders.push(headerDetails.HeadersText[k]);
        excelRow += "<td>" + headerDetails.HeadersText[k] + "</td>";
    }
    excelRow += "</tr>";
    var htmlTable = {
        Rows: [],
        Headers: tableHeaders
    };
    for (var i = 0; i < rows.length; i++) {
        var row = [];
        excelRow += "<tr>";
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var fieldName = rows[i][field];
            row.push(fieldName);
            excelRow += "<td>" + fieldName + "</td>";
        }
        htmlTable.Rows.push({ RowCells: row });
        excelRow += "</tr>";
    }

    excelTable += excelRow + "</table>";
    var excelString = prepareExcelFile(excelTable, "ControlRecord");
    prepareAndDownloadExcel(excelString);
    $body.removeClass("loading");
}

var prepareAndDownloadExcel = function (excelFile) {
    $body.removeClass("loading");
    var element = document.createElement("a");
    // ReSharper disable once InconsistentNaming
    var fileBlob = new window.Blob([excelFile], { type: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml;charset=utf-8;" });
    var url = window.URL.createObjectURL(fileBlob);
    element.setAttribute("download", "ControlRecordsReport.xls");
    element.style.display = "none";
    element.href = url;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

var prepareExcelFile = function (excel, sheetName) {
    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://schemas.openxmlformats.org/package/2006/content-types\'>";
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += sheetName;
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<xf fontId='Calibri'></xf>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";
    return excelFile;
};
