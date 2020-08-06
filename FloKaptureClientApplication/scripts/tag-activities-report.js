var baseAddress = $.fn.baseAddress();
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
    var tagActivitiesReport = new TagActivitiesReport();
    tagActivitiesReport.getAllActivities().done(function (res) {
        console.log(res);
        var srNo = 0;
        res.forEach(function(r) { r.SrNo = ++srNo;
            r.UserName = r.UserMaster.UserName;
            r.ProjectName = r.ProjectMaster.ProjectName;
        });
        $("#tagActivitiesReport").ejGrid({
            width: "100%",
            dataSource: res,
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
                { field: "SrNo", headerText: "Sr#", width: "3%" },
                { field: "UserName", headerText: "User", width: "10%" },
                { field: "ProjectName", headerText: "Project", width: "10%" },
                { field: "ActivityDate", headerText: "Activity Date", width: "10%" },
                { field: "ActivityType", headerText: "Activity Type", width: "10%" }
            ],
            toolbarClick: function (e) {
                var gridObj = document.getElementById("tagActivitiesReport");
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj, "excel");
                    return false;
                }
                return true;
            }
        });
    }).fail(function (err) {
        console.log(err);
    });
});

var TagActivitiesReport = function () {
    this.baseAddress = baseAddress;
};
TagActivitiesReport.prototype = {
    getAllActivities: function () {
        return $.ajax({ type: "GET", url: baseAddress + "TagMaster/GetAllTagActivities" });
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
