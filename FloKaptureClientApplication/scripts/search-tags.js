var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
var selectedProjectList = window.localStorage.getItem("selectedProjectIds") || [];
var prjctId = window.localStorage.getItem("prjctId");

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    $("#chkTags").on("change", {}, function () {
        if ($("#chkTags").is(":checked")) {
            $("#txtSearchKeywords").removeAttr("disabled");
            $("#ddlTags").jqxDropDownList({ disabled: false });
            $("#ddlTagCategories").jqxDropDownList({ disabled: false });
            $("#ddlTagCategoryValues").jqxDropDownList({ disabled: false });
        } else {
            $("#txtSearchKeywords").attr("disabled", "disabled");
            $("#ddlTags").jqxDropDownList({ disabled: true });
            $("#ddlTagCategories").jqxDropDownList({ disabled: true });
            $("#ddlTagCategoryValues").jqxDropDownList({ disabled: true });
        }
    });

    $("#ddlTagCategories").jqxDropDownList({
        source: [{
            TagCategoryMasterId: "0",
            TagCategoryName: "Select Category"
        }],
        width: 200,
        height: 24,
        displayMember: "TagCategoryName",
        valueMember: "TagCategoryMasterId"
    });

    $("#ddlTagCategoryValues").jqxDropDownList({
        source: [{
            TagCategoryValuesId: "0",
            TagCategoryValue: "Select Value"
        }],
        width: 200,
        height: 24,
        displayMember: "TagCategoryValue",
        valueMember: "TagCategoryValuesId"
    });

    fillProjectDropDown();

    getTagCategoryMaster();

    fillObjects();

    $("#btnTagsGo").click(function () {
        var checkedItems = $("#ddlTags").jqxDropDownList("getCheckedItems");
        var tagIds = [];
        checkedItems.forEach(function (item) {
            var id = item.originalItem.TagsMasterId;
            tagIds.push(id);
        });
        fillTagCategories(tagIds.join(","));
    });

    $("#btnCategoryGo").click(function () {
        var checkedItems = $("#ddlTagCategories").jqxDropDownList("getCheckedItems");
        var tagCategoryIds = [];
        checkedItems.forEach(function (item) {
            var id = item.originalItem.TagCategoryMasterId;
            tagCategoryIds.push(id);
        });
        fillTagCategoryValues(tagCategoryIds.join(","));
    });

    $("#btnSearch").click(function () {
        var dvError = $("#dvError").css("color", "red").html("");
        var isTags = $("#chkTags").is(":checked");
        var isUploadedDocs = $("#chkUploadedDocs").is(":checked");
        var isObjectAnnotations = $("#chkAnnotations").is(":checked");
        var searchKeyword = $("#txtSearchKeywords").val() || "";

        var objectTypes = $("#ddlObject").jqxDropDownList("getCheckedItems") || [];
        var objectIds = [];
        objectTypes.forEach(function (item) {
            var id = item.originalItem.FileTypeExtensionId;
            objectIds.push(id);
        });

        var checkedItems = $("#ddlTags").jqxDropDownList("getCheckedItems") || [];
        if (checkedItems.length === 0 && isTags) {
            dvError.html("Please select Tag(s)");
            return false;
        }
        var tagIds = [];
        checkedItems.forEach(function (item) {
            var id = item.originalItem.TagsMasterId;
            tagIds.push(id);
        });

        var checkedCategoryItems = $("#ddlTagCategories").jqxDropDownList("getCheckedItems") || [];
        var tagCategoryIds = [];
        checkedCategoryItems.forEach(function (item) {
            var id = item.originalItem.TagCategoryMasterId;
            tagCategoryIds.push(id);
        });
        var checkedCategoryValueItems = $("#ddlTagCategoryValues").jqxDropDownList("getCheckedItems") || [];
        var tagCategoryValueIds = [];
        checkedCategoryValueItems.forEach(function (item) {
            var id = item.originalItem.TagCategoryValuesId;
            tagCategoryValueIds.push(id);
        });

        var tagMaster = {
            IsTags: isTags,
            IsUploadedDoc: isUploadedDocs, // $("#chkUploadedDocs").is(":checked"),
            IsObjectAnnotations: isObjectAnnotations,
            Tags: tagIds.join(","),
            TagCategories: tagCategoryIds.length > 0 ? tagCategoryIds.join(",") : "",
            TagCategoryValues: tagCategoryValueIds.length > 0 ? tagCategoryValueIds.join(",") : "",
            SearchKeyword: searchKeyword, // = document.getElementById("txtSearchKeywords").value,
            Projects: prjctId, // projectIds.join(",")
            objects: objectIds.join(",")
        };
        // console.log(tagMaster);
        var audit = {
            postData: {
                OptionUsed: "Tags Search",
                PrimaryScreen: "Tags Search",
                UserId: userId,
                ProjectId: prjctId, // projectIds,
                BriefDescription: "Keyword: <b>" + searchKeyword + "</ b> "
            }
        };
        $.fn.auditActionLog(audit).then(function () {
            $.ajax({
                type: "POST",
                url: baseAddress + "TagsMaster/GetTagSearchResults",
                data: tagMaster
            }).done(function (response) {
                tagSearchData(response.TagResults || []);
                uploadeDocsData(response.UploadDocResults || []);
                objectAnnotationsData(response.ObjectAnnotationResults || []);
                $("#dvResultKeyWord").css("visibility", "visible");
                $("#dv-uploaded-docs").css("visibility", "visible");
                $("#dv-obj-annotations").css("visibility", "visible");
                $("#dvTag").css("visibility", "visible");
                console.log(response);
            }).fail(function (err) {
                console.log(err);
                $("#dvResultKeyWord").css("visibility", "hidden");
                $("#dv-uploaded-docs").css("visibility", "hidden");
                $("#dv-obj-annotations").css("visibility", "hidden");
                $("#dvTag").css("visibility", "hidden");
            });
        }).catch(function (err) {
            console.log(err);
        });
        return true;
    });

    $("#txtSearchKeywords").keypress(function (event) {
        if (event.which === 13) {
            $("#btnSearch").click();
        } else {
            $("#txtSearchKeywords").css("border-color", "");
        }
    });

    $("#btnExportViewSource").click(exportViewSourceFile);
});

