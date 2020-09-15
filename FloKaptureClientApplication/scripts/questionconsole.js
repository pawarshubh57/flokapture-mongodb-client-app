var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectIdList = window.localStorage.getItem("projectIds");
var selectedProjectList = window.localStorage.getItem("selectedProjectIds");
var prjctId = window.localStorage.getItem("prjctId");

var $body = $("body");
$(document).on({
    ajaxStart: function () {
        $("#tdError")[0].innerHTML = "";
        $("#dvError")[0].innerHTML = "";
        $body.addClass("loading");
    },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () {
        $("#tdError")[0].innerHTML = "Something went wrong. Please try again";
        $("#tdError")[0].style.color = "red";
        $body.removeClass("loading");
    }
});

var keyworkSearchResults = {};
var checkBoxSearchResults = {};

$(document).ready(function () {
    $("#ddlSelectProject").jqxDropDownList({
        checkboxes: true,
        source: [],
        placeHolder: "Select",
        displayMember: "ProjectName",
        valueMember: "ProjectId",
        width: 298,
        height: 30
    });
    $("#ddlObjectType").jqxDropDownList({
        checkboxes: true,
        source: [],
        displayMember: "FileTypeName",
        valueMember: "FileTypeExtensionId",
        width: 298,
        height: 30,
        placeHolder: "Select"
    });

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetProjectDetail?projectId=" + prjctId,
        success: function (result) {
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
                placeHolder: "Select",
                displayMember: "ProjectName",
                valueMember: "ProjectId",
                width: 298,
                height: 30
            });
            $("#ddlSelectProject").on("select", function (event) {
                var item = event.args.item;
                var label = item.label;
                if (label === "Select All") {
                    if (item.checked)
                        $("#ddlSelectProject").jqxDropDownList("checkAll");
                    else
                        $("#ddlSelectProject").jqxDropDownList("uncheckAll");
                } else {
                    if (!item.checked) {
                        $("#ddlSelectProject").jqxDropDownList("uncheckIndex", 0);
                    } else {
                        var checkedItems = $("#ddlSelectProject").jqxDropDownList("getCheckedItems");
                        var items = $("#ddlSelectProject").jqxDropDownList("getItems");
                        var itemsCnt = items.length - 1;
                        if (itemsCnt === checkedItems.length) {
                            $("#ddlSelectProject").jqxDropDownList("checkIndex", 0);
                        }
                    }
                }
            });
            var projectIds = window.localStorage.getItem("selectedProjectIds");
            if (typeof projectIds !== "undefined" &&
                projectIds !== "null" &&
                projectIds !== null &&
                projectIds !== "") {
                var ids = projectIds;
                if (ids !== "") {
                    var ps = ids.split(",");
                    $.each(ps, function (i, k) {
                        var v = parseInt(k);
                        var item = $("#ddlSelectProject").jqxDropDownList("getItemByValue", v);
                        $("#ddlSelectProject").jqxDropDownList("checkItem", item);
                    });
                }
            } else {
                var pid = getParameterByName("pid");
                pid = pid === "0" ? 999999 : parseInt(pid);
                var item = $("#ddlSelectProject").jqxDropDownList("getItemByValue", pid);
                $("#ddlSelectProject").jqxDropDownList("checkItem", item);
            }
            fillObjectDropDown(0);
        }
    });

    $("#btnGo").click(function () {
        $("#ddlObjectType").jqxDropDownList({
            checkboxes: true,
            source: [],
            displayMember: "FileTypeName",
            valueMember: "FileTypeExtensionId",
            width: 298,
            height: 30,
            placeHolder: "Select"
        });
        fillObjectDropDown(1);
    });
});

function fillObjectDropDown(opt) {
    var extensionIds = window.localStorage.getItem("selectedExtensionIds");
    var chkprojectIds = $("#ddlSelectProject").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "QuestionConsole/GetObjectType?projectIds=" + chkprojectIds,
        success: function (result) {
            if (result != null) {
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: "FileTypeName" },
                        { name: "FileTypeExtensionId" },
                        { name: "ProjectId" }
                    ],
                    id: "id",
                    localdata: result,
                    async: false
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#ddlObjectType").jqxDropDownList({
                    checkboxes: true,
                    source: dataAdapter,
                    displayMember: "FileTypeName",
                    valueMember: "FileTypeExtensionId",
                    width: 298,
                    height: 30,
                    placeHolder: "Select"
                });
                $("#ddlObjectType").jqxDropDownList("checkAll");
                if (opt === 0) {
                    if (typeof extensionIds !== "undefined" && extensionIds !== null && extensionIds !== "" && extensionIds !== "null") {
                        $("#ddlObjectType").jqxDropDownList("uncheckAll");
                        var ps = extensionIds.split(",");
                        $.each(ps,
                            function (i, k) {
                                var v = parseInt(k);
                                var item = $("#ddlObjectType").jqxDropDownList("getItemByValue", v);
                                if (typeof item !== "undefined" && item !== null) {
                                    $("#ddlObjectType").jqxDropDownList("checkItem", item);
                                }
                            });
                    }
                }
            }
        }
    });
}

