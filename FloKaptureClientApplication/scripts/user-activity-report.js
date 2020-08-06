var baseAddress = $.fn.baseAddress();
var option = getParameterByName("opt");
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
var prjctId = window.localStorage.getItem("prjctId");

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var menu = option === "2" ? "userRoleMenu" : "landingRoleMenu";
    var finalMeunBar = window.localStorage.getItem(menu);
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
    $("#mainnav-menu").metisMenu();
});

$(document).ready(function () {
    document.getElementById("divUserActivity").style.display = "none";
    document.getElementById("divMissingEnt").style.display = "none";
    if (option === "1") {
        document.getElementById("divUserActivity").style.display = "inline";
        document.getElementById("divMissingEnt").style.display = "none";
        $("#txtFromDate").ejDatePicker({ width: "100%", dateFormat: "MM/dd/yyyy", maxDate: new Date(Date.now()), value: new Date() });
        $("#txtToDate").ejDatePicker({ width: "100%", dateFormat: "MM/dd/yyyy", maxDate: new Date(Date.now()), value: new Date() });
        $("#btnViewReport").click(function () {
            var fDate = $("#txtFromDate").val();
            var tDate = $("#txtToDate").val();
            var error = document.getElementById("tdError");
            if ($("#txtFromDate").val() === "") {
                error.innerHTML = "Please select From Date";
                $("#txtFromDate").focus();
                $("#txtFromDate").css("border-color", "red");
                $("#txtFromDate").on("keypress", function () {
                    $(this).css("border-color", "");
                });
                return false;
            }
            if ($("#txtToDate").val() === "") {
                error.innerHTML = "Please select To Date";
                $("#txtToDate").focus();
                $("#txtToDate").css("border-color", "red");
                $("#txtToDate").on("keypress", function () {
                    $(this).css("border-color", "");
                });
                return false;
            }
            jQuery.ajax({
                type: "GET",
                url: baseAddress + "Report/GetAllUserActivityReport?fromDate=" + fDate + "&toDate=" + tDate,
                success: function (result) {
                    if (typeof result !== "undefined" && result !== null) {
                        var data = result;
                        var l = 1;
                        for (var k = 0; k < data.length; k++) {
                            data[k].SrNo = l; l++;
                            data[k].Description = data[k].OptionUsed;
                            if (data[k].BriefDescription !== "")
                                data[k].Description = data[k].OptionUsed + " | " + data[k].BriefDescription;
                        }
                        $("#tblUserActivityReport")
                            .ejGrid({
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
                                    toolbarItems: [
                                        ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                                    ]
                                },
                                columns: [
                                    { field: "SrNo", headerText: "Sr#", width: "4%" },
                                    { field: "UserName", headerText: "User", width: "6%" },
                                    { field: "ContactName", headerText: "Contact Name", width: "13%" },
                                    { field: "Description", headerText: "Event Name | Description", width: "38%" },
                                    { field: "AuditDate", headerText: "Date", width: "8%" },
                                    { field: "Time", headerText: "Time", format: "{0:hh:mm:ss}", type: "date", width: "6%" },
                                    { field: "ClientName", headerText: "Client Name", width: "8%" },
                                    { field: "ProjectName", headerText: "Project Name", width: "10%" },
                                    { field: "LanguageName", headerText: "Language", width: "7%" }
                                ],
                                toolbarClick: function (e) {
                                    var gridObj = $("#tblUserActivityReport")[0];
                                    if (e.itemName === "Excel Export") {
                                        exportGrid(gridObj, "UserActivityAudit.xlsx");
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
        });
    }
    if (option === "2") {
        document.getElementById("divUserActivity").style.display = "none";
        document.getElementById("divMissingEnt").style.display = "inline";
        // fillProjectDropDown(); todo
        // $("#btnshow").click(function () {  
            jQuery.ajax({
                type: "GET",
                url: baseAddress + "Report/GetAllMissingEntities?projectId=" + prjctId,
                success: function (entryPoints) {
                    if (entryPoints !== null) {
                        $("#tblMissingEntitiesReport").ejGrid({
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
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                { field: "EntityName", headerText: "Entity Name", width: "15%" },
                                { field: "FieldNo", headerText: "Attribute Number", width: "10%" },
                                { field: "FieldName", headerText: "Attribute Name", width: "20%" },
                                { field: "Length", headerText: "Length", width: "7%" },
                                { field: "DataType", headerText: "Data Type", width: "18%" },
                                { field: "Description", headerText: "Description", width: "25%" }
                            ],
                            toolbarClick: function (e) {
                                var gridObj = $("#tblMissingEntitiesReport")[0];
                                if (e.itemName === "Excel Export") {
                                    exportGrid(gridObj, "UnusedAttributes.xlsx");
                                    return false;
                                }
                                return true;
                            },
                        });
                    }
                    var gridObj = $("#tblMissingEntitiesReport").data("ejGrid");
                    gridObj.refreshContent(); // Refreshes the grid contents only
                    gridObj.refreshContent(true); // Refreshes the template and grid contents

                }
            });
        // });
    }
});


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
/* todo
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
            if (prjctId !== 0 && prjctId !== "0") {
                $("#btnshow").click();
            }
        }
    });
};
*/