var exportViewSourceFile = function () {
    var fileId = $("#subRoutineprogramId").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/DownLoadSubRoutineViewSource?fileId=" + fileId,
        contentType: "text/plain;charset=utf-8",
        success: function (data) {
            if (data !== null) {
                downloadTextFile(data[0], data[1]);
            }
        }
    });
};

var downloadTextFile = function (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

var objectAnnotationsData = function (result) {
    for (var k = 0; k < result.length; k++) {
        result[k].RowId = k + 1;
        // var popUp = `onclick=javascript:window.open('about:blank','_blank','toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=600')`;
        var aLink = "<a style='text-decoration:underline; color:#296bb1; cursor:pointer;'>View</a>";
        result[k].ImgLink = aLink;
        result[k].FileName = result[k].FileName.replace(/(.pgm|.jcl|.sbr|.csv|.icd|.idesc|.txt)/, "");
        result[k].View = "<button class='btn btn-mint' onclick='includeStateDialog(" + result[k].FileOrObjectId + ");'>View</button>";
    }
    $("#cnt-obj-annotations").html(" - (Total Count: " + result.length + ")");
    $("#objAnnotations").ejGrid({
        width: "99%",
        dataSource: result,
        allowResizing: true,
        enableRowHover: true,
        allowResizeToFit: true,
        autoFitColumns: true,
        allowPaging: true,
        allowReordering: true,
        resizeSettings: { resizeMode: "nextColumn" },
        allowSorting: true,
        allowMultiSorting: true,
        allowTextWrap: true,
        pageSettings: { pageSize: 10 },
        allowScrolling: false,
        toolbarSettings: {
            showToolbar: true,
            toolbarItems: [
                ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
            ]
        },
        columns: [
            { field: "RowId", headerText: "Sr#", width: 60 },
            { field: "View", headerText: "Action", width: 100 },
            { field: "FileName", headerText: "Object Name", width: 160 },
            { field: "FileTypeName", headerText: "Object Type", width: 160 },
            { field: "ImgLink", headerText: "View", width: 100 }
        ],
        queryCellInfo: function (args) {
            $(args.cell).attr({
                "data-toggle": "tooltip",
                "data-container": "body",
                "title": args.data[args.column.field]
            });
        },
        toolbarClick: function (e) {
            var gridObj = $("#objAnnotations")[0];
            if (e.itemName === "Excel Export") {
                exportGrid(gridObj);
                return false;
            }
            return true;
        },
        rowSelected: function (args) {
            console.log(args);
            $("#rteObjectAnnotations").ejRTE({ width: "100%", height: "450px", isResponsive: true });
            var annotationHtml = args.data ? args.data.AnnotationHtml : "";
            var rteObj = $("#rteObjectAnnotations").data("ejRTE");
            rteObj.setHtml(annotationHtml);
            $("#dv-annotationHtml").modal("show");
        }
        // recordClick: function (args) { console.log(args); }
    });
};

var uploadeDocsData = function (result) {
    if (typeof result !== "undefined") {
        var l = 1;
        // ReSharper disable once QualifiedExpressionMaybeNull
        $("#cntDocs").html(" - (Total Count: " + result.length + ")");
        for (var k = 0; k < result.length; k++) {
            result[k].RowId = l;
            result[k].View = "<button class='btn btn-mint' onclick='includeStateDialog(" + result[k].ProgramId + ");'>View</button>";
            var downloadLink = result[k].FilePath.replace("C:\\inetpub\\wwwroot\\flokapture\\", "");
            var imgLink = downloadLink.replace(/\\/g, "\\\\").replace(/ /g, '%20');
            var popUp = `onclick=javascript:window.open('${imgLink}','_blank','toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=600')`;
            var aLink = "<a style='text-decoration:underline; color:#296bb1; cursor:pointer;' " + popUp + ">" + result[k].FileName + "</a>";
            result[k].ImgLink = aLink;
            result[k].ObjFileName = result[k].ObjFileName.replace(/(.pgm|.jcl|.sbr|.csv|.icd|.idesc|.txt)/, "");
            l++;
        }
        $("#uploadedDocs").ejGrid({
            width: "97%",
            dataSource: result,
            allowResizing: true,
            enableRowHover: true,
            allowResizeToFit: true,
            autoFitColumns: true,
            allowPaging: true,
            allowReordering: true,
            resizeSettings: { resizeMode: "nextColumn" },
            allowSorting: true,
            allowMultiSorting: true,
            allowTextWrap: true,
            pageSettings: { pageSize: 10 },
            allowScrolling: false,
            toolbarSettings: {
                showToolbar: true,
                toolbarItems: [
                    ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                ]
            },
            columns: [
                { field: "RowId", headerText: "Sr#", width: 60 },
                { field: "View", headerText: "Action", width: 100 },
                // { field: "ProjectName", headerText: "Project Name", width: 170 },
                { field: "ObjFileName", headerText: "Document Name", width: 170 },
                // { field: "FileName", headerText: "Document Name", width: 100 },
                { field: "FileTypeName", headerText: "Object Type", width: 100 },
                { field: "ImgLink", headerText: "View", width: 300 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#uploadedDocs")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            }
        });
    } else {
        $("#uploadedDocs").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 60 },
                { field: "View", headerText: "Action", width: 100 },
                // { field: "ProjectName", headerText: "Project Name", width: 170 },
                { field: "ObjFileName", headerText: "Document Name", width: 170 },
                // { field: "FileName", headerText: "Document Name", width: 100 },
                { field: "FileTypeName", headerText: "Object Type", width: 100 },
                { field: "ImgLink", headerText: "View", width: 300 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#uploadedDocs")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            }
        });
    }
};

var tagSearchData = function (result) {
    if (typeof result !== "undefined") {
        var l = 1;
        // ReSharper disable once QualifiedExpressionMaybeNull
        $("#CntTags")[0].innerHTML = " - (Total Count: " + result.length + ")";
        for (var k = 0; k < result.length; k++) {
            result[k].RowId = l;
            result[k].View = "<button class='btn btn-mint' onclick='includeStateDialog(" + result[k].ProgramId + ");'>View</button>";
            result[k].FileName = result[k].FileName.replace(/(.pgm|.jcl|.sbr|.csv|.icd|.idesc|.txt)/, "");
            l++;
        }
        $("#tblSearchTags").ejGrid({
            width: "98%",
            dataSource: result,
            allowResizing: true,
            enableRowHover: true,
            allowResizeToFit: true,
            autoFitColumns: true,
            allowPaging: true,
            allowReordering: true,
            resizeSettings: { resizeMode: "nextColumn" },
            allowSorting: true,
            allowMultiSorting: true,
            allowTextWrap: true,
            pageSettings: { pageSize: 10 },
            allowScrolling: false,
            toolbarSettings: {
                showToolbar: true,
                toolbarItems: [
                    ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                ]
            },
            resizeStart: function(args) {
                console.log(args);
            },
            resizeEnd: function(args) {
                console.log(args);
            },
            resized: function(args) {
                console.log(args);
            },
            columns: [
                { field: "RowId", headerText: "Sr#", width: "10%" },
                { field: "View", headerText: "Action", width: "20%" },
                { field: "FileName", headerText: "Object Name", width: "25%" },
                { field: "FileTypeName", headerText: "Object Type", width: "20%" },
                { field: "TagName", headerText: "Tag Name", width: "25%" }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchTags")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            }
        });
        // $("#tblSearchTags").ejGrid("refreshContent", true);     
        // var gridObj = $("#tblSearchTags").data("ejGrid");
        // $("#tblSearchTags").ejGrid("resizeColumns", "RowId", "10%");
        // gridObj.resizeColumns(); 
        // grid.ejGrid().autoFitColumns();
    } else {
        $("#tblSearchTags").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: "10%" },
                { field: "View", headerText: "Action", width: "20%" },
                { field: "FileName", headerText: "Object Name", width: "25%" },
                { field: "FileTypeName", headerText: "Object Type", width: "20%" },
                { field: "TagName", headerText: "Tag Name", width: "25%" }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchTags")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            }
        });
    }
};