$(document).ready(function () {
    $(".overSelect").html("");
    var elem = document.getElementById("chkOrAnd");
    var switchery = new Switchery(elem, { size: "small" });
    var sEle = document.getElementById("chkRegexOrNormal");
    var regExSwitchery = new Switchery(sEle, { size: "small" });
    var srcResults = window.localStorage.getItem("searchResults");
    if (typeof selectedProjectList === "undefined" && selectedProjectList === null && selectedProjectList === "") {
        selectedProjectList = 0;
    }
  
    if (typeof srcResults !== "undefined" && srcResults !== null && srcResults !== "null") {
        var searchResults = JSON.parse(srcResults);
        if (searchResults.ProjectId !== parseInt(prjctId)) {
            keyworkSearchResults = {};
            checkBoxSearchResults = {};
            srcResults = null;
            searchResults = "";
            return false;
        }
        $("#dvResultKeyWord")[0].style.visibility = "visible";

        document.getElementById("txtSearchKeywords").value = searchResults.searchTerm;
        $body.removeClass("loading");
        if (searchResults !== null) {
            var resultWf = searchResults.resultWf;
            var resultTn = searchResults.resultTn;
            var resultJbp = searchResults.resultJbp;
            var resultFile = searchResults.resultFile;
            var resultFileContent = searchResults.resultFileContent;
            var resultStmtComment = searchResults.resultStmtComment;
            var resultDocUpload = searchResults.docUploads;
            var searchOpt = searchResults.searchOption;
            if (typeof resultWf === "undefined" || resultWf === null)
                resultWf = [];
            if (typeof resultTn === "undefined" || resultTn === null)
                resultTn = [];
            if (typeof resultJbp === "undefined" || resultJbp === null)
                resultJbp = [];
            if (typeof resultFile === "undefined" || resultFile === null)
                resultFile = [];
            if (typeof resultFileContent === "undefined" || resultFileContent === null)
                resultFileContent = [];
            if (typeof resultStmtComment === "undefined" || resultStmtComment === null)
                resultStmtComment = [];
            var workflowNames = searchOpt.workflowNames;
            var uploadDocs = searchOpt.uploadDocs;
            var workflowStatements = searchOpt.workflowStatements;
            var objectFiles = searchOpt.objectFiles;
            var objectStatements = searchOpt.objectStatements;
            var tags = searchOpt.tags;
            var rdExcludeComt = searchOpt.rdExcludeComt;
            var rdPreText = searchOpt.rdPreText;
            var chkboxOrAnd = searchOpt.chkAndOr;
            var specials = document.querySelector("#chkOrAnd");
            if (chkboxOrAnd === "AND") {
                $(specials).attr("checked", false);
                specials.checked = false;
                if (typeof Event === "function" || !document.fireEvent) {
                    var event12 = document.createEvent("HTMLEvents");
                    event12.initEvent("change", false, false);
                    specials.dispatchEvent(event12);
                } else {
                    specials.fireEvent("onchange");
                }
            } else {
                $(specials).attr("checked", true);
                specials.checked = true;
                if (typeof Event === "function" || !document.fireEvent) {
                    var event121 = document.createEvent("HTMLEvents");
                    event121.initEvent("change", true, true);
                    specials.dispatchEvent(event121);
                } else {
                    specials.fireEvent("onchange");
                }
            }
            if (rdExcludeComt) {
                document.getElementById("rdExcludeComt").checked = true;
                document.getElementById("rdPreText").checked = false;
            }
            if (rdPreText) {
                document.getElementById("rdExcludeComt").checked = false;
                document.getElementById("rdPreText").checked = true;
            }
            if (!uploadDocs) {
                document.getElementById("chkObjWithDocuments").checked = false;
                $("#dvUploadDoc")[0].style.visibility = "hidden";
                $("#dvUploadDoc")[0].style.display = "none";
            } else {
                document.getElementById("chkObjWithDocuments").checked = true;
                $("#dvUploadDoc")[0].style.visibility = "visible";
                $("#dvUploadDoc")[0].style.display = "inline";
                fillUploadDocSearchData(resultDocUpload);
            }
            if (!workflowNames) {
                document.getElementById("chkWorkflowNames").checked = false;
                $("#dvWokflowName")[0].style.visibility = "hidden";
                $("#dvWokflowName")[0].style.display = "none";
            } else {
                document.getElementById("chkWorkflowNames").checked = true;
                $("#dvWokflowName")[0].style.visibility = "visible";
                $("#dvWokflowName")[0].style.display = "inline";
                fillWorkflowSearchData(resultWf);
            }
            if (!workflowStatements) {
                document.getElementById("chkWorkflowStatements").checked = false;
                $("#dvWorkflowStatement")[0].style.visibility = "hidden";
                $("#dvWorkflowStatement")[0].style.display = "none";
            } else {
                document.getElementById("chkWorkflowStatements").checked = true;
                $("#dvWorkflowStatement")[0].style.visibility = "visible";
                $("#dvWorkflowStatement")[0].style.display = "inline";
                fillStatementsOfWorkflowData(resultJbp);
            }
            if (!objectFiles) {
                document.getElementById("chkObjectFiles").checked = false;
                $("#dvObjectFile")[0].style.visibility = "hidden";
                $("#dvObjectFile")[0].style.display = "none";
            } else {
                document.getElementById("chkObjectFiles").checked = true;
                $("#dvObjectFile")[0].style.visibility = "visible";
                $("#dvObjectFile")[0].style.display = "inline";
                fillFileNameSearchData(resultFile);
            }
            if (!objectStatements) {
                document.getElementById("chkObjectFilesStatements").checked = false;
                $("#dvObjectStatement")[0].style.visibility = "visible";
                $("#dvObjectStatement")[0].style.display = "none";
            } else {
                document.getElementById("chkObjectFilesStatements").checked = true;
                $("#dvObjectStatement")[0].style.visibility = "visible";
                fillFileContentData(resultFileContent);
                $("#dvObjectStatement")[0].style.display = "inline";
            }
            if (!tags) {
                document.getElementById("chkTags").checked = false;
                $("#dvTag")[0].style.visibility = "hidden";
                $("#dvTag")[0].style.display = "none";
            } else {
                document.getElementById("chkTags").checked = true;
                $("#dvTag")[0].style.visibility = "visible";
                $("#dvTag")[0].style.display = "inline";
                fillJpbSearchData(resultTn);
            }
            if (!workflowNames && !workflowStatements && !objectFiles && !objectStatements && !tags) {
                $("#dvWokflowName")[0].style.visibility = "visible";
                $("#dvWorkflowStatement")[0].style.visibility = "visible";
                $("#dvObjectFile")[0].style.visibility = "visible";
                $("#dvObjectStatement")[0].style.visibility = "visible";
                $("#dvTag")[0].style.visibility = "visible";
                fillWorkflowSearchData(resultWf);
                fillStatementsOfWorkflowData(resultJbp);
                fillFileNameSearchData(resultFile);
                fillFileContentData(resultFileContent);
                fillJpbSearchData(resultTn);
            }
        }
    }
});

