var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
var prjctId = window.localStorage.getItem("prjctId");
var opt = getParameterByName("opt");

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
    document.getElementById("dvError").innerHTML = "";
    document.getElementById("divUserActivity").style.display = "none";
    document.getElementById("divSystemCrudActivity").style.display = "none";
    if (prjctId === 0 || prjctId === "0" || prjctId === null || typeof prjctId === "undefined") {
        document.getElementById("dvError").innerHTML = "Please select project for report from main dashboard page!";
        return false;
    }
    if (opt === "1") {
        $body.addClass("loading");
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "Report/GetAllCrudActivity?ProjectId=" + prjctId,
            success: function (result) {
                document.getElementById("divUserActivity").style.display = "inline";
                if (result !== null && typeof result !== "undefined") {
                    var l = 1;
                    for (var k = 0; k < result.length; k++) {
                        result[k].SrNo = l;
                        l++;
                    }
                    $("#tblCrudActivityReport")
                        .ejGrid({
                            width: "100%",
                            dataSource: result,
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
                                { field: "EntityName", headerText: "Entity Name", width: "12%" },
                                { field: "AttributeNumber", headerText: "Attribute Number", width: "12%" },
                                { field: "AttributeName", headerText: "Attribute Name", width: "22%" },
                                { field: "AttributeDescription", headerText: "Description", width: "27%" },
                                { field: "ObjectName", headerText: "Object Name", width: "10%" },
                                { field: "ObjectType", headerText: "Object Type", width: "8%" }
                            ],
                            toolbarClick: function (e) {
                                var gridObj = $("#tblCrudActivityReport")[0];
                                if (e.itemName === "Excel Export") {
                                    exportGrid(gridObj, "CRUDActivity.xlsx");
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
                $body.removeClass("loading");
            }
        });
    }
    else if (opt === "2") {
        $body.addClass("loading");
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "Report/SystemLevelCrudActivity?ProjectId=" + prjctId,
            success: function (result) {
                document.getElementById("divSystemCrudActivity").style.display = "inline";
                if (typeof result !== "undefined" && result !== null) {
                    var l = 1;
                    for (var k = 0; k < result.length; k++) {
                        result[k].SrNo = l;
                        result[k].FileName = result[k].FileMaster.FileName;
                        result[k].FileType = result[k].FileMaster.FileTypeExtensionReference.FileTypeName;
                        result[k].OpenStatement = result[k].OpenStatement.replace("<<", "&lt;&lt;").replace(">>", "&gt;&gt;");
                        l++;
                    }
                    $("#tblSystemCrudActivityRpt").ejGrid({
                        width: "100%",
                        dataSource: result,
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
                            // { field: "HasIndicator", headerText: "HasIndicator", visible: false },
                            { field: "SrNo", headerText: "Sr#", width: "5%" },
                            { field: "EntityName", headerText: "Entity Name", width: "12%" },
                            { field: "ReferenceObjectName", headerText: "Ref. Object", width: "8%" },
                            { field: "InsertOrCreate", headerText: "Create", width: "8%" },
                            { field: "SelectOrRead", headerText: "Read", width: "8%" },
                            { field: "Update", headerText: "Update", width: "8%" },
                            { field: "Delete", headerText: "Delete", width: "8%" },
                            { field: "OpenStatement", headerText: "Statement", width: "23%" },
                            { field: "FileName", headerText: "Object Name", width: "10%" },
                            { field: "FileType", headerText: "Object Type", width: "10%" }
                        ],
                        toolbarClick: function (e) {
                            var gridObj = $("#tblSystemCrudActivityRpt")[0];
                            if (e.itemName === "Excel Export") {
                                exportGrid(gridObj, "SystemLevelCRUDActivity.xlsx");
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
                        },
                        rowDataBound: function (args) {
                            if (args.data.HasIndicator)
                                args.row.css("backgroundColor", "#ea7f7f").css("color", "black");
                        }
                    });
                }
                $body.removeClass("loading");
            }
        });
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