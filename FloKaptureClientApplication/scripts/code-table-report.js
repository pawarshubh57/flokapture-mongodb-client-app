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
    var codeTableReports = new CodeTableReports();
    codeTableReports.getAllActivities().done(function (res) {
        console.log(res);
        var srNo = 0;
        res.forEach(function (r) {
            r.SrNo = ++srNo;
        });
        $("#codeTableRpt").ejGrid({
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
                { field: "ControlRecord", headerText: "*Table Record", width: "20%" }
            ],
            toolbarClick: function (e) {
                var gridObj = document.getElementById("codeTableRpt");
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

var CodeTableReports = function() {
    this.baseAddress = baseAddress;
};

CodeTableReports.prototype = {
    getAllActivities: function() {
        return $.ajax({ type: "GET", url: baseAddress + "TestResult/ControlRecordUsageReport?projectId=" + prjctId + "&opt=CT" });
    }
};