$(document).ready(function () {
    $("#txtSearchKeywords").keypress(function (event) {
        if (event.which === 13) {
            $("#btnSearch").click();
        } else {
            $("#txtSearchKeywords").css("border-color", "");
        }
    });

    $("#btnSearch").click(function () {
        document.getElementById("dvError").innerHTML = "";
        var projectIds = ""; 
        var checkedItems = $("#ddlSelectProject").jqxDropDownList("getCheckedItems");
        $.each(checkedItems, function (index) {
            var chk = this.originalItem.ProjectId;
            projectIds += chk + ",";
        });
        var extensionIds = "";
        var checkedExtensionItems = $("#ddlObjectType").jqxDropDownList("getCheckedItems");
        $.each(checkedExtensionItems, function (index) {
            var chk = this.originalItem.FileTypeExtensionId;
            extensionIds += chk + ",";
        });
        var workflowNames = document.getElementById("chkWorkflowNames").checked;
        var workflowStatements = document.getElementById("chkWorkflowStatements").checked;
        var objectFiles = document.getElementById("chkObjectFiles").checked;
        var objectStatements = document.getElementById("chkObjectFilesStatements").checked;
        var uploadDocs = document.getElementById("chkObjWithDocuments").checked;
        var tags = document.getElementById("chkTags").checked;
        var rdPreText = $("#rdPreText:checked").val() ? true : false;
        var rdExcludeComt = $("#rdExcludeComt:checked").val() ? true : false; // document.getElementById("rdExcludeComt").cheched;
       
        var chkOrAnd = document.querySelector(".js-switch");
        $("#dvWokflowName")[0].style.display = "none";
        $("#dvWorkflowStatement")[0].style.display = "none";
        $("#dvObjectFile")[0].style.display = "none";
        $("#dvObjectStatement")[0].style.display = "none";
        $("#dvTag")[0].style.display = "none";
        $("#dvStatementComments")[0].style.display = "none";
        $("#dvUploadDoc").css({ display: "none" });
        if (workflowNames === false &&
            workflowStatements === false &&
            objectFiles === false &&
            objectStatements === false &&
            tags === false && !uploadDocs) {
            document.getElementById("dvError").innerHTML = "Please select atleast one scope.";
            return false;
        }
        if (extensionIds === "") {
            document.getElementById("dvError").innerHTML = "Please select object type";
            $("#ddlObjectType").focus();
            $("#ddlObjectType").css("border-color", "red");
            return false;
        } else {
            $("#ddlObjectType").css("border-color", "");
        }

        window.localStorage.setItem("selectedProjectIds", projectIds);
        window.localStorage.setItem("selectedExtensionIds", extensionIds);
        if ($("#txtSearchKeywords").val() === "") {
            document.getElementById("dvError").innerHTML = "Please enter search keyword";
            $("#txtSearchKeywords").focus();
            $("#txtSearchKeywords").css("border-color", "red");
            return false;
        } else {
            $("#txtSearchKeywords").css("border-color", "");
        }

        if (projectIds === null || typeof projectIds === "undefined" || projectIds === "") {
            document.getElementById("dvError").innerHTML = "Please select project";
            $("#ddlSelectProject").focus();
            $("#ddlSelectProject").css("border-color", "red");
            $(".checkbox").on("click", function () {
                $(this).css("border-color", "");
                document.getElementById("dvError").innerHTML = " ";
            });
            return false;
        }
        var keyWords = $("#txtSearchKeywords").val();
        var andOr = chkOrAnd.checked ? "OR" : "AND";
        document.getElementById("dvError").innerHTML = "";
        var extensions = [];
        $.each(checkedExtensionItems, function () {
            var chk = this.originalItem.FileTypeName;
            extensions.push(chk);
        });
        var audit = {
            postData: {
                OptionUsed: "Keyword Search",
                PrimaryScreen: "Keyword Search",
                UserId: userId,
                ProjectId: projectIds,
                BriefDescription: "Keyword: <b>" + keyWords + "</ b> with option: " + andOr + " and Object Types: " + extensions.join(", ")
            }
        };
        $.fn.auditActionLog(audit).then(function () {
            var srcType = rdPreText === true ? 0 : 1;
            jQuery.ajax({
                type: "GET",
                url: baseAddress + "QuestionConsole/ProcessSearchKeyWord?KeyWord=" + keyWords + "&pIds=" + projectIds + "&extensionIds=" + extensionIds + "&option=" + andOr + "&wC=" + srcType,
                success: function (searchResults) {
                    $("#dvResultKeyWord")[0].style.visibility = "visible";
                    $body.removeClass("loading");
                    if (typeof searchResults !== "undefined" && searchResults !== null) {
                        var resultWf; var resultTn; var resultJbp;
                        var resultFile; var resultStmtComment; var resultDocUpload;
                        var resultFileContent;
                        resultWf = searchResults[0].ListWorkflowTreeviewSecondTabDetails;
                        resultJbp = searchResults[1].ListWorkflowTreeviewSecondTabDetails;
                        resultTn = searchResults[2].ListWorkflowTreeviewSecondTabDetails;
                        resultFile = searchResults[3].ListWorkflowTreeviewSecondTabDetails;
                        resultFileContent = searchResults[4].ListWorkflowTreeviewSecondTabDetails;
                        resultDocUpload = searchResults[5].ListWorkflowTreeviewSecondTabDetails;
                        resultWf = resultWf || [];
                        if (typeof resultWf === "undefined" || resultWf === null)
                            resultWf = [];
                        if (typeof resultTn === "undefined" || resultTn === null)
                            resultTn = [];
                        if (typeof resultJbp === "undefined" || resultJbp === null)
                            resultJbp = [];
                        if (typeof resultFile === "undefined" || resultFile === null)
                            resultFile = [];
                        if (typeof resultFileContent === "undefined" || resultFileContent === null)
                            resultFileContent = [];
                        if (typeof resultStmtComment === "undefined" || resultStmtComment === null)
                            resultStmtComment = [];
                        var searchOpt = {
                            workflowNames: workflowNames,
                            workflowStatements: workflowStatements,
                            objectFiles: objectFiles,
                            objectStatements: objectStatements,
                            tags: tags,
                            uploadDocs: uploadDocs,
                            rdExcludeComt: rdExcludeComt,
                            rdPreText: rdPreText,
                            chkAndOr: andOr
                        };
                        keyworkSearchResults = {
                            searchTerm: keyWords,
                            projectIds: projectIds,
                            resultWf: resultWf,
                            resultTn: resultTn,
                            resultJbp: resultJbp,
                            resultFile: resultFile,
                            resultFileContent: resultFileContent,
                            docUploads: resultDocUpload,
                            searchOption: searchOpt,
                            ProjectId: parseInt(prjctId)
                        };

                        var srcResults = JSON.stringify(keyworkSearchResults);
                        try {
                            window.localStorage.setItem("searchResults", srcResults);
                        }
                        catch (e) {
                            document.getElementById("dvError").innerHTML = "Local Storage is full. Please try to do search for specific Projects / Object Types.";
                            console.log("Local Storage is full.", e);
                            window.localStorage.setItem("searchResults", []);
                            return false;
                        }
                        if (workflowNames) {
                            $("#dvWokflowName")[0].style.display = "inline";
                            $("#dvWokflowName")[0].style.visibility = "visible";
                            fillWorkflowSearchData(resultWf);
                        }
                        if (workflowStatements) {
                            $("#dvWorkflowStatement")[0].style.display = "inline";
                            $("#dvWorkflowStatement")[0].style.visibility = "visible";
                            fillStatementsOfWorkflowData(resultJbp);

                        }
                        if (objectFiles) {
                            $("#dvObjectFile")[0].style.display = "inline";
                            $("#dvObjectFile")[0].style.visibility = "visible";
                            fillFileNameSearchData(resultFile);
                        }
                        if (objectStatements) {
                            $("#dvObjectStatement")[0].style.display = "inline";
                            $("#dvObjectStatement")[0].style.visibility = "visible";
                            fillFileContentData(resultFileContent);
                        }
                        if (tags) {
                            $("#dvTag")[0].style.display = "inline";
                            $("#dvTag")[0].style.visibility = "visible";
                            fillJpbSearchData(resultTn);
                        }
                        if (uploadDocs) {
                            $("#dvUploadDoc").css({ "display": "inline" });
                            $("#dvUploadDoc").css({ "visibility": "visible" });
                            fillUploadDocSearchData(resultDocUpload);
                        }
                        if (!workflowNames && !workflowStatements && !objectFiles && !objectStatements && !tags) {


                            fillWorkflowSearchData(resultWf);
                            fillStatementsOfWorkflowData(resultJbp);
                            fillFileNameSearchData(resultFile);
                            fillFileContentData(resultFileContent);
                            fillJpbSearchData(resultTn);
                        }
                    }
                }
            });
        }).catch(function (e) {
            console.log(e);
        });
    });

    $("#btnProcessUserQuestion").click(function () {
        var userQuestion = $("#txtUserQuestion").val();
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "QuestionConsole/ProcessUserQuestion?userQuestion=" + userQuestion,
            success: function (searchResults) {
                $("#dvResultPanal")[0].style.visibility = "visible";
                $body.removeClass("loading");
                if (searchResults != null) {
                    var resultWf = searchResults[0].ListWorkflowTreeviewSecondTabDetails;
                    var resultBf = searchResults[1].ListWorkflowTreeviewSecondTabDetails;
                    var resultBn;
                    if (searchResults.length > 2) {
                        resultBn = searchResults[2].ListWorkflowTreeviewSecondTabDetails;
                    }
                    if (resultWf === null)
                        resultWf = [];
                    if (resultBf === null)
                        resultBf = [];
                    if (resultBn === null)
                        resultBn = [];

                    if (typeof resultWf !== "undefined") {
                        $("#tblSearchResult").ejGrid({
                            width: "100%",
                            dataSource: resultWf,
                            allowPaging: true,
                            allowResizeToFit: true,
                            pageSettings: { pageSize: 10 },
                            allowScrolling: false,
                            toolbarSettings: {
                                showToolbar: true,
                                toolbarItems: [ej.Grid.ToolBarItems.Search]
                            },
                            columns: [
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                {
                                    headerText: "Action",
                                    isUnbound: true,
                                    width: "7%",
                                    template:
                                        "<a href='workflow_workspace.html?prjId={{:ProjectId}}&stId={{:WorkflowStartStatementId}}&aId={{:ActionWorkflowId}}'><button id='Btn_{{:ProjectId}}' class='btn btn-mint'>View</button></a>"
                                },
                                { field: "ClassCalled", headerText: "Workflow Name", width: "56%" },
                                { field: "SpriteCssClass", headerText: "Project Name", width: "17%" },
                                { field: "GraphName", headerText: "Match Type", width: "16%" },

                            ],
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            },
                        });
                    } else {
                        $("#tblSearchResult").ejGrid({
                            columns: [
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                {
                                    headerText: "Action",
                                    isUnbound: true,
                                    width: "7%",
                                    template:
                                        "<a href='workflow_workspace.html?prjId={{:ProjectId}}&stId={{:WorkflowStartStatementId}}&aId={{:ActionWorkflowId}}'><button id='Btn_{{:ProjectId}}' class='btn btn-mint'>View</button></a>"
                                },
                                { field: "ClassCalled", headerText: "Workflow Name", width: "56%" },
                                { field: "SpriteCssClass", headerText: "Project Name", width: "17%" },
                                { field: "GraphName", headerText: "Match Type", width: "16%" },

                            ],
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            },
                        });
                    }
                    if (typeof resultBf !== "undefined") {
                        $("#tblQuestionResults").ejGrid({
                            width: "100%",
                            dataSource: resultBf,
                            allowPaging: true,
                            allowResizeToFit: true,
                            pageSettings: { pageSize: 10 },
                            allowScrolling: false,
                            toolbarSettings: {
                                showToolbar: true,
                                toolbarItems: [ej.Grid.ToolBarItems.Search]
                            },
                            columns: [
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                {
                                    headerText: "Action",
                                    isUnbound: true,
                                    width: "7%",
                                    template:
                                        "<a href='workflow_workspace.html?prjId={{:ProjectId}}&stId={{:WorkflowStartStatementId}}&aId={{:ActionWorkflowId}}'><button id='Btn_{{:ProjectId}}' class='btn btn-mint'>View</button></a>"
                                },
                                { field: "ClassCalled", headerText: "Business Function Name", width: "56%" },
                                { field: "SpriteCssClass", headerText: "Project Name", width: "17%" },
                                { field: "GraphName", headerText: "Match Type", width: "16%" },

                            ],
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            },
                        });
                    } else {
                        $("#tblQuestionResults").ejGrid({
                            columns: [
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                {
                                    headerText: "Action",
                                    isUnbound: true,
                                    width: "7%",
                                    template:
                                        "<a href='workflow_workspace.html?prjId={{:ProjectId}}&stId={{:WorkflowStartStatementId}}&aId={{:ActionWorkflowId}}'><button id='Btn_{{:ProjectId}}' class='btn btn-mint'>View</button></a>"
                                },
                                { field: "ClassCalled", headerText: "Business Function Name", width: "56%" },
                                { field: "SpriteCssClass", headerText: "Project Name", width: "17%" },
                                { field: "GraphName", headerText: "Match Type", width: "16%" },

                            ],
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            },
                        });
                    }

                    if (typeof resultBn !== "undefined") {
                        $("#tblBnResults").ejGrid({
                            width: "100%",
                            dataSource: resultBn,
                            allowPaging: true,
                            allowResizeToFit: true,
                            pageSettings: { pageSize: 10 },
                            allowScrolling: false,
                            toolbarSettings: {
                                showToolbar: true,
                                toolbarItems: [ej.Grid.ToolBarItems.Search]
                            },
                            columns: [
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                {
                                    headerText: "Action",
                                    isUnbound: true,
                                    width: "7%",
                                    template:
                                        "<a href='workflow_workspace.html?prjId={{:ProjectId}}&stId={{:WorkflowStartStatementId}}&aId={{:ActionWorkflowId}}'><button id='Btn_{{:ProjectId}}' class='btn btn-mint'>View</button></a>"
                                },
                                { field: "SpriteCssClass", headerText: "Business Function Name", width: "56%" },
                                { field: "ClassCalled", headerText: "Project Name", width: "17%" },
                                { field: "GraphName", headerText: "Match Type", width: "16%" },

                            ],
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            },
                        });
                    } else {
                        $("#tblBnResults").ejGrid({
                            columns: [
                                { field: "RowId", headerText: "Sr#", width: "4%" },
                                {
                                    headerText: "Action",
                                    isUnbound: true,
                                    width: "7%",
                                    template:
                                        "<a href='workflow_workspace.html?prjId={{:ProjectId}}&stId={{:WorkflowStartStatementId}}&aId={{:ActionWorkflowId}}'><button id='Btn_{{:ProjectId}}' class='btn btn-mint'>View</button></a>"
                                },
                                { field: "SpriteCssClass", headerText: "Business Function Name", width: "56%" },
                                { field: "ClassCalled", headerText: "Project Name", width: "17%" },
                                { field: "GraphName", headerText: "Match Type", width: "16%" },

                            ],
                            queryCellInfo: function (args) {
                                $(args.cell).attr({
                                    "data-toggle": "tooltip",
                                    "data-container": "body",
                                    "title": args.data[args.column.field]
                                });
                            },
                        });
                    }

                }
            }
        });
    });

    $(".collapse").on("shown.bs.collapse", function () {
        $(this).parent().find(".fa-angle-right").removeClass("fa-angle-right").addClass("fa-angle-down");
    }).on("hidden.bs.collapse", function () {
        $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
    });
});
var expanded = false;