var fillProjectDropDown = function () {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetProjectDetailsForSearchConsole?userId=" + userId,
        success: function (result) {
            result.shift();
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: "ProjectName" },
                    { name: "ProjectId" }
                ],
                id: "id",
                localdata: result,
                async: false
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#ddlSelectProject").jqxDropDownList({
                checkboxes: true,
                source: dataAdapter,
                displayMember: "ProjectName",
                valueMember: "ProjectId",
                width: 200,
                height: 25
            });
            $("#ddlSelectProject").jqxDropDownList("checkAll");
        }
    });
};

var getTagCategoryMaster = function () {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTags",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var localData = [];
            if (result !== null && typeof result !== "undefined") {
                result.forEach(function (t) {
                    localData.push(t);
                });
                var dataSource =
                {
                    datatype: "json",
                    datafields: [
                        { name: "TagsMasterId", type: "integer" },
                        { name: "TagName", type: "string" }
                    ],
                    localdata: localData
                };
                var dataAdapter = new $.jqx.dataAdapter(dataSource);
                $("#ddlTags").jqxDropDownList({
                    checkboxes: true,
                    selectedIndex: 0,
                    source: dataAdapter,
                    displayMember: "TagName",
                    valueMember: "TagsMasterId",
                    width: 200,
                    height: 25
                });
                $("#ddlTags").jqxDropDownList('checkIndex', 0);
                // $("#ddlTags").val("1");
                $("#ddlTags").on("change", function (event) {
                    var args = event.args;
                    var tagId = args.item.value;
                    fillTagCategories(tagId);
                });
            }
        }
    });
};