var fillUploadDocSearchData = function (resultUd) {
    if (typeof resultUd !== "undefined") {
        var l = 1;
        // ReSharper disable once QualifiedExpressionMaybeNull
        $("#cnt-upload-doc")[0].innerHTML = " - (Total Count: " + resultUd.length + ")";
        for (var k = 0; k < resultUd.length; k++) {
            resultUd[k].RowId = l;
            var downloadLink = resultUd[k].AlternateName.replace("C:\\inetpub\\wwwroot\\flokapture\\", "");
            var imgLink = downloadLink.replace(/\\/g, "\\\\").replace(/ /g, "%20");
            var popUp = `onclick=javascript:window.open('${imgLink}','_blank','toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=600')`;
            var aLink = "<a style='text-decoration:underline; color:#296bb1; cursor:pointer;' " + popUp + ">" + resultUd[k].AnnotateStatement + "</a>";
            resultUd[k].ImgLink = aLink;
            l++;
        }
        $("#tblUploadDocs").ejGrid({
            width: "100%",
            dataSource: resultUd,
            allowPaging: true,
            allowReordering: true,
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
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Object Name", width: 150 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "GraphName", headerText: "Match Type", width: 150 },
                { field: "ImgLink", headerText: "View", width: 350 }
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
    } else {
        $("#tblUploadDocs").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Object Name", width: 150 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "GraphName", headerText: "Match Type", width: 150 },
                { field: "ImgLink", headerText: "View", width: 350 }
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

function fillObjectTypeDropdown(opt) {
    var extensionIds = window.localStorage.getItem("selectedExtensionIds");
    var selectedProjectList = window.localStorage.getItem("selectedProjectIds");
    if (typeof selectedProjectList !== "undefined" && selectedProjectList !== null && selectedProjectList !== "") {
        selectedProjectList = prjctId;
    }
    var checkedProjectItems = $("#ddlSelectProject").jqxDropDownList("getCheckedItems");
    if (typeof checkedProjectItems !== "undefined" && checkedProjectItems !== null && checkedProjectItems !== "") {
        $.each(checkedProjectItems, function (index) {
            var chk = this.originalItem.ProjectId;
            selectedProjectList += chk + ",";
        });
    }
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "QuestionConsole/GetObjectType?projectIds=" + selectedProjectList,
        success: function (result) {
            if (result != null) {
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: "FileTypeName" },
                        { name: "FileTypeExtensionId" },
                        { name: "ProjectId" }
                    ],
                    id: "id",
                    localdata: result,
                    async: false
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#ddlObjectType").jqxDropDownList({
                    checkboxes: true,
                    source: dataAdapter,
                    displayMember: "FileTypeName",
                    valueMember: "FileTypeExtensionId",
                    width: 298,
                    height: 30,
                    placeHolder: "Select"
                });
                if (opt === 0) {
                    $("#ddlObjectType").jqxDropDownList({ placeHolder: "Select" });
                    if (typeof extensionIds !== "undefined" && extensionIds !== null && extensionIds !== "") {
                        var ps = extensionIds.split(",");
                        $.each(ps, function (i, k) {
                            var v = parseInt(k);
                            var item = $("#ddlObjectType").jqxDropDownList("getItemByValue", v);
                            if (typeof item !== "undefined" && item !== null) {
                                $("#ddlObjectType").jqxDropDownList("checkItem", item);
                            }
                        });
                    }
                } else {
                    if (opt === 1 &&
                        typeof selectedProjectList !== "undefined" &&
                        selectedProjectList !== null &&
                        selectedProjectList !== "") {
                        $("#ddlObjectType").jqxDropDownList("checkAll");
                    } else {
                        $("#ddlObjectType").jqxDropDownList("uncheckAll");
                    }
                }

            }
        }
    });
}

function fillProjectDropDownWithjqxDropDownList() {
    var projectIds = window.localStorage.getItem("selectedProjectIds");
    if (typeof projectIds !== "undefined" && projectIds !== null && projectIds !== "") {
        selectedProjectList = prjctId;
    }
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ProjectMaster/GetProjectDetailsForSearchConsole?userId=" + userId,
        success: function (result) {
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
                placeHolder: "Select",
                displayMember: "ProjectName",
                valueMember: "ProjectId",
                width: 298,
                height: 30
            });
            $("#ddlSelectProject").jqxDropDownList({ placeHolder: "Select" });
            var ids = projectIds;
            if (typeof ids !== "undefined" && ids !== null && ids !== "") {
                var ps = ids.split(",");
                $.each(ps, function (i, k) {
                    var v = parseInt(k);
                    var item = $("#ddlSelectProject").jqxDropDownList("getItemByValue", v);
                    $("#ddlSelectProject").jqxDropDownList("checkItem", item);
                    fillObjectTypeDropdown(0);
                });
            }
            var handleCheckChange = true;
            $("#ddlSelectProject").on("checkChange", function (event) {
                if (!handleCheckChange)
                    return;
                var item = event.args.item;
                var label = item.label;
                if (label !== "Select All") {
                    handleCheckChange = false;
                    $("#ddlSelectProject").jqxDropDownList("checkIndex", 0);
                    var checkedItems = $("#ddlSelectProject").jqxDropDownList("getCheckedItems");
                    var items = $("#ddlSelectProject").jqxDropDownList("getItems");

                    if (checkedItems.length === 1) {
                        $("#ddlSelectProject").jqxDropDownList("uncheckIndex", 0);
                    }
                    else if (items.length !== checkedItems.length) {
                        $("#ddlSelectProject").jqxDropDownList("uncheckIndex", 0);
                    }
                    handleCheckChange = true;
                }
                else {
                    handleCheckChange = false;
                    if (event.args.checked) {
                        $("#ddlSelectProject").jqxDropDownList("checkAll");
                    }
                    else {
                        $("#ddlSelectProject").jqxDropDownList("uncheckAll");
                    }
                    handleCheckChange = true;
                }
                fillObjectTypeDropdown(1);
            });
        }
    });
}