var fillTagCategories = function (tagIds) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagCategory?tagIds=" + tagIds,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var localData = [];
            if (result !== null && typeof result !== "undefined") {
                result.forEach(function (tag) {
                    localData.push(tag);
                });
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: "TagCategoryMasterId", type: "integer" },
                        { name: "TagCategoryName", type: "string" }
                    ],
                    localdata: localData
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#ddlTagCategories").jqxDropDownList({
                    checkboxes: true,
                    source: dataAdapter,
                    displayMember: "TagCategoryName",
                    valueMember: "TagCategoryMasterId",
                    width: 200,
                    height: 24
                });
                // $("#ddlTagCategories").jqxDropDownList("checkAll");
                $("#ddlTagCategories").val("0");
                $("#ddlTagCategories").on("change", function (event) {
                    var args = event.args;
                    var categoryId = args.item.value;
                    fillTagCategoryValues(categoryId);
                });
            }
        }
    });
};

var fillTagCategoryValues = function (categoryIds) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagsValues?categoryIds=" + categoryIds,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var localData = [];
            data.forEach(function (d) {
                d.TagCategoryName = d.TagCategoryMaster.TagCategoryName;
            });
            data.forEach(function (r) {
                localData.push(r);
            });
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: "TagCategoryValuesId", type: "integer" },
                    { name: "TagCategoryValue", type: "string" }
                ],
                localdata: localData
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#ddlTagCategoryValues").jqxDropDownList({
                checkboxes: true,
                source: dataAdapter,
                displayMember: "TagCategoryValue",
                valueMember: "TagCategoryValuesId",
                width: 200,
                height: 24
            });
            // $("#ddlTagCategoryValues").jqxDropDownList("checkAll");
            $("#ddlTagCategoryValues").val("0");
        }
    });
};

var fillObjects = function() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "FileTypeExtensionReference/GetObjects",
        contentType: "application/json;charset=utf-8",
        success: function(result) {
            var localData = [];
            if (result !== null && typeof result !== "undefined") {
                result.forEach(function(t) {
                    localData.push(t);
                });
                var dataSource =
                {
                    datatype: "json",
                    datafields: [
                        { name: "FileTypeExtensionId", type: "integer" },
                        { name: "FileTypeName", type: "string" }
                    ],
                    localdata: localData
                };
                var dataAdapter = new $.jqx.dataAdapter(dataSource);
                $("#ddlObject").jqxDropDownList({
                    checkboxes: true,
                    selectedIndex: 0,
                    source: dataAdapter,
                    displayMember: "FileTypeName",
                    valueMember: "FileTypeExtensionId",
                    width: 200,
                    height: 25
                });
                $("#ddlObject").jqxDropDownList('checkIndex', 0);

            }
        }
    });
};

var getTableHeaderProperties = function (tblModel) {
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
};

var exportGrid = function (tableName) {
    var selectedProjectList = "";
    var checkedItems = $("#ddlSelectProject").jqxDropDownList("getCheckedItems");
    $.each(checkedItems,
        function (index) {
            var chk = this.originalItem.ProjectName;
            selectedProjectList += chk + ",";
        });
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);

    var rows = gridObj.model.dataSource;
    var tblData = $("#tblData");
    $("#tblData").html("");
    var keyWordSerach = $("#txtSearchKeywords").val();

    var headerRowDefault = $("<tr />");
    var dataCellDefualt = $("<td> Search Keyword:   " + keyWordSerach + "</td>");
    headerRowDefault.append(dataCellDefualt);
    tblData.append(headerRowDefault);
    headerRowDefault = $("<tr />");
    dataCellDefualt = $("<td>Selected Projects:   " + selectedProjectList + "</td>");
    headerRowDefault.append(dataCellDefualt);
    tblData.append(headerRowDefault);

    var headerRow = $("<tr />");
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        if (headerDetails.HeadersText[k] !== "Action" &&
            headerDetails.HeadersText[k] !== "Statements" &&
            headerDetails.HeadersText[k] !== "Match Type") {
            var cell = $("<td style='font-weight: bold;font-size: 14px;'>" + headerDetails.HeadersText[k] + "</td>");
            headerRow.append(cell);
        }
    }

    tblData.append(headerRow);
    for (var i = 0; i < rows.length; i++) {
        var dataRow = $("<tr />");
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var matchTy = headerDetails.HeadersText[j];
            var fieldName = rows[i][field];
            if (typeof fieldName !== "undefined" &&
                selectedProjectList !== null &&
                field !== "StatementView" &&
                field !== "View" &&
                matchTy !== "Match Type") {
                if (typeof fieldName === "undefined" && fieldName === null && fieldName === "null") {
                    fieldName = "-";
                }
                var dataCell = $("<td>" + fieldName + "</td>");
                dataRow.append(dataCell);
            }
        }
        tblData.append(dataRow);
    }
    $("#tblData").excelExport({ type: "excel", escape: "false", htmlContent: "true", fileName: "SearchResults.xls" });
};

var includeStateDialog = function (fileId) {
    $('#ViewSourceInputBody').hide();
    $("#subRoutineprogramId").val(fileId);
    $.ajaxSetup({
        async: true
    });
    jQuery.ajax({
        url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?fileId=" + fileId,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            if (typeof tData !== "undefined" && tData !== null) {
                $("#treeViewSource").html(tData.SourceData);
                $('#ViewSourceInputBody').show();
                $("#viewSourceDialog").modal("show");
            }
        }
    });
};