function fillWorkflowSearchData(resultWf) {
    if (typeof resultWf !== "undefined") {
        var l = 1;
        // ReSharper disable once QualifiedExpressionMaybeNull
        $("#CntWorkflowNames")[0].innerHTML = " - (Total Count: " + resultWf.length + ")";
        for (var k = 0; k < resultWf.length; k++) {
            resultWf[k].RowId = l;
            l++;
        }
        $("#tblSearchKeyWords").ejGrid({
            width: "98%",
            dataSource: resultWf,
            enableRowHover: true,
            allowPaging: true,
            allowSorting: true,
            allowReordering: true,
            allowTextWrap: true,
            allowMultiSorting: true,
            pageSettings: { pageSize: 10 },
            toolbarSettings: {
                showToolbar: true,
                toolbarItems: [
                    ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                ]
            },
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Workflow Name", width: 430 },
                { field: "WorkflowBusinessName", headerText: "Object Name", width: 120 },
                { field: "ObjectType", headerText: "Object Type", width: 120 },
                { field: "SpriteCssClass", headerText: "Project Name", width: 180 },
                { field: "GraphName", headerText: "Match Type", width: 200 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchKeyWords")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    } else {
        $("#tblSearchKeyWords").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Workflow Name", width: 430 },
                { field: "WorkflowBusinessName", headerText: "Object Name", width: 120 },
                { field: "ObjectType", headerText: "Object Type", width: 120 },
                { field: "SpriteCssClass", headerText: "Project Name", width: 180 },
                { field: "GraphName", headerText: "Match Type", width: 200 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchKeyWords")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    }
}

function fillStatementsOfWorkflowData(resultTn) {
    if (typeof resultTn !== "undefined") {
        var l = 1;
        $("#CntWorkflowStatements")[0].innerHTML = " - (Total Count: " + resultTn.length + ")";
        for (var k = 0; k < resultTn.length; k++) {
            resultTn[k].RowId = l;
            l++;
        }
        $("#tblSearchJclPrograms").ejGrid({
            width: "98%",
            dataSource: resultTn,
            allowPaging: true,
            allowSorting: true,
            allowReordering: true,
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
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "StatementView", headerText: "Statements", width: 100 },
                { field: "ClassCalled", headerText: "Workflow Name", width: 330 },
                { field: "WorkflowBusinessName", headerText: "Object Name", width: 120 },
                { field: "ObjectType", headerText: "Object Type", width: 120 },
                { field: "SpriteCssClass", headerText: "Project Name", width: 180 },
                { field: "GraphName", headerText: "Match Type", width: 200 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchJclPrograms")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    } else {
        $("#tblSearchJclPrograms").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "StatementView", headerText: "Statements", width: 100 },
                { field: "ClassCalled", headerText: "Workflow Name", width: 330 },
                { field: "WorkflowBusinessName", headerText: "Object Name", width: 120 },
                { field: "ObjectType", headerText: "Object Type", width: 120 },
                { field: "SpriteCssClass", headerText: "Project Name", width: 180 },
                { field: "GraphName", headerText: "Match Type", width: 200 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchJclPrograms")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    }
}

function fillFileNameSearchData(resultFile) {
    if (typeof resultFile !== "undefined") {
        var l = 1;
        $("#CntObject")[0].innerHTML = " - (Total Count: " + resultFile.length + ")";
        for (var k = 0; k < resultFile.length; k++) {
            resultFile[k].RowId = l;
            l++;
        }
        $("#tblSearchFiles").ejGrid({
            width: "97%",
            dataSource: resultFile,
            allowPaging: true,
            allowReordering: true,
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
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Object Name", width: 550 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Match Type", width: 350 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchFiles")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    } else {
        $("#tblSearchFiles").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Object Name", width: 550 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Match Type", width: 350 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchFiles")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    }
}

function fillFileContentData(resultFileContent) {
    if (typeof resultFileContent !== "undefined") {
        var l = 1;
        $("#CntObjectStmts")[0].innerHTML = " - (Total Count: " + resultFileContent.length + ")";
        for (var k = 0; k < resultFileContent.length; k++) {
            resultFileContent[k].RowId = l;
            l++;
        }
        $("#tblSearchFileContent").ejGrid({
            width: "98%",
            dataSource: resultFileContent,
            allowPaging: true,
            allowReordering: true,
            allowSorting: true,
            allowMultiSorting: true,
            allowTextWrap: true,
            pageSettings: { pageSize: 5 },
            allowScrolling: false,
            toolbarSettings: {
                showToolbar: true,
                toolbarItems: [
                    ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.Search
                ]
            },
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "StatementView", headerText: "Statements", width: 100 },
                { field: "ClassCalled", headerText: "Object Name", width: 450 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Match Type", width: 350 }

            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchFileContent")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    } else {
        $("#tblSearchFileContent").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "StatementView", headerText: "Statements", width: 100 },
                { field: "ClassCalled", headerText: "Object Name", width: 450 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Match Type", width: 350 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblSearchFileContent")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    }
}

function fillJpbSearchData(resultJbp) {
    if (typeof resultJbp !== "undefined") {
        var l = 1;
        // ReSharper disable once QualifiedExpressionMaybeNull
        $("#CntTags")[0].innerHTML = " - (Total Count: " + resultJbp.length + ")";
        for (var k = 0; k < resultJbp.length; k++) {
            resultJbp[k].RowId = l;
            l++;
        }
        $("#tblSearchTags").ejGrid({
            width: "97%",
            dataSource: resultJbp,
            allowPaging: true,
            allowReordering: true,
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
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Object Name", width: 550 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Tag Name", width: 200 },
                { field: "GraphName", headerText: "Match Type", width: 150 }
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
            },
        });
    } else {
        $("#tblSearchTags").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Action", width: 80 },
                { field: "ClassCalled", headerText: "Object Name", width: 550 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Tag Name", width: 200 },
                { field: "GraphName", headerText: "Match Type", width: 150 }
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
            },
        });
    }
}

function fillStatmentCommentsData(resultStmtComment) {
    if (typeof resultStmtComment !== "undefined" && resultStmtComment !== null) {
        var l = 1;
        $("#CntStmtComment")[0].innerHTML = " - (Total Count: " + resultStmtComment.length + ")";
        for (var k = 0; k < resultStmtComment.length; k++) {
            resultStmtComment[k].RowId = l;
            l++;
        }
        $("#tblStmtComments").ejGrid({
            width: "98%",
            dataSource: resultStmtComment,
            allowPaging: true,
            allowReordering: true,
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

                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Statement Comment", width: 180 },
                { field: "StatementView", headerText: "Custom View", width: 150 },
                { field: "ClassCalled", headerText: "Object Name", width: 300 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Match Type", width: 350 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblStmtComments")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    } else {
        $("#tblStmtComments").ejGrid({
            columns: [
                { field: "RowId", headerText: "Sr#", width: 50 },
                { field: "View", headerText: "Statement Comment", width: 180 },
                { field: "StatementView", headerText: "Custom View", width: 150 },
                { field: "ClassCalled", headerText: "Object Name", width: 300 },
                { field: "ObjectType", headerText: "Object Type", width: 150 },
                { field: "WorkflowBusinessName", headerText: "Match Type", width: 350 }
            ],
            queryCellInfo: function (args) {
                $(args.cell).attr({
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": args.data[args.column.field]
                });
            },
            toolbarClick: function (e) {
                var gridObj = $("#tblStmtComments")[0];
                if (e.itemName === "Excel Export") {
                    exportGrid(gridObj);
                    return false;
                }
                return true;
            },
        });
    }
}

function exportAsExcel() {
    var gridObj = $("#tblSearchResult").data("ejGrid");
    var allRows = gridObj.getRows();
    var t = $("<table />");
    var tbl = $("<tbody id='myTable' />").append(allRows);
    t.append(tbl);
    $(t).tableExport({ type: "excel", escape: "false" });
}

function drawTable(data, tableName) {
    if (tableName === "tblAllProjects") {
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i], tableName, "", (i + 1));
        }
    } else {
        for (var j = 0; j < data.length; j++) {
            drawRow(data[j], tableName, "pointer", (j + 1));
        }
    }
}

function drawRow(rowData, tableName, css, srNo) {
    var row = $("<tr title='record_" + rowData.WorkflowStartStatementId + "' id='projectTr_" + rowData.WorkflowStartStatementId + "' style='cursor: " + css + ";' onclick='changeBg(this);' ; />");
    $("#" + tableName).append(row);
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.ClassCalled + " </td>"));
    row.append($("<td>" + rowData.SpriteCssClass + " </td>"));
    row.append($("<td>" + rowData.GraphName + " </td>"));
    row.append($("<td><a href='workflow_workspace.html?prjId=" + rowData.ProjectId + "&stId=" + rowData.WorkflowStartStatementId + "'><button class='btn btn-mint'>View</button></a></td>"));
}

window.flag = true;
function doChange(args) {
    var obj = $("#ddlSelectProject").ejDropDownList("instance");
    if (args.isChecked) obj.checkAll();
    if (!args.isChecked) obj.uncheckAll();
    window.flag = true;
}

$(document).ready(function () {
    $("#btnExportKeywords").click(function () {
        var keyTable = $("#tblSearchKeyWords")[0];
        exportGrid(keyTable, "excel");
        return false;
    });

    $("#btnJclProgramSrc").click(function () {
        var keyTable = $("#tblSearchJclPrograms")[0];
        exportGrid(keyTable, "excel");
        return false;
    });

    $("#btnSearchTags").click(function () {
        var keyTable = $("#tblSearchTags")[0];
        exportGrid(keyTable, "excel");
        return false;
    });

    $("#btnForFiles").click(function () {
        var keyTable = $("#tblSearchFiles")[0];
        exportGrid(keyTable, "excel");
        return false;
    });
    $("#btnForStmtComments").click(function () {
        var keyTable = $("#tblStmtComments")[0];
        exportGrid(keyTable, "excel");
        return false;
    });
    $("#btnForFileContent").click(function () {
        var keyTable = $("#tblSearchFileContent")[0];
        exportGrid(keyTable, "excel");
        return false;
    });
    $("#btnExportDemo").click(function () {
        var keyTable = $("#tblSearchResult")[0];
        exportGrid(keyTable, "excel");
        return false;
    });
    $("#btnBusinessFun").click(function () {
        var keyTable = $("#tblQuestionResults")[0];
        exportGrid(keyTable, "excel");
        return false;
    });
    $("#btnStatementBusinessFun").click(function () {
        var keyTable = $("#tblBnResults")[0];
        exportGrid(keyTable, "excel");
        return false;
    });
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

function exportGrid(tableName) {
    var selectedProjectList = "";
    var checkedItems = $("#ddlSelectProject").jqxDropDownList("getCheckedItems");
    $.each(checkedItems, function (index) {
        var chk = this.originalItem.ProjectName;
        selectedProjectList += chk + ",";
    });
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("ejGrid");
    var headerDetails = getTableHeaderProperties(gridObj.model);

    var rows = gridObj.model.dataSource;
    var matchType = rows[0].GraphName;
    var tblData = $("#tblData");
    $("#tblData").html("");
    var keyWordSerach = $("#txtSearchKeywords").val();
    var chkOrAnd = document.querySelector(".js-switch");
    var andOr = chkOrAnd.checked ? "OR" : "AND";

    var headerRowDefault = $("<tr />");
    var dataCellDefualt = $("<td> Search Keyword:   " + keyWordSerach + "</td>");
    headerRowDefault.append(dataCellDefualt);
    tblData.append(headerRowDefault);

    headerRowDefault = $("<tr />");
    var conditionRow = $("<td>Condition:    " + andOr + "</td>");
    headerRowDefault.append(conditionRow);
    tblData.append(headerRowDefault);

    headerRowDefault = $("<tr />");
    var matchTypeRow = $("<td>Match Type:    " + matchType + "</td>");
    headerRowDefault.append(matchTypeRow);
    tblData.append(headerRowDefault);

    headerRowDefault = $("<tr />");
    dataCellDefualt = $("<td>Selected Projects:   " + selectedProjectList + "</td>");
    headerRowDefault.append(dataCellDefualt);
    tblData.append(headerRowDefault);

    var headerRow = $("<tr />");
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        if (headerDetails.HeadersText[k] !== "Action" && headerDetails.HeadersText[k] !== "Statements" && headerDetails.HeadersText[k] !== "Match Type") {
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
            if (typeof fieldName !== "undefined" && selectedProjectList !== null && field !== "StatementView" && field !== "View" && matchTy !== "Match Type") {
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
}

function searchViewSource() {
    var hitHighlighter = new Hilitor("ViewSourceInputBody");
    hitHighlighter.setMatchType("left");
    $("#ViewSourceInputModal_SearchButton").off();
    $("#ViewSourceInputModal_SearchBox").off();
    $("#ViewSourceInputModal_SearchPrev").off();
    $("#ViewSourceInputModal_SearchNext").off();

    $("#ViewSourceInputModal_SearchBox").val("");
    $("#ViewSourceInputModal_SearchNav").hide();
    $("#ViewSourceInputModal_SearchHitCount").text("");

    $("#ViewSourceInputModal_SearchButton").click(
        function () {
            hitHighlighter.remove();
            var keywords = $("#ViewSourceInputModal_SearchBox").val();
            var words = keywords.split(",").sort(function (a, b) {
                return b.length - a.length;
            });
            var hitCount = 0;
            $.each(words, function () {
                hitHighlighter.apply(this);
                hitCount += hitHighlighter.hitCount;
            });

            if (hitCount === 0) {
                $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
            } else {
                $("#ViewSourceInputModal_SearchNav").show();
                $("#ViewSourceInputModal_SearchHitCount").text(hitCount + (hitCount === 1 ? " match" : " matches"));
            }
        });

    $("#ViewSourceInputModal_SearchBox").keypress(
        function (e) {
            if (e.keyCode === 13) {
                hitHighlighter.apply($("#ViewSourceInputModal_SearchBox").val());
                if (hitHighlighter.hitCount === 0) {
                    $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
                } else {
                    $("#ViewSourceInputModal_SearchNav").show();
                    $("#ViewSourceInputModal_SearchHitCount").text(hitHighlighter.hitCount + (hitHighlighter.hitCount === 1 ? " match" : " matches"));
                }
            }
        });

    $("#ViewSourceInputModal_SearchPrev").click(
        function () {
            hitHighlighter.prevHit();
        });

    $("#ViewSourceInputModal_SearchNext").click(
        function () {
            hitHighlighter.nextHit();
        });
}

function includeStateDialog(fileId) {
    var projectId = 0;
    $("#ViewSourceInputBody").hide();
    document.getElementById("subRoutineprogramId").value = fileId;
    searchViewSource();

    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        jQuery.ajax({
            url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?fileId=" + fileId,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSource").innerHTML = tData.SourceData;
                    $("#ViewSourceInputBody").show();
                    $("#viewSourceDialog").modal("show");
                    var searchText = $("#txtSearchKeywords").val();
                    $("#ViewSourceInputModal_SearchBox").val(searchText);
                    $("#ViewSourceInputModal_SearchButton").click();
                }
            }
        });
    }

}

function getObjectStatement(fileId) {
    searchViewSource();
    var searchKeyWord = $("#txtSearchKeywords").val();
    jQuery.ajax({
        url: baseAddress + "QuestionConsole/GetStatementList?fileId=" + fileId + "&keyword=" + searchKeyWord,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            if (typeof tData !== "undefined" && tData !== null) {
                var data = tData.join("\n");
                document.getElementById("treeViewSource").innerHTML = data;
                $("#ViewSourceInputBody").show();
                $("#viewSourceDialog").modal("show");
                var searchText = $("#txtSearchKeywords").val();
                $("#ViewSourceInputModal_SearchBox").val(searchText);
                $("#ViewSourceInputModal_SearchButton").click();
            }
        }
    });
}

function callCustomFileViewPage(projectId, fileId) {
    window.open("customview.html?prjId=" + projectId + "&fileId=" + fileId, "", "width=" + screen.availWidth + ",height=" + screen.availHeight);
}

function exportViewSourceFile() {
    var fileId = document.getElementById("subRoutineprogramId").value;
    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
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
    }
}

function downloadTextFile(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getWokflowData(prjId, stId, aId) {
    document.getElementById("hdnProjectId").value = prjId;
    var searchText = $("#txtSearchKeywords").val();
    var userId = window.localStorage.getItem("userId");
    $.get(baseAddress + "StatementRule/GetPseudoCodePreIndentedData?projectId=" + prjId + "&stmtId=" + stId + "&business=true&pseudo=true&annotate=true&userId=" + userId + "&actionId=" + aId,
        function (tData) {
            if (tData !== null) {
                var secondTab = tData[0].TreeViewListSecondTab;
                $.each(secondTab, function (i, node) {
                    var splitedText = searchText.split(",");
                    for (var j = 0; j < splitedText.length; j++) {
                        var newText = splitedText[j].trim()
                            .replace("$", "\\$")
                            .replace("^", "\\^")
                            .replace("*", "\\*")
                            .replace("[", "\\[")
                            .replace("]", "\\]");
                        var regex = new RegExp("(" + newText + ")", "gi");
                        var line = node.GraphName.replace(regex, "<em  style='background-color: rgb(160, 255, 255); font-style: inherit; color: rgb(0, 0, 0);'>$1</em>");
                        node.GraphName = line;
                    }
                });
                var sourceSecondTab =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" },
                        { name: "ActualStatementId", type: "string" },
                        { name: "NodeId", type: "integer" },
                        { name: "StatementId", type: "StatementId" }
                    ],
                    id: "GraphId",
                    localData: secondTab
                };
                $("#treeExpandedSecondTab").jqxGrid(
                    {
                        width: "99%",
                        height: 500,
                        showheader: false,
                        columnsresize: true,
                        source: sourceSecondTab,
                        scrollmode: "default",
                        scrollfeedback: function (row) {
                            if (row == null) return "";
                            var table = "<table>";
                            var columns = ["firstname", "lastname"];
                            for (var i = 0; i < columns.length; i++) {
                                var field = columns[i];
                                var cellvalue = row[field];
                                table += "<tr><td>" + cellvalue + "</td></tr>";
                            }
                            table += "</table>";
                            return table;
                        },
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ],
                        
                    });
                if (secondTab.length <= 15000) {
                    window.localStorage.setItem("secondTabDataNodes", JSON.stringify(secondTab));
                }
                $body.removeClass("loading");
                doHilight();
                $("#dvStatementBlock").modal("show");
            }
        });
}

function doHilight() {
    var hitHighlighter = new Hilitor("treeExpandedSecondTab");
    hitHighlighter.remove();
    var searchText = $("#txtSearchKeywords").val();
    hitHighlighter.apply(searchText);
    $("#dvStatementBlock").modal("show");
}

function removeHighlighting(highlightedElements) {
    highlightedElements.each(function () {
        var element = $(this);
        element.replaceWith(element.html());
    });
}

function addHighlighting(element, textToHighlight) {
    var text = element.text().trim();
    var newText = highlightWords(text, textToHighlight);
    element.html(newText);
}

function highlightWords(line, word) {
    var regex = new RegExp("(" + word + ")", "gi");
    return line.replace(regex, "<em>$1</em>");
}

var observer = new MutationObserver(function () {
    $("#txtSearch").keyup();
});

function openLink(prjId, stId, aId) {
    var parentWin = window.opener;
    var pageLink = "workflow_workspace.html?prjId=" + prjId + "&stId=" + stId + "&aId=" + aId;
    var url = pageLink; 
    if (parentWin) {
        parentWin.location.href = url;
    } else {
        open(url, "_blank");
    }
}

function getMethodStatements(ctrl) {
    var title = ctrl.title;
    var str = title;
    var statementId = str.split(",")[0];
    var fileId = str.split(",")[1];
    var projectId = document.getElementById("hdnProjectId").value;
    var methodName = str.split(",")[2] + "()";
    jQuery.ajax({
        url: baseAddress + "WorkspaceWorkflow/GetMethodName?statementId=" + statementId + "&fileId=" + fileId + "&methodName=" + methodName + "&projectId=" + projectId,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            if (typeof tData === "number") {
                includeStateDialog(tData);
                $("#dvMethodBlock").modal("hide");
            }
            else {
                var secondTab = tData[0].TreeViewListSecondTab;
                var sourceSecondTab =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" }
                    ],
                    hierarchy:
                    {
                        keyDataField: { name: "GraphId" },
                        parentDataField: { name: "ParentId" }
                    },
                    id: "GraphId",
                    localData: secondTab
                };

                var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                $("#divSecTreeFormatMethodBlock").jqxTreeGrid(
                    {
                        width: "100%",
                        height: 600,
                        source: dataAdapterSecondTab,
                        showHeader: false,
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ]

                    });
                $("#divSecTreeFormatMethodBlock").jqxTreeGrid("expandAll");
                $("#dvMethodBlock").modal("show");
            }
        }
    });
}

function showData(dvCtrl) {
    $("#dvData")[0].innerHTML = dvCtrl.innerHTML;
    $("#viewData").modal("show");
}

function showEntitySchema(ctrl, projectId) {
    var entName = ctrl.title;
    var searchText = $("#txtSearchKeywords").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress +
            "ViewDataBaseSchema/GetEntitySchema?projectId=" + projectId + "&entityName=" + entName,
        success: function (dataBaseSchema) {
            $.each(dataBaseSchema, function (i, node) {
                dataBaseSchema[i].RowId = ++i;
                var splitedText = searchText.split(",");
                for (var j = 0; j < splitedText.length; j++) {
                    var newText = splitedText[j].trim()
                        .replace("$", "\\$")
                        .replace("^", "\\^")
                        .replace("*", "\\*")
                        .replace("[", "\\[")
                        .replace("]", "\\]");
                    var regex = new RegExp("(" + newText + ")", "gi");
                    var eLine = node.EntityName.replace(regex, "<em  style='background-color: rgb(160, 255, 255); font-style: inherit; color: rgb(0, 0, 0);'>$1</em>");
                    node.EntityName = eLine;
                    var fLine = node.FieldName.replace(regex, "<em  style='background-color: rgb(160, 255, 255); font-style: inherit; color: rgb(0, 0, 0);'>$1</em>");
                    node.FieldName = fLine;
                    var lLine = node.Length.replace(regex, "<em  style='background-color: rgb(160, 255, 255); font-style: inherit; color: rgb(0, 0, 0);'>$1</em>");
                    node.Length = lLine;
                    var dtline = node.DataType.replace(regex, "<em  style='background-color: rgb(160, 255, 255); font-style: inherit; color: rgb(0, 0, 0);'>$1</em>");
                    node.DataType = dtline;
                    var descptline = node.Description.replace(regex, "<em  style='background-color: rgb(160, 255, 255); font-style: inherit; color: rgb(0, 0, 0);'>$1</em>");
                    node.Description = descptline;
                }
            });
            document.getElementById("divEntityHeader").innerHTML = "Entity - Attributes for " + entName;
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: "RowId", type: "int" },
                    { name: "EntityName", type: "string" },
                    { name: "FieldName", type: "string" },
                    { name: "Length", type: "string" },
                    { name: "DataType", type: "string" },
                    { name: "Description", type: "string" },
                    { name: "FieldNo", type: "string" }


                ],
                pagesize: 15,
                localdata: dataBaseSchema
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $body.addClass("loading");
            $("#divDatabaseSchema").jqxGrid(
                {
                    width: "100%",
                    height: 300,
                    source: dataAdapter,
                    columnsautoresize: true,
                    columnsresize: true,
                    pageable: true,
                    pagesize: 15,
                    pagermode: "simple",
                    sortable: true,
                    altrows: true,
                    autorowheight: true,
                    autoheight: true,
                    scrollmode: "logical",
                    columns: [
                        { text: "Sr#", datafield: "RowId", width: "5%" },
                        { text: "Entity Name", datafield: "EntityName", width: "10%" },
                        { text: "Attribute Number", datafield: "FieldNo", width: "10" },
                        { text: "Attribute Name", datafield: "FieldName", width: "20%" },
                        { text: "Length", datafield: "Length", width: "7%" },
                        { text: "Data Type", datafield: "DataType", width: "20%" },
                        { text: "Description", datafield: "Description", width: "28%" }
                    ]
                });
            $("#viewEntitySchema").modal("show");
            return false;
        }
    });

}

function showIDespt(ctrl, projectId, iDescptId) {
    var divHeader = ctrl.title;
    var oName = "<span style='color:#555ed3'>" + divHeader + "</span>";
    $("#ViewIDescriptorDataHeader")[0].innerHTML = "Statements in List for Entity - I-Desc " + oName;
    jQuery.ajax({
        type: "GET",
        url: baseAddress +
            "ViewDataBaseSchema/GetIDescriptorStringList?projectId=" +
            projectId + "&descriptorId=" + iDescptId,
        success: function (dataBaseSchema) {
            $("#dvIDescriptorData")[0].innerHTML = dataBaseSchema;
            $("#dvIDescriptorData").find("a").each(function () {
                $(this).css("color", "black");
            });
            $("#viewIDescriptorData").modal("show");
        }
    });
}