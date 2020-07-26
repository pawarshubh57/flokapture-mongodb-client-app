var baseAddress = $.fn.baseAddress();
var prjctId = window.localStorage.getItem("prjctId");
var projectId = getParameterByName("prjId");
var userId = window.localStorage.getItem("userId");
var loginUserInfo = window.localStorage.getItem("login-user-info");
var fileId = getParameterByName("fileId");
var diagram = $.fn.floKaptureDiagram("diagram", false, "#FFFFFF");
var nodesCount = 250;


var $body = $("body");

$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
}); 

$(document).ready(function () {
    document.getElementById("tabCustomView").style.visibility = "initial";
    /*
    const tabMaster = JSON.parse(window.localStorage.getItem("tabs"));
    $("#li_1").hide();
    $("#li_2").hide();
    $("#li_4").hide();
    $("#li-detailed-tagging").hide();
    $("#li_3").hide();
    $("#li_5").hide();
    $("#li_6").hide();
    $("#li_obj-doc").hide();
    $("#li_obj-annotation").hide();
   

    var userInfo = JSON.parse(loginUserInfo);
   
    tabMaster.forEach(function (tab) {
        const tabName = tab.TabName;
        $(`#${tabName}`).show();
    });
    */

    $("#demo-toggle-aside").click(function () {
        if ($("#container").hasClass("aside-in")) {
            $("#container").removeClass("aside-in");
        } else {
            $("#container").addClass("aside-in");
        }
    });
    $("#li_6").hover(function () {
        $(this).css("cursor", "pointer").attr("title", "View / Edit Object Tag(s)");
    }, function () {
        $(this).css("cursor", "auto");
    });
    $("#li_1").hover(function () {
        $(this).css("cursor", "pointer").attr("title", "Source Code View");
    }, function () {
        $(this).css("cursor", "auto");
    });
    $("#li_2").hover(function () {
        $(this).css("cursor", "pointer").attr("title", "Pseudo Tree View");
    }, function () {
        $(this).css("cursor", "auto");
    });
    $("#li_5").hover(function () {
        $(this).css("cursor", "pointer").attr("title", "Workflow Diagram");
    }, function () {
        $(this).css("cursor", "auto");
    });
    $("#li_3").hover(function () {
        $(this).css("cursor", "pointer").attr("title", "Decision Chart");
    }, function () {
        $(this).css("cursor", "auto");
    });
    $("#li_4").hover(function () {
        $(this).css("cursor", "pointer").attr("title", "Pseudo Flat View");
    }, function () {
        $(this).css("cursor", "auto");
    });
    
    $(".collapse").on("shown.bs.collapse", function () {
        var parent = $(this).parent().parent();
        parent.find(".fa-angle-right").removeClass("fa-angle-right").addClass("fa-angle-down");
    });
    $(".collapse").on("hidden.bs.collapse", function () {
        var parent = $(this).parent().parent();
        parent.find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
    });
});

$(document).ready(function () {
    $("#ddlSelectFiles").jqxComboBox("clear");
    fillObjectTypeList();
    if (fileId !== "0" || fileId !== 0) {
        funSearchFiles(0);
    }
    var elem = document.querySelector(".js-switch");
    document.getElementById("dvWorkflowList").style.display = "none";
    document.getElementById("dvSearch").style.display = "none";
   //  $("#tabCustomView").hide();
    $('#tabCustomView a[href="#demo-tabs3-box-3"]').click(function () {
        $("#diagram").empty();
        $("#divDecisionChartHtmlTable").html("");
        document.getElementById("dvWorkflowList").style.display = "inline";
        document.getElementById("dvSearch").style.display = "none";
        var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
        if (item) {
            var fileId = item.value;
            if (fileId === 0) return false;
            document.getElementById("dvWorkflowList").style.display = "inline-block";
            document.getElementById("dvSearch").style.display = "none";
            chkDecisionMatrix();
        }
        return true;
    });

    $('#tabCustomView a[href="#demo-tabs1-box-1"]').click(function () {
        loadFirstTabData();
    });

    $('#tabCustomView a[href="#demo-tabs6-object-documents"]').click(function () {
        document.getElementById("tdError3").innerHTML = "";
        var pid = parseInt(projectId);
        var audit = {
            postData: {
                OptionUsed: "Object Search",
                PrimaryScreen: "Object Search",
                UserId: userId,
                ProjectId: pid,
                BriefDescription: "View / Edit Object Tag(s) tab"
            }
        };
        $.fn.auditActionLog(audit).then(function () {
            return false;
        }).catch(function (e) {
            console.log(e);
            return false;
        });
        showFileUpload();
    });

    $("#txtSearchFile").keypress(function (event) {
        $("#ddlSelectFiles").jqxComboBox("clear");
        if (event.which === 13) {
            $("#btnSearch").click();
        }
    });

    $("#btnGoWorkflow").click(function () {

        $("#diagram").empty();
        var selectTab = $("#tabCustomView li.active a").attr("href");
        if (selectTab === "#demo-tabs3-box-3") {
            $("#divDecisionChartHtmlTable").html("");
            $('#tabCustomView a[href="#demo-tabs3-box-3"]').click();
        }
        else if (selectTab === "#demo-tabs2-box-3") {
            changBgCss();
        }
        else if (selectTab === "#demo-tabs4-box-4") {
            changeThirdTab();
        }
    });

    $("#btnDownloadDecisionChart").click(function () {
        downloadDecisionChart();
    });

    $("#btnDecisionExport").click(function () {
        downloadDecisionChart();
    });
    /* Search */
    var hitHighlighter = new Hilitor("demo-tabs1-box-1");

    $("#btnSearchText").click(function () {
        hitHighlighter.remove();
        var keywords = $("#txtSearchBox").val();
        var words = keywords.split(",").sort(function (a, b) {
            return b.length - a.length;
        });
        var hitCount = 0;
        $.each(words, function () {
            hitHighlighter.apply(this);
            hitCount += hitHighlighter.hitCount;
        });

        if (hitCount === 0) {
            $("#divSearchHitCount").text("no matches found");
        } else {
            $("#divSearchNav").show();
            $("#divSearchHitCount").text(hitCount + (hitCount === 1 ? " match" : " matches"));
        }
    });

    $("#txtSearchBox").keypress(function (e) {
        if (e.keyCode === 13) {
            hitHighlighter.remove();
            var keywords = $("#txtSearchBox").val();
            var words = keywords.split(",").sort(function (a, b) {
                return b.length - a.length;
            });
            var hitCount = 0;
            $.each(words, function () {
                hitHighlighter.apply(this);
                hitCount += hitHighlighter.hitCount;
            });

            if (hitCount === 0) {
                $("#divSearchHitCount").text("no matches found");
            } else {
                $("#divSearchNav").show();
                $("#divSearchHitCount").text(hitCount + (hitCount === 1 ? " match" : " matches"));
            }
        }
    });
 
    $("#btnSearchPrev").click(function () {
        hitHighlighter.prevHit();
    });

    $("#btnSearchNext").click(function () {
        hitHighlighter.nextHit();
    });

    var hitHighlighterNew = new Hilitor("divIncludeFile");

    $("#btnSearchTextNew").click(function () {
        hitHighlighterNew.remove();
        var keywords = $("#txtSearchBoxNew").val();
        var words = keywords.split(",").sort(function (a, b) {
            return b.length - a.length;
        });
        var hitCount = 0;
        $.each(words, function () {
            hitHighlighterNew.apply(this);
            hitCount += hitHighlighterNew.hitCount;
        });

        if (hitCount === 0) {
            $("#divSearchHitCountNew").text("no matches found");
        } else {
            $("#divSearchNavNew").show();
            $("#divSearchHitCountNew").text(hitCount + (hitCount === 1 ? " match" : " matches"));
        }
    });
    $("#txtSearchBoxNew").keypress(function (e) {
        if (e.keyCode === 13) {
            hitHighlighterNew.remove();
            var keywords = $("#txtSearchBoxNew").val();
            var words = keywords.split(",").sort(function (a, b) {
                return b.length - a.length;
            });
            var hitCount = 0;
            $.each(words, function () {
                hitHighlighterNew.apply(this);
                hitCount += hitHighlighterNew.hitCount;
            });

            if (hitCount === 0) {
                $("#divSearchHitCountNew").text("no matches found");
            } else {
                $("#divSearchNavNew").show();
                $("#divSearchHitCountNew").text(hitCount + (hitCount === 1 ? " match" : " matches"));
            }
        }
    });

    $("#btnSearchPrevNew").click(function () {
        hitHighlighterNew.prevHit();
    });

    $("#btnSearchNextNew").click(function () {
        hitHighlighterNew.nextHit();
    });

    $("#txtSearchObject").keypress(function (event) {
        if (event.which === 13) {
            $("#btnSearchObject").click();
        }
    });

    $("#btnSearch").click(function () {
        var keyWord = $("#txtSearchObject").val();
        var item = $("#ddlObjectTypes").jqxComboBox("getSelectedItem");
        var iDesc = item.label;
        if (iDesc === "I-Descriptor" && keyWord === "") {
            // show mesage here...
            $("#tdMsg").html("To search I-Descriptors, please enter Search keyword.");
            $("#tdMsg").attr("style", "color: red;");
            return false;
        }
        funSearchFiles(1);
        return true;
    });

    $("#btnSearchObject").click(function () {
        $("#ddlSelectFiles").jqxComboBox("clear");
        var fileType = $("#ddlObjectTypes").val();
        var keyWord = $("#txtSearchObject").val();
        var item = $("#ddlObjectTypes").jqxComboBox("getSelectedItem");
        var iDesc = item.label;
        if (iDesc === "I-Descriptor" && keyWord === "") {
            // show mesage here...
            $("#tdMsg").html("To search I-Descriptors, please enter Search keyword.");
            $("#tdMsg").attr("style", "color: red;");
            return false;
        }
        if (fileType === "0") {
            document.getElementById("tdError").innerHTML = "Please select object type";
            $("#ddlObjectTypes").focus();
            $("#ddlObjectTypes").css("border-color", "red");
            $("#ddlObjectTypes").on("click", function () {
                $(this).css("border-color", "");
                document.getElementById("tdError").innerHTML = "";
            });
            return false;
        }
        $(".nav-tabs a:first").tab("show");

        funSearchFiles(1);
    });
});

$(document).ready(function () {
    var checkedRows = window.localStorage.getItem("selectedRows");
    var rowData = JSON.parse(checkedRows);
    var table = $("#tblSelectedRows");
    table.html("");
    if (rowData !== null) {
        $.each(rowData,
            function (i, row) {
                drawRowStmt((i + 1), table, row);
            });
    }

    $("#rteStatementsNote").ejRTE({ width: "100%", height: "285px", isResponsive: true });
    $("#rteObjectAnnotations").ejRTE({ width: "100%", height: "285px", isResponsive: true });
    bindCatalogs();

    $("#btnSubmitCatalog").click(function () {
        var catalogName = $("#txtCatalogName").val();
        if (catalogName === "") {
            document.getElementById("tdError").innerHTML = "Please enter Catalog name";
            $("#txtCatalogName").focus();
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CatalogMaster/AddCatalog?catalogName=" + catalogName,
            success: function (cData) {
                if (cData != null) {
                    bindCatalogs();
                    $("#dvCatalog").modal("hide");
                }
            },
            statusCode: {
                400: function (response) {
                    document.getElementById("tdError").innerHTML = response.responseJSON.Message;
                }
            },
            error: function () {
                document.getElementById("tdError").innerHTML = "Error while connecting to API";
            }
        });
        return true;
    });

    $("#btnSubmitRule").click(function () {
        if ($("#ddlCatalogs").val() === "0") {
            $("#tdError12")[0].innerHTML = "Please select catalog";
            $("#ddlCatalogs").focus();
            return false;
        }
        if ($("#txtRuleName").val() === "") {
            $("#tdError12")[0].innerHTML = "Please enter Business name";
            $("#txtRuleName").focus();
            return false;
        }
        createRuleForSelectedStatements();
        return false;
    });

    $("#objectTags").removeData();
    $("#objectTags").html("");
    $("#objectTags").empty();
    getObjectAnnotations();
    $("#tdAnnotnMsg").html("").css("color", "green");
});

function getMethodStatements(ctrl) {
    var title = ctrl.title;
    var str = title;
    var statementId = str.split(",")[0];
    var fileId = str.split(",")[1];
    var projectId = getParameterByName("prjId");
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

function getTagNameData(projectId, programId) {
    $("#objectTags").removeData(); $("#objectTags").html(""); $("#objectTags").empty();
    $.get(baseAddress + "WorkspaceWorkflow/GetProgramTagsData?projectId=" + projectId + "&programId=" + programId,
        function (tData) {
            // var eventTags = $("#objectTags");
            for (var k = 0; k < tData.length; k++) {
                var data = tData[k];
                var tagName = data.TagName + " (" + data.TagsMaster.TagType + ")";
                var deleteTag = "<button type='button' onclick='deleteTag(this)' title=" + data.TagId + " ><i class='fa fa-trash' aria-hidden='true'></i></ button > ";
                var finalStr = "<tr><td style='width: 30%;'><li>" + tagName + "</li></td>" +
                    "<td style='vertical-align: top; padding-top: 3px;'>" + deleteTag + "</td></tr></table>";
                $("#objectTags").append(finalStr);
            }
        });
}

var deleteTag = function (ctrl) {
    var tagId = ctrl.title;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagMaster/DeleteTag?tagId=" + tagId,
        success: function (result) {
            console.log(result);
            var programId = $("#ddlSelectFiles").val();
            getTagNameData(projectId, programId);
        }
    });
};

var showFileUpload = function () {
    var programId = $("#ddlSelectFiles").val();
    $("#divFileUpload").ejUploadbox({
        width: "100px",
        height: "26px",
        multipleFilesSelection: false,
        dialogText: { title: "Upload Files" },
        dialogAction: { closeOnComplete: true, modal: true },
        buttonText: { browse: "Browse...", upload: "Upload", cancel: "Cancel" },
        customFileDetails: { title: true, name: true, size: true, status: true, action: true },
        saveUrl: "handlers/ObjectDocument.ashx",
        removeUrl: "",
        fileSize: 999999999,
        showBrowseButton: true,
        begin: function (args) {
            var saveUrl = "handlers/ObjectDocument.ashx?programId=" + programId;
            args.model.saveUrl = saveUrl;
        },
        complete: function (args) {
            var fileName = args.files.name;
            var serverResponce = args.responseText;
            if (fileName !== "") {
                var oType = $("#ddlObjectTypes").find("input").attr("value");
                var fName = $("#ddlSelectFiles").find("input").attr("value");
                var pid = parseInt(projectId);
                var audit = {
                    postData: {
                        OptionUsed: "Object Search",
                        PrimaryScreen: "Object Search",
                        UserId: userId,
                        ProjectId: pid,
                        BriefDescription: "Uploaded Object Document: <b>" + fileName + "</b> with Object Type: <b>" + oType + "</b> and Keyword: <b>" + $("#txtSearchObject").val() + "</b> for Object: <b>" + fName + "</ b>"
                    }
                };
                $.fn.auditActionLog(audit).then(function () {
                    saveObjectDocuments(serverResponce, fileName);
                    document.getElementById("tdError3").innerHTML = "File uploaded successfully";
                    document.getElementById("tdError3").style.color = "green";
                    return false;
                }).catch(function (e) {
                    console.log(e);
                    return false;
                });
            }
            else {
                document.getElementById("tdError3").innerHTML = "Error occured. Please try again";
                document.getElementById("tdError3").style.color = "red";
            }
        },
        error: function (args) {
            console.log(args);
        },
        fileSelect: function (args) {
            console.log(args);
        }
    });
    getCurrentAttachement(programId);
};

function saveObjectDocuments(path, fileName) {
    var programId = $("#ddlSelectFiles").val();
    var objectDoc = {
        "ObjectDocId": 0,
        "ProgramId": programId,
        "FilePath": path,
        "ProjectId": projectId,
        "UploadedDate": new Date().toLocaleDateString("en-US"),
        "UploadedBy": userId,
        "IsDeleted": "0",
        "FileName": fileName
    };
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "CustomView/SaveObjectDocumentFile",
        data: objectDoc, 
        success: function (result) {
            if (result !== null) {
                getCurrentAttachement(programId);
            }
        }
    });
}

function getCurrentAttachement(programId) {
    $.ajaxSetup({
        async: false
    });
    $("#divAttachementFilesBody").html("");
    var uploadedFiles = $("#divAttachementFilesBody");
    uploadedFiles.html();
    var srNo = 0;
    objectDocument.getAttachementObjects(programId, projectId).then(function (d) {
        d.forEach(function (object) {
            srNo++;
            var headerRow = $("<tr />");
            headerRow.append($("<td />").append($("<label />").attr({ "class": "form-checkbox form-icon" })
                .append($("<input />").attr({ "type": "checkbox" }).attr({ id: object.ObjectDocId })
                    .attr({ lang: object.FileName }))));
            headerRow.append($("<td />").append(srNo));
            var downloadLink = object.FilePath.replace(/C:\\inetpub\\wwwroot\\flokapture\\/i, "");
            var imgLink = downloadLink.replace(/\\/g, "\\\\");
            var aLink = $("<a />").css({ color: "#296bb1", "text-decoration": "underline", "cursor": "pointer" })
                .attr({ href: "javascript:window.open('" + imgLink + "', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,width=1200,height=600');" })
                .html(object.FileName);
            headerRow.append($("<td />").append(aLink));
            headerRow.append($("<td />").append(object.UploadedDate));

            var aEle = $("<a />").css({ color: "#296bb1", "text-decoration": "underline", "cursor": "pointer" }).on("click", { dLink: downloadLink }, function (evt) {
                var fileLink = evt.data.dLink;
                downloadFile(fileLink);
            });
            aEle.append($("<i />").css({ "font-size": "1.5em" }).attr({ "class": "fa fa-download" }));
            headerRow.append($("<td />").append(aEle));
            uploadedFiles.append(headerRow);
        });
    });
}

function zoomIn(event) {
    var element = document.getElementById("overlay");
    var imgLink = event.data.iLink.replace(/\\/g, "\\\\");
    element.style.display = "inline-block";
    var img = document.getElementById("imgZoom");
    var posX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
    var posY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
    element.style.backgroundPosition = (-posX * 2) + "px " + (-posY * 4) + "px";
    element.style.backgroundImage = "url(" + imgLink + ")";
}

function zoomOut() {
    var element = document.getElementById("overlay");
    element.style.display = "none";
}

function deleteObjectDocuments() {
    var programId = $("#ddlSelectFiles").val();
    var objectDocument = [];
    var oType = $("#ddlObjectTypes").find("input").attr("value");
    var fName = $("#ddlSelectFiles").find("input").attr("value");
    var deletedFiles = "";
    var pid = parseInt(projectId);
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Deleted Object Document" //"Upload Object Document: <b>" + fileName + "</b> with Object Type: <b>" + oType + "</b> and Keyword: <b>" + $("#txtSearchObject").val() + "</b> for Object: <b>" + fName + "</ b>"
        }
    };
    $("#divAttachementFilesBody tr").each(function (i, row) {
        $(this).find(":checkbox:checked").each(function () {
            var id = $(this).attr("id");
            var fileName = $(this).attr("lang");
            deletedFiles += fileName + ",";
            objectDocument.push({
                ObjectDocId: id,
                FileName: "",
                ProgramId: programId,
                UploadedBy: 0,
                IsDeleted: 0
            });
        });
    });
    if (objectDocument.length <= 0) return false;
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "CustomView/DeleteObjectDocuments",
        data: { ObjectDocumentList: objectDocument },
        success: function (data) {
            if (data !== null) {
                deletedFiles = deletedFiles.slice(0, -1);
                audit.postData.BriefDescription = "Deleted Object Document: <b>" + deletedFiles + "</b> with Object Type: <b>" + oType + "</b> and Keyword: <b>" + $("#txtSearchObject").val() + "</b> for Object: <b>" + fName + "</ b>";
                $.fn.auditActionLog(audit).then(function () {
                    document.getElementById("tdError3").innerHTML = "Files deleted successfully";
                    document.getElementById("tdError3").style.color = "green";
                    $("#divAttachementFiles").jqxGrid("clear");
                    $("#divAttachementFilesBody").html("");

                    getCurrentAttachement(programId);
                    return false;
                }).catch(function (e) {
                    console.log(e);
                    return false;
                });
            }
            return false;
        }
    });
    return true;
}

function addTagName(projectId, programId, tagName) {
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkspaceWorkflow/addTags?projectId=" + projectId + "&programId=" + programId + "&tagName=" + tagName,
        success: function (result) {
            $("#objectTags").removeData();
            $("#objectTags").html("");
            $("#objectTags").empty();
            var array = result.split(",");
            for (var j = 0; j < array.length; j++) {
                if (array[j] === "") continue;
                $("#objectTags").append("<li>" + array[j] + "</li>");
            }
        }
    });
}

function updateTagName(projectId, programId, tagName, flag) {
    $.get(baseAddress + "WorkspaceWorkflow/UpdateProgramTags?projectId=" + projectId + "&programId=" + programId + "&tagName=" + tagName + "&flag=" + flag,
        function (tags) {
            $("#objectTags").removeData();
            $("#objectTags").html("");
            $("#objectTags").empty();
            var array = tags.split(",");
            for (var j = 0; j < array.length; j++) {
                if (array[j] === "") continue;
                $("#objectTags").append("<li>" + array[j] + "</li>");
            }
        });
}

var getObjectAnnotations = function () {
    var programId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
    jQuery.ajax({
        method: "GET",
        url: baseAddress + "CustomView/GetObjectAnnotations?programId=" + programId
    }).done(function (oa) {
        var rteObj = $("#rteObjectAnnotations").data("ejRTE");
        var objAnnotation = oa.length > 0 ? oa[0] : { AnnotationHtml: "" };
        rteObj.setHtml(objAnnotation.AnnotationHtml);
    }).fail(function (e) { console.log(e); });
};

var addObjectAnnotations = function () {
    $("#tdAnnotnMsg").html("").css("color", "green");
    var programId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
    var rteObj = $("#rteObjectAnnotations").data("ejRTE");
    var rteHtml = rteObj.getHtml();
    var pid = parseInt(projectId);

    var objectAnnotations = {
        ObjectAnnotationId: 0,
        FileOrObjectId: programId,
        AnnotationHtml: rteHtml,
        ProjectId: pid,
        AnnotatedBy: parseInt(userId),
        AnnotatedOn: new Date().toLocaleDateString("en-US")
    };

    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Added Annotations"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
        jQuery.ajax({
            method: "POST",
            url: baseAddress + "CustomView/AddObjectAnnotations",
            data: objectAnnotations
        }).done(function (oa) {
            console.log(oa);
            $("#tdAnnotnMsg").html("Annotations saved successfully.").css("color", "green");
        }).fail(function (e) { console.log(e); });
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });
};

function fillObjectTypeList() {
    var pId = getParameterByName("prjId");
    var fileId = getParameterByName("fileId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomView/GetObjectType?projectId=" + pId + "&fileId=" + fileId,
        success: function (result) {
            if (result !== null) {
                $("#ddlObjectTypes").jqxComboBox({
                    source: result,
                    displayMember: "Name",
                    valueMember: "Value",
                    width: "250",
                    height: "25px"
                });
                $("#ddlObjectTypes").on("change", function (event) {
                    clearGidForObjectType();
                    var args = event.args;
                    if (args) {
                        $("#txtSearchObject").val("");
                    }
                });
            }
        }
    });
}

function funSearchFiles(from) {
    $("#tdMsg").html("");
    $("#treeAssociationsTab").jqxTreeGrid("clear");
    $("#treeDataDependency").jqxTreeGrid("clear");
    $("#ddlSelectFiles").jqxComboBox("clear");
    $("#ddlSelectFiles").jqxComboBox({
        source: [],
        width: "250",
        height: "25px",
        displayMember: "FileName",
        valueMember: "FileId",
        autoComplete: true
    });
    clearGidForObjectType(); 
    var extensionType = $("#ddlObjectTypes").jqxComboBox("val");
    if (typeof extensionType === "undefined") {
        extensionType = 0;
    }
    var fileId = 0;
    if (from !== 1) {
        fileId = getParameterByName("fileId");
    }
    if (extensionType === "0" || extensionType === "") {
        document.getElementById("tdError").innerHTML = "Please select object type";
        $("#ddlObjectTypes").focus();
        $("#ddlObjectTypes").css("border-color", "red");
        $("#ddlObjectTypes").on("click", function () {
            $(this).css("border-color", "");
            document.getElementById("tdError").innerHTML = "";
        });
        return false;
    }
    var keyWord = $("#txtSearchObject").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress +
            "CustomView/GetAllFileName?extensionTypeId=" +
            extensionType + "&projectId=" + projectId + "&keyWord=" + keyWord + "&fileId=" + fileId,
        success: function (data) {
            if (data != null) {
                $("#ddlSelectFiles").jqxComboBox({
                    source: data,
                    selectedIndex: 0,
                    width: "250",
                    height: "25px",
                    displayMember: "FileName",
                    valueMember: "FileId",
                    autoComplete: true
                });
                $("#ddlSelectFiles").on("change", function (event) {
                    clearGidForObjectType();
                });
            }
            var flId = parseInt(fileId);
            if (flId !== 0) {
                if (typeof data !== "undefined" && data !== null) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].FileId !== flId) continue;
                        $("#ddlSelectFiles").jqxComboBox("val", data[i].FileId);
                        $("#ddlObjectTypes").jqxComboBox("val", data[i].FileTypeExtensionId);
                        $("#btnSubmit").click();
                        break;
                    }
                } else {
                    $("#btnSubmit").click();
                }
            }
        }
    });
}

function showIdescriptorDetails() {
    var entityId = $("#ddlSelectFiles").val();
    document.getElementById("FileDetails").style.display = "none";
    document.getElementById("EntityDetails").style.display = "none";
    document.getElementById("descriptorDetails").style.display = "inline";
    document.getElementById("descriptorTagDetails").style.display = "none";
    jQuery.ajax({
        url: baseAddress + "CustomView/GetUniverseDescriptor?projectId=" + projectId + "&decriptorId=" + entityId,
        type: "GET",
        success: function (result) {
            if (result !== null) {
                $("#divDescriptor").ejGrid({
                    width: "100%",
                    dataSource: result,
                    allowResizing: true,
                    allowResizeToFit: true,
                    pageSettings: { pageSize: 20 },
                    allowScrolling: false,
                    columns: [
                        { field: "Entity", headerText: "Entity Name", width: 100 },
                        { field: "StoredProcedureName", headerText: "Object Name", width: 100 },
                        { field: "Type", headerText: "Type", width: 40 },
                        { field: "StatementsListed", headerText: "Statements in List", width: 250 },
                        // { field: "StatementString", headerText: "Statement String", width: 100 },
                        { field: "DefaultReportDisplayHeading", headerText: "Default Report Display Heading", width: 80 },
                        { field: "DefaultFormating", headerText: "Default Formating", width: 100 },
                        { field: "DefaultConversion", headerText: "Default Conversion", width: 100 },
                        { field: "ValuedAssociation", headerText: "Valued Association", width: 100 },
                        { field: "LongDescription", headerText: "Long Description", width: 100 }
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
    });

}

function showEntityDetails() {

    clearGidForObjectType(); // clear grid of entity & i-descriptor

    var entityId = $("#ddlSelectFiles").val();
    var entityName = "";
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    if (typeof item !== "undefined" && item !== null) {
        entityName = item.label;
    }
    document.getElementById("FileDetails").style.display = "none";
    document.getElementById("EntityDetails").style.display = "inline";
    document.getElementById("descriptorDetails").style.display = "none";
    document.getElementById("descriptorTagDetails").style.display = "none";
    // $("#EntityDetails")[0].style.visibility = "visible";

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "ViewDataBaseSchema/GetViewDatabaseSchema?projectId=" + projectId + "&entityId=" + entityId + "&entityName=" + entityName,
        success: function (entryPoints) {
            if (entryPoints !== null && typeof entryPoints !== "undefined") {
                var dataBaseSchema = entryPoints.DatabaseSchema;
                var universeDescriptor = entryPoints.UniverseDescriptor;
                var dependentEntities = entryPoints.DependentEntities;
                $("#CntEntityAtt")[0].innerHTML = " - (Total: " + dataBaseSchema.length + ")";
                $("#CntEntityIDescpt")[0].innerHTML = " - (Total: " + universeDescriptor.length + ")";
                $("#CntEntityReferences")[0].innerHTML = " - (Total: " + dependentEntities.length + ")";
                $.each(dataBaseSchema, function (i, r) {
                    dataBaseSchema[i].RowId = ++i;
                });
                $.each(universeDescriptor, function (i, r) {
                    universeDescriptor[i].RowId = ++i;
                });
                $.each(dependentEntities, function (i, r) {
                    dependentEntities[i].RowId = ++i;
                });
                $("#divDatabaseSchema").ejGrid({
                    width: "100%",
                    dataSource: dataBaseSchema,
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
                        { field: "RowId", headerText: "Sr#", width: 50 },
                        { field: "EntityName", headerText: "Entity Name", width: 150 },
                        { field: "FieldNo", headerText: "Attribute Number", width: 150 },
                        { field: "FieldName", headerText: "Object Name", width: 150 },
                        { field: "Length", headerText: "Length", width: 100 },
                        { field: "DataType", headerText: "Data Type", width: 250 },
                        { field: "Description", headerText: "Description", width: 400 }
                    ],
                    queryCellInfo: function (args) {
                        $(args.cell).attr({
                            "data-toggle": "tooltip",
                            "data-container": "body",
                            "title": args.data[args.column.field]
                        });
                    },
                    toolbarClick: function (e) {
                        var gridObj = $("#divDatabaseSchema")[0];
                        if (e.itemName === "Excel Export") {
                            exportGrid(gridObj, "Entity-Attributes.xlsx");
                            return false;
                        }
                        return true;
                    }
                });
                $("#divUniverseDecriptor").ejGrid({
                    width: "100%",
                    dataSource: universeDescriptor,
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
                        { field: "RowId", headerText: "Sr#", width: 50 },
                        { field: "Entity", headerText: "Entity Name", width: 120 },
                        { field: "StoredProcedureName", headerText: "Object Name", width: 170 },
                        { field: "Type", headerText: "Type", width: 50 },
                        { field: "StatementString", headerText: "Statement String", width: 160 },
                        { field: "DefaultReportDisplayHeading", headerText: "Default Report Display Heading", width: 180 },
                        { field: "DefaultFormating", headerText: "Default Formating", width: 100 },
                        { field: "DefaultConversion", headerText: "Default Conversion", width: 100 },
                        { field: "ValuedAssociation", headerText: "Valued Association", width: 120 },
                        { field: "LongDescription", headerText: "Long Description", width: 220 }

                    ],
                    //queryCellInfo: function (args) {
                    //    $(args.cell).attr({
                    //        "data-toggle": "tooltip",
                    //        "data-container": "body",
                    //        "title": args.data[args.column.field]
                    //    });
                    //},
                    toolbarClick: function (e) {
                        var gridObj = $("#divUniverseDecriptor")[0];
                        if (e.itemName === "Excel Export") {
                            exportGrid(gridObj, "Entity-Decriptor.xlsx");
                            return false;
                        }
                        return true;
                        /*
                        $body.addClass("loading");
                        var gridObjDescriptor = $("#divUniverseDecriptor")[0];
                        exportGrid(gridObjDescriptor);
                        $body.removeClass("loading");
                        return false;
                        */
                    }
                });

                $("#AssDepEntities").ejGrid({
                    width: "80%",
                    dataSource: dependentEntities,
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
                        { field: "RowId", headerText: "Sr#", width: 100 },
                        { field: "DependentEntity", headerText: "Entity Name", width: 500 },
                        { field: "DescriptorName", headerText: "I-Descriptor Name", width: 430 }
                    ],
                    queryCellInfo: function (args) {
                        $(args.cell).attr({
                            "data-toggle": "tooltip",
                            "data-container": "body",
                            "title": args.data[args.column.field]
                        });
                    },
                    toolbarClick: function (e) {
                        var gridObjAss = $("#AssDepEntities")[0];
                        if (e.itemName === "Excel Export") {
                            exportGrid(gridObjAss, "Entity-References.xlsx");
                            return false;
                        }
                        return true;
                    }
                });
            }
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

function exportGrid(tableName, fileName) {
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
            var element = document.createElement("a");
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

$("#btnDwnldProcF").click(function () {
    downloadDiagram();
});

function showData(dvCtrl) {
    var element = document.getElementById(dvCtrl);
    var divHeader = element.lang;
    $("#dvData")[0].innerHTML = element.innerHTML;
    var oName = "<span style='color:#555ed3'>" + divHeader + "</span>";
    $("#ViewDataHeader")[0].innerHTML = "Statements in List for " + oName;
    $("#dvData").find("a").each(function () {
        $(this).css("color", "black");
    });
    $("#viewData").modal("show");
    // var ctrlId = dvCtrl.id;
    // var selectedrowindex = $('#divUniverseDecriptor').jqxGrid('selectedrowindex');
    // var objectName = $('#divUniverseDecriptor').jqxGrid('getcelltext', selectedrowindex, "ObjectName");
    // var objName = $(objectName).text();
    //var oName = "<span style='color:#555ed3'>" + objName + "</span>";
    // if (ctrlId.startsWith("dvObjects_")) {
    //    $("#ViewDataHeader")[0].innerHTML = "Statements in List";
    // }
    // $("#viewData").modal("show");
}

function funBtnSubmit() {
    document.getElementById("tdErr2").innerHTML = "";
    // $("#jqxTagFormattedView").html("").css({ "class": "", style: "" });
    $("#jqxTagFormattedView").jqxGrid(
        {
            width: "100%", height: "5px", source: [], columns: [{ text: "GraphName", dataField: "GraphName" }]
        });
    $("#objectBusinessTags").empty();
    document.getElementById("treeViewSource").innerHTML = "";
    $("#tdAnnotnMsg").html("").css("color", "green");
    $("#txtSearchBox").val("");
    $("#divSearchHitCount").html("");
    $("#jqxFormattedSource").jqxGrid("clear");
    $("#jqxFormattedSource").jqxGrid("refresh");
    var selectedObject = $("#ddlObjectTypes").val();
    var pid = parseInt(projectId);
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: ""
        }
    };

    if (selectedObject === 11) { // for entity
        var entityName = "";
        var im = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
        if (typeof im !== "undefined" && im !== null) {
            entityName = im.label;
        }
        audit.postData.BriefDescription = "Search for Entity: <b>" + entityName + "</ b>, Object Type: Entity";
        $.fn.auditActionLog(audit).then(function () {
            showEntityDetails();
            return false;
        }).catch(function (e) {
            console.log(e);
            return false;
        });
    }

    if (selectedObject === 18) { // for iDescriptor
        var iDescriptor = $("#ddlSelectFiles").find("input").attr("value");
        audit.postData.BriefDescription = "Search for I-Descriptor: <b>" + iDescriptor + "</ b>, Object Type: I-Descriptor";
        $.fn.auditActionLog(audit).then(function () {
            showIdescriptorDetails();
            return false;
        }).catch(function (e) {
            console.log(e);
            return false;
        });
    }
    document.getElementById("FileDetails").style.display = "inline";
    document.getElementById("EntityDetails").style.display = "none";
    document.getElementById("descriptorDetails").style.display = "none";

    document.getElementById("dvWorkflowList").style.display = "none";
    document.getElementById("dvSearch").style.display = "inline-block";
    // document.getElementById("btnGoWorkflow").style.display = "inline";
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = 0;
    if (typeof item !== "undefined" && item !== null) {
        fileId = item.value;
    }
    var oType = $("#ddlObjectTypes").find("input").attr("value");
    var fileName = $("#ddlSelectFiles").find("input").attr("value");
    audit.postData.BriefDescription = "Search with Object Type: <b>" + oType + "</b> and Keyword: <b>" + $("#txtSearchObject").val() + "</b> for Object: <b>" + fileName + "</ b>";
    $.fn.auditActionLog(audit).then(function (d) {
        console.log(d);
        if (fileId === 0) return false;
        includeStateDialogFirstTab(fileId);
        var prjId = parseInt(projectId);
        $(".nav-tabs a:eq(0)").tab("show");
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetAllStatementWorkflows?fileId=" + fileId + "&projectId=" + prjId,
            success: function (data) {
                if (data !== null && typeof data !== "undefined") {
                    $("#ddlFileWorkflows").jqxComboBox({ disabled: false });
                    var html = [];
                    for (var i = 0; i < data.length; i++) {
                        html.push({
                            label: "<div tabIndex=0 style='padding: 1px;'><div> " + data[i].OriginalStatement + "</div></div>",
                            value: data[i].StatementId
                        });
                    }
                    $("#ddlFileWorkflows").jqxComboBox({ source: html, width: "350", height: "25px" });
                    $("#ddlFileWorkflows").jqxComboBox("selectItem", html[0]);
                    $("#tabCustomView").show();
                    $("#treeAssociationsTab").jqxTreeGrid("clear");
                    $("#treeDataDependency").jqxTreeGrid("clear");
                    loadProjectAssociationData(projectId, fileId);
                    loadProjectDataDependency(projectId, fileId);
                    $("#ddlFileWorkflows").on("select", function (event) {
                    });
                }
                $body.removeClass("loading");
            }
        });
    }).catch(function (e) {
        console.log(e);
        $body.removeClass("loading");
        return false;
    });
    var programId = $("#ddlSelectFiles").val();
    getTagNameData(projectId, programId);
    getObjectAnnotations();
    return true;
}
/* First Tab*/
function loadFirstTabData() {
    document.getElementById("dvWorkflowList").style.display = "none";
    document.getElementById("dvSearch").style.display = "inline-block";
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    if (fileId === 0) return false;
    var pid = parseInt(projectId);
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Viewed Flat View of the file tab"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
        includeStateDialogFirstTab(fileId);
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });
}

function includeStateDialog(fileId) {
    // $("#ViewSourceInputBodyFirstTab").hide();
    document.getElementById("subRoutineprogramId").value = fileId;
    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        var pId = getParameterByName("prjId");
        jQuery.ajax({
            url: baseAddress + "CustomView/GetViewSourceData?projectId=" + pId + "&fileId=" + fileId,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData !== null) {
                    document.getElementById("treeViewSourceNew").innerHTML = tData;
                    $("#ViewSourceInputBody").show();
                    $("#viewSourceDialogFirstTab").modal("show");
                }
            }
        });
    }
}

function includeStateDialogFirstTab(fileId) {
    var hitHighlighter = new Hilitor("demo-tabs1-box-1");
    hitHighlighter.setMatchType("open");
    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        var pId = getParameterByName("prjId");
        jQuery.ajax({
            url: baseAddress + "CustomView/GetViewSourceData?projectId=" + pId + "&fileId=" + fileId,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSource").innerHTML = "";
                    document.getElementById("treeViewSource").innerHTML = tData;
                }
            }
        });
    }
}

/* Second Tab*/

function callSecondTab(option) {
    var treeFun = document.getElementById("chkTreeView");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text");
    // var pseudoFun = document.getElementById("chkPseudoCode");
    var parentPseudo = pseudoFun.parentElement;
    $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");
    if (option === 1) {
        document.getElementById("chkTreeView").checked = false;
        // document.getElementById("chkPseudoCode").checked = true;
        $(parentPseudo).prop("className", "form-checkbox form-icon form-text active");
    }
    else if (option === 2) {
        // document.getElementById("chkPseudoCode").checked = false;
        document.getElementById("chkTreeView").checked = true;
        $(parentTree).prop("className", "form-checkbox form-icon form-text active");
    }
    // var chkPseudo = document.getElementById("chkPseudoCode").checked;
    var chkTree = document.getElementById("chkTreeView").checked;
    callPseudoOrTreeCode(true, chkTree);
}

function callPseudoOrTreeCode(chkPseudo, chkTree) {

    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    if (fileId === 0) return false;
    if (chkPseudo) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetPseudoCodeCustomTreeView?projectId=" + projectId + "&fileId=" + fileId + "&pseudoCode=" + chkPseudo,
            success: function (data) {
                if (data !== null) {
                    var dataSource = data;
                    var sourceSecondTab =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: "GraphId", type: "string" },
                            { name: "ParentId", type: "string" },
                            { name: "GraphName", type: "string" },
                            { name: "ActualStatementId", type: "string" },
                            { name: "NodeId", type: "integer" },
                            { name: "StatementId", type: "interger" }
                        ],
                        id: "GraphId",
                        localData: dataSource
                    };
                    $("#jqGirdFirstTab").jqxGrid(
                        {
                            width: "100%",
                            height: 850,
                            source: sourceSecondTab,
                            showheader: false,
                            sortable: true,
                            scrollbarsize: 22,
                            scrollmode: "logical",
                            columns: [
                                { text: "GraphName", dataField: "GraphName" }
                            ]
                        });
                    document.getElementById("divFirstNew").style.display = "inline";
                    document.getElementById("divFirstOld").style.display = "none";
                }
            }
        });
    }
    else if (chkTree) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetPseudoCodeCustomTreeView?projectId=" + projectId + "&fileId=" + fileId + "&pseudoCode=" + chkPseudo,
            success: function (data) {
                if (data !== null) {
                    var dataSource = data;
                    var sourceSecondTab =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: "GraphId", type: "string" },
                            { name: "ParentId", type: "string" },
                            { name: "GraphName", type: "string" },
                            { name: "ActualStatementId", type: "string" },
                            { name: "NodeId", type: "integer" },
                            { name: "StatementId", type: "interger" }
                        ],
                        hierarchy:
                        {
                            keyDataField: { name: "GraphId" },
                            parentDataField: { name: "ParentId" }
                        },
                        id: "GraphId",
                        localData: dataSource
                    };
                    var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                    $("#jqTreeFirstTab").jqxTreeGrid(
                        {
                            width: "100%",
                            height: 850,
                            source: dataAdapterSecondTab,
                            showHeader: false,
                            columns: [
                                { text: "GraphName", dataField: "GraphName" }
                            ]
                        });
                    document.getElementById("divFirstNew").style.display = "none";
                    document.getElementById("divFirstOld").style.display = "inline";
                }
            }
        });
    }
    return true;
}

function changeSecondTab() {
    document.getElementById("chkTreeView").checked = true;
    var treeFun = document.getElementById("chkTreeView");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text");
    var expandFun = document.getElementById("chkExpandAll");
    var parentExpand = expandFun.parentElement;
    $(parentExpand).prop("className", "form-checkbox form-icon form-text");
    document.getElementById("divExpand").style.display = "none";
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = 0;
    if (typeof item !== "undefined" && item !== null) {
        fileId = item.value;
    }
    if (fileId === 0) return false;
    var pid = parseInt(projectId);
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Viewed Pseudo code with treeview tab"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
        callTreeView();
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });
    document.getElementById("dvWorkflowList").style.display = "none";
    document.getElementById("dvSearch").style.display = "none";
    return true;
}

function callPseudoView() {
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fId = item.value;
    if (fId === 0) return false;
    var treeFun = document.getElementById("chkTreeView");
    var parentTree = treeFun.parentElement;
    $(parentTree).prop("className", "form-checkbox form-icon form-text");
    var expandFun = document.getElementById("chkExpandAll");
    var parentExpand = expandFun.parentElement;
    $(parentExpand).prop("className", "form-checkbox form-icon form-text");
    document.getElementById("divExpand").style.display = "none";
    var chkPseudo = true; // document.getElementById("chkPseudoCode").checked;
  
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomView/GetPseudoCodeCustomTreeView?projectId=" + projectId + "&fileId=" + fId + "&pseudoCode=" + chkPseudo,
        success: function (data) {
            if (data !== null) {
                var dataSource = data;
                var sourceSecondTab =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" },
                        { name: "ActualStatementId", type: "string" },
                        { name: "NodeId", type: "integer" },
                        { name: "StatementId", type: "interger" }
                    ],
                    id: "GraphId",
                    localData: dataSource
                };

                $("#jqGirdFirstTab").jqxGrid(
                    {
                        width: "100%",
                        height: 850,
                        source: sourceSecondTab,
                        showheader: false,
                        sortable: true,
                        scrollbarsize: 22,
                        scrollmode: "logical",
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ]
                    });
                document.getElementById("divFirstNew").style.display = "inline";
                document.getElementById("divFirstOld").style.display = "none";
            }
        }
    });
}


function callTreeView() {
    $body.addClass("loading");
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    if (fileId === 0) return false;
   document.getElementById("divExpand").style.display = "inline";
    var chkTree = document.getElementById("chkTreeView").checked;
    var chkPseudo = true; 
    if (chkTree) {
        document.getElementById("chkTreeView").checked = true;
        var treeFun = document.getElementById("chkTreeView");
        var parentTree = treeFun.parentElement;
        $(parentTree).prop("className", "form-checkbox form-icon form-text active");
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetPseudoCodeCustomTreeView?projectId=" + projectId + "&fileId=" + fileId + "&pseudoCode=" + chkPseudo,
            success: function (data) {
                $body.removeClass("loading");
                if (data !== null) {
                    var dataSource = data;
                    var sourceSecondTab =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: "GraphId", type: "string" },
                            { name: "ParentId", type: "string" },
                            { name: "GraphName", type: "string" },
                            { name: "ActualStatementId", type: "string" },
                            { name: "NodeId", type: "integer" },
                            { name: "StatementId", type: "interger" }
                        ],
                        hierarchy:
                        {
                            keyDataField: { name: "GraphId" },
                            parentDataField: { name: "ParentId" }
                        },
                        id: "GraphId",
                        localData: dataSource
                    };
                    var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                    $("#jqTreeFirstTab")
                        .jqxTreeGrid(
                            {
                                width: "100%",
                                height: 850,
                                source: dataAdapterSecondTab,
                                showHeader: false,
                                sortable: true,
                                columns: [
                                    { text: "GraphName", dataField: "GraphName" }
                                ]
                            });
                    document.getElementById("divFirstNew").style.display = "none";
                    document.getElementById("divFirstOld").style.display = "inline";
                }
            },
            error: function () {
                $body.removeClass("loading");
            }
        });
    }
    else {
        callPseudoView();
        $body.removeClass("loading");
    }
    return true;
}


/*
function callTreeView() {
    $body.addClass("loading");
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    if (fileId === 0) return false;
    document.getElementById("divExpand").style.display = "inline";
    var chkTree = document.getElementById("chkTreeView").checked;
    var chkPseudo = true; 
    if (chkTree) {
        document.getElementById("chkTreeView").checked = true;
        var treeFun = document.getElementById("chkTreeView");
        var parentTree = treeFun.parentElement;
        $(parentTree).prop("className", "form-checkbox form-icon form-text active");
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetPseudoCodeCustomTreeView?projectId=" + projectId + "&fileId=" + fileId + "&pseudoCode=" + chkPseudo,
            // url: baseAddress + "TestCobol/GetPseudoCodeCustomTreeView?projectId=" + projectId + "&fileId=" + fileId + "&pseudoCode=" + chkPseudo,
            success: function (data) {
                $body.removeClass("loading");
                if (data !== null && typeof data !== "undefined") {
                    var dataSource = data;

                   
                    // this is for cobol //
                    var sourceSecondTab =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: "GraphId", type: "string" },
                            { name: "ParentId", type: "string" },
                            { name: "GraphName", type: "string" },
                            { name: "ActualStatementId", type: "string" },
                            { name: "GroupId", type: "integer" },
                            { name: "StatementId", type: "integer" },
                            { name: "BaseCommandId", type: "integer" }
                        ],
                        hierarchy:
                        {
                            keyDataField: { name: "GraphId" },
                            parentDataField: { name: "ParentId" }
                        },
                        id: "GraphId",
                        localData: dataSource
                    };
                    var dataAdapterSecondTab = new $.jqx.dataAdapter(sourceSecondTab);
                    $("#jqTreeFirstTab").jqxTreeGrid({
                        width: "100%",
                        height: 850,
                        source: dataAdapterSecondTab,
                        showHeader: false,
                        sortable: true,
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ],
                        virtualModeCreateRecords: function (expandedRecord, done) {
                            var bId = expandedRecord.BaseCommandId;
                            if (bId !== 5) done(expandedRecord.records);
                            var sId = expandedRecord.StatementId;
                            var gId = expandedRecord.GraphId;
                            $.ajax({
                                url: baseAddress + "TestCobol/GetCallInternalBlock?projectId=" + projectId + "&fileId=" + fileId + "&pseudoCode=" + chkPseudo + "&statementId=" + sId + "&graphId=" + gId,
                                success: function (result) {
                                    var source =
                                    {
                                        dataType: "json",
                                        dataFields: [
                                            { name: "GraphId", type: "string" },
                                            { name: "ParentId", type: "string" },
                                            { name: "GraphName", type: "string" },
                                            { name: "GroupId", type: "integer" },
                                            { name: "NodeId", type: "integer" },
                                            { name: "StatementId", type: "integer" },
                                            { name: "BaseCommandId", type: "integer" }
                                        ],
                                        localData: result,

                                        hierarchy:
                                        {
                                            keyDataField: { name: "GraphId" },
                                            parentDataField: { name: "ParentId" }
                                        },
                                        id: "GraphId"
                                    };
                                    var dataAdapter = new $.jqx.dataAdapter(source,
                                        {
                                            loadComplete: function () {
                                                done(dataAdapter.records);
                                            }
                                        });
                                    dataAdapter.dataBind();
                                    var elements = expandedRecord.records.filter(function (ele) {
                                        return ele.GroupId === 90909090; // && ele.ParentId === expandedRecord.GraphId;
                                    });
                                    elements.forEach(function (ele) {
                                        $("#jqTreeFirstTab").jqxTreeGrid("deleteRow", ele.GraphId);
                                    });
                                }
                            });
                        },
                        virtualModeRecordCreating: function (record) {
                            record.BaseCommandId === 5 ? record.leaf = false : record.leaf = true;
                        }
                    });
                   
                    document.getElementById("divFirstNew").style.display = "none";
                    document.getElementById("divFirstOld").style.display = "inline";
                }
            },
            error: function () {
                $body.removeClass("loading");
            }
        });
    }
    else {
        callPseudoView();
        $body.removeClass("loading");
    }
    return true;
}
*/
function expandAllTreeView() {
    var chkTree = document.getElementById("chkTreeView").checked;
    if (chkTree) {
        if (document.getElementById("chkExpandAll").checked === true) {
            var grid = $("#jqTreeFirstTab");
            grid.jqxTreeGrid("expandAll");
        } else {
            $("#jqTreeFirstTab").jqxTreeGrid("collapseAll");
        }
        $body.removeClass("loading");
    }
}

/* Third Tab*/
function changeThirdTab() {
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    var methodStatementId = workFlow.value;
    if (fileId === 0) return false;
    document.getElementById("dvWorkflowList").style.display = "none";
    document.getElementById("dvSearch").style.display = "none";
    var projectId = getParameterByName("prjId");
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = true; // document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    var pid = parseInt(projectId);

    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: pid,
            BriefDescription: "Viewed External and Internal View of the Object(flat view) tab"
        }
    };
    $.fn.auditActionLog(audit).then(function () {
        getPseudoCodeIndentedData(projectId, methodStatementId, chkBusiness, chkpseudo, annotate, fileId);
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });
}

function callchkFunctionSecondTab() {
    var projectId = getParameterByName("prjId");
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = true; //  document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    var methodStatementId = workFlow.value;
    if (fileId === 0) return false;
    getPseudoCodeIndentedData(projectId, methodStatementId, chkBusiness, chkpseudo, annotate, fileId);
    return true;
}

function getPseudoCodeIndentedData(projectId, stmtId, business, pseudo, annotate, fileId) {
    $body.addClass("loading");
    var userId = window.localStorage.getItem("userId");
    window.localStorage.setItem("secondTabDataNodes", "");
    $("#jqxFormattedSource").jqxGrid("refresh");
    // $("#jqxFormattedSource").jqxGrid({ source: [], width: "100%" });
    $.ajax({
        type: "get",
        url: baseAddress + "CustomView/GetPseudoCodePreIndentedData?projectId=" + projectId + "&stmtId=" + stmtId + "&business=" + business +
            "&pseudo=" + pseudo + "&annotate=" + annotate + "&userId=" + userId +
            "&programId=" + fileId,
        success: function (tData) {
            if (typeof tData !== "undefined" && tData !== null && tData.length > 0) {
                var sourceSecondTab =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" },
                        { name: "ActualStatementId", type: "string" },
                        { name: "NodeId", type: "integer" },
                        { name: "StatementId", type: "StatementId" },
                        { name: "BaseCommandId", type: "interger" },
                        { name: "GlobalParentId", type: "string" },
                        { name: "ActionWorkflowId", type: "integer" },
                        { name: "WorkflowStartStatementId", type: "integer" }
                    ],
                    id: "GraphId",
                    localData: tData
                };
                var dataAdapter = new $.jqx.dataAdapter(sourceSecondTab);
                $("#jqxFormattedSource").jqxGrid(
                    {
                        width: "100%",
                        height: 850,
                        showheader: false,
                        source: dataAdapter,
                        scrollmode: "logical",
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ]
                    });

                $body.removeClass("loading");
            }
            /*
            $("#jqxFormattedSource").on("rowdoubleclick",
                function (event) {
                    var args = event.args.row;
                    var statementId = args.bounddata.StatementId;
                    var actualStatementId = args.bounddata.ActualStatementId;
                    var graphId = args.bounddata.GraphId;
                    var graphName = args.bounddata.GraphName;
                    var gPName = $(graphName).text();
                    annotateStatement123(statementId, gPName, actualStatementId, graphId);
                });
            */
            $("#jqxFormattedSource").on("rowclick", function (event) {
                var args = event.args;
                var target = event.currentTarget.id;
                $(target).each(function (index, element) {
                    $(element).css("backgroundColor", "yellow");
                });
                event.preventDefault();
                var rowIndex = args.rowindex;
                var data = $("#jqxFormattedSource").jqxGrid("getrowdata", rowIndex);
                var graphId = data.GraphId;
                var rows = $("#jqxFormattedSource").jqxGrid("getrows");
                var groupRows = [];
                for (var i = 0; i < rows.length; i++) {
                    var currentRow = rows[i];
                    if (currentRow.ParentId === graphId)
                        groupRows.push(currentRow);
                }
                for (var j = 0; j < groupRows.length; j++) {
                    var c = groupRows[j];
                    $(c).attr("background-color", "red");
                }
            });
        },
        error: function () {
            $body.removeClass("loading");
        }
    });

    $("#jqxFormattedSource").on("rowclick", function (event) {
        event.preventDefault();
        var args = event.args.row.bounddata;
        var globalParentId = args.GlobalParentId;
        var divId = "div_" + args.GraphId;
        var gotDiv = false;
        $("#jqxFormattedSource").find("div").each(function (i, item) {
            if (item.id === divId && !gotDiv) {
                gotDiv = true;
                $(item).css("background-color", "#e0e5ec");
            } else {
                $(item).css("background-color", "");
            }
            if (gotDiv && item.lang === divId) {
                if (item.title === globalParentId)
                    $(item).css("background-color", "#e0e5ec");
                else
                    $(item).css("background-color", "");
            }
        });
        gotDiv = false;
    });
}

function annotateStatement123(statementId, graphName, actualStatmentId, graphId) {
    document.getElementById("dvError1").innerHTML = "";
    $.ajaxSetup({ async: false });
    $("#txtAnnotateStatement").val();
    $.ajaxSetup({
        async: false
    });
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetOrignalStatement?statementId=" + statementId + "&graphId=" + graphId + "&actualStatementId=" + actualStatmentId,
        success: function (result) {
            var tData = result;
            var gName = graphName.trim();
            var currentStatement = tData[0].GraphName.trim();
            $("#txtCurrentStatement").text(currentStatement);
            $("#txtAnnotateStatement").val(gName);
            document.getElementById("hdnAnnotateStatement").value = statementId;
            document.getElementById("hdnAnnotateActualStmtId").value = actualStatmentId;
            document.getElementById("hdnAnnotateGraphId").value = graphId;
        }
    });
    $("#dvAnnotate").modal("show");
}

$("#btnAddAnootateStatement").click(function () {
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var startMethodId = workFlow.value;
    var statementId = document.getElementById("hdnAnnotateStatement").value;
    var actualStmtId = document.getElementById("hdnAnnotateActualStmtId").value;
    var graphId = document.getElementById("hdnAnnotateGraphId").value;
    if ($("#txtAnnotateStatement").val() === "") {
        document.getElementById("dvError1").innerHTML = "Please enter Annotate statement.";
        $("#txtAnnotateStatement").focus();
        $("#txtAnnotateStatement").css("border-color", "red");
        $("#txtAnnotateStatement").on("keypress", function () {
            $(this).css("border-color", "");
            document.getElementById("dvError1").innerHTML = "";
        });
        return false;
    }
    var annotateStatement = $("#txtAnnotateStatement").val();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "StatementRule/UpdateAnnotateStatement?statementId=" + statementId + "&annotateStatement=" + annotateStatement + "" +
            "&actualStatmentId=" + actualStmtId + "&graphId=" + graphId + "&startMethodId=" + startMethodId + "&projectId=" + projectId,
        success: function (cData) {
            if (cData !== null) {
                document.getElementById("dvError1").innerHTML = "Record saved successfully";
                document.getElementById("dvError1").style.color = "green";
                $("#txtAnnotateStatement").val("");
                // callAfterApplyAnnotateOrDeActivate();
                callchkFunctionSecondTab();
                $("#dvAnnotate").modal("hide");
            }
        }
    });
    return true;
});

/*DeActive Statement */

function deActivateStatement() {
    var projectId = getParameterByName("prjId");
    $("#txtStatementStartWith").val("");
    document.getElementById("dvError").innerHTML = "";
    getAllDeactivateStatement(projectId);
}

$("#btnAddDeactivateStatement").click(function () {
    var rowindex = $("#jqxFormattedSource").jqxGrid("getselectedrowindex");
    var selectedRow = $("#jqxFormattedSource").jqxGrid("getrowdata", rowindex);
    var actionWorkFlowId = selectedRow.ActionWorkflowId;
    var methodStartStatementId = selectedRow.WorkflowStartStatementId;
    var statementId = selectedRow.StatementId;
    if ($("#txtStatementStartWith").val() === "") {
        document.getElementById("dvError").innerHTML = "Please enter Statement start";
        $("#txtStatementStartWith").focus();
        $("#txtStatementStartWith").css("border-color", "red");
        $("#txtStatementStartWith").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    var deactivateStatement = [];
    deactivateStatement.push({
        "ProjectId": projectId,
        "StartStatementId": methodStartStatementId,
        "SolutionId": 0,
        "ActualStatement": $("#txtStatementStartWith").val(),
        "ActionWorkflowId": actionWorkFlowId,
        "IsDeleted": 0,
        "StatementId": statementId
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "DeactivateStatement/POST?startMethodId=" + methodStartStatementId + "&projectId=" + projectId,
        data: deactivateStatement[0],
        success: function (result) {
            if (result !== null) {
                $("#txtStatementStartWith").val("");
                document.getElementById("dvError").style.color = "green";
                document.getElementById("dvError").innerHTML = "Record saved successfully";
                callchkFunctionSecondTab();
                $("#dvDeactivate").modal("hide");
            }
        },
        statusCode: {
            200: function () {
            },
            201: function () {

            },
            400: function (response) {
                error.innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                error.innerHTML = response.statusText;
            },
            500: function (response) {
                error.innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("dvError").innerHTML = "Error while connecting to API";
        }
    });
});

$("#dvDeactivate").on("hidden.bs.modal", function () {
    var projectId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    var chkBusiness = document.getElementById("chkBusinessFunction").checked;
    var chkpseudo = true; // document.getElementById("chkPseudoCodeFunction").checked;
    var annotate = document.getElementById("chkAnnotateView").checked;
    getPseudoCodeIndentedData(projectId, stmtId, chkBusiness, chkpseudo, annotate);
    return true;
});

function getAllDeactivateStatement(projectId) {
    var oType = $("#ddlObjectTypes").find("input").attr("value");
    var fileName = $("#ddlSelectFiles").find("input").attr("value");
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: parseInt(projectId),
            //BriefDescription: "Viewed Decision Chart  tab for: <b>" + workflowValue + "</b>"
        }
    };
    document.getElementById("dvError").innerHTML = "";
    var rowindex = $("#jqxFormattedSource").jqxGrid("getselectedrowindex");
    if (rowindex === -1) {
        displayMessage("Please select a statement to begin deactivation", "medium");
        return false;
    }
    var selectedRow = $("#jqxFormattedSource").jqxGrid("getrowdata", rowindex);
    var text = $(selectedRow.GraphName).text().trim();
    $("#txtStatementStartWith").val(text);
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    if (fileId === 0) return false;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "DeactivateStatement/GetAllDeactivateStatementWithProgramId?projectId=" + projectId +
            "&programId=" + fileId,
        success: function (result) {
            if (result != null) {
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: "DeactivateStatementId", type: "int" },
                        { name: "ActualStatement", type: "string" },
                        { name: "Activate", type: "string" }
                    ],
                    id: "DeactivateStatementId",
                    localdata: result
                };
               // ReSharper disable once InconsistentNaming
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#jqxDeactivate").jqxGrid(
                    {
                        width: "95%",
                        height: 200,
                        source: dataAdapter,
                        showheader: false,
                        sortable: true,
                        columns: [
                            { text: "Deactivate Statement", dataField: "ActualStatement", width: 400 },
                            { text: "Activate", dataField: "Activate", cellsalign: "center", width: 100 }
                        ]
                    });
            }
            $("#dvDeactivate").modal("show");
        }
    });
    audit.postData.BriefDescription = "Deactivate Statement: <b>" + text + "</b> with Object Type: <b>" + oType + "</b> and Keyword: <b>" + $("#txtSearchObject").val() + "</b> for Object: <b>" + fileName + "</ b>";
    $.fn.auditActionLog(audit).then(function () {
        return false;
    }).catch(function (e) {
        console.log(e);
        return false;
    });
}

function revertDeactivateStatement(deactivateStatementId) {
    document.getElementById("dvError").innerHTML = "";
    var prjId = getParameterByName("prjId");
    var stmtId = getParameterByName("stId");
    var actionId = getParameterByName("aId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "DeactivateStatement/UpdateObjectDeactivateStatement?deactivateId=" + deactivateStatementId + "&projectId=" + prjId,
        success: function (result) {
            if (result === "Done") {
                document.getElementById("dvError").innerHTML = " Record Activated successfully";
                document.getElementById("dvError").style.color = "green";
                getAllDeactivateStatement(prjId, stmtId, actionId);
            } else {
                document.getElementById("dvError").innerHTML = "Error occured, please try again";
            }
        }
    });
}

/* Forth Tab */
function fillActionWorkflowDropdown(fileId) {

    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomView/GetAllStatementWorkflows?fileId=" + fileId + "&projectId=" + projectId,
        success: function (data) {
            if (data !== null && typeof data !== "undefined") {
                if (data.length === 0) {
                    $("#ddlFileWorkflows").jqxComboBox({ disabled: true });
                    return;
                }
                $("#ddlFileWorkflows").jqxComboBox({ disabled: false });
                var html = [];
                for (var i = 0; i < data.length; i++) {
                    html.push({
                        label: "<div tabIndex=0 style='padding: 1px;'><div>" + data[i].OriginalStatement + "</div></div>",
                        value: data[i].StatementId
                    });
                }
                $("#ddlFileWorkflows").jqxComboBox({ source: html, width: "350", height: "25px" });
                $("#ddlFileWorkflows").on("select", function (event) {
                });
            }
        }
    });
}

function downloadDecisionChart() {
    var chkInternal = document.querySelector(".js-switch");
    var internal = chkInternal.checked ? "internalCall" : "option";
    var chkDecision = document.getElementById("chkDecisionMatrix").checked;
    var pseudoCode = chkDecision === true ? "Yes" : "No";
    var callInclude = chkInternal.checked ? "Include Call Internal" : "Exclude Call Internal";
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var workflowText = workFlow.originalItem.label;
    var workflowValue = $(workflowText).text();
    if (item) {
        var fileId = item.value;
        var methodStatementId = workFlow.value;
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetDecisionChartForWorkflowUpdated?projectId=" + projectId + "&fileId=" + fileId + "&statementId=" + methodStatementId + "&pseudoCode=" + chkDecision + "&opt=download&internalOption=" + internal,
            success: function (result) {
                if (result !== null) {
                    var htmlResult = result;
                    downloadFile(htmlResult);
                }
                return true;
            }
        });
    }
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: parseInt(projectId),
            BriefDescription: "Exported Decision Chart for: <b>" + workflowValue + "</b> with options: Pseudo Code?:" + pseudoCode + " and" + callInclude
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function changeDecisionTab() {
    var chkInternal = document.querySelector(".js-switch");
    var internal = chkInternal.checked ? "internalCall" : "option";
    var chkDecision = document.getElementById("chkDecisionMatrix").checked;
    var pseudoCode = chkDecision === true ? "Yes" : "No";
    var callInclude = chkInternal.checked ? "Include Call Internal" : "Exclude Call Internal";
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var workflowText = workFlow.originalItem.label;
    var workflowValue = $(workflowText).text();
    if (item) {
        if (workFlow) {
            var fileId = item.value;
            var methodStatementId = workFlow.value;
            jQuery.ajax({
                type: "GET",
                url: baseAddress +
                    "CustomView/GetDecisionChartForWorkflowUpdated?projectId=" + projectId + "&fileId=" + fileId + "&statementId=" + methodStatementId + "&pseudoCode=" + chkDecision + "&opt=show&internalOption=" + internal,
                success: function (result) {
                    if (result != null) {
                        var htmlResult = result;
                        if (htmlResult.startsWith("<table")) {
                            $("#divDecisionChartHtmlTable").html("");
                            $("#divDecisionChartHtmlTable").append(htmlResult);
                            $("#DvDecisionShow").modal("show");
                            $("#divDecisionChartHtmlTable").tooltip();
                            // $("#divDecisionChartHtmlTable").append(htmlResult);
                            // document.getElementById("divDecisionDownload").style.display = "inline";
                        } else {
                            downloadFile(htmlResult);
                            displayMessage("Please check the decision chart that has been downloaded.", "medium");
                            return false;
                        }
                    }
                    return true;
                }
            });
        }
    }
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: parseInt(projectId),
            BriefDescription: "Showed Decision Chart for: <b>" + workflowValue + "</b> with options: Pseudo Code?:" + pseudoCode + " and " + callInclude
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function chkDecisionMatrix() {
    var projectId = getParameterByName("prjId");
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem"); // getParameterByName('prgmId');
    var fileId = item.value;
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var workflowText = workFlow.originalItem.label;
    var workflowValue = $(workflowText).text();
    var methodStatementId = workFlow.value;
    var actionId = 0; // getParameterByName('aId');
    var chkDecision = document.getElementById("chkDecisionMatrix").checked;
    var chkInternal = document.querySelector(".js-switch");
    var pseudoCode = chkDecision === true ? "Yes" : "No";
    var internal = chkInternal.checked ? "internalCall" : "option";
    var callInclude = chkInternal.checked ? "Include Call Internal" : "Exclude Call Internal";
    var ruleDataAndSummary = [];
    $.ajaxSetup({ async: false });
    $.get(baseAddress + "WorkspaceWorkflow/GetBusinessFunction?projectId=" + projectId + "&actionId=" + actionId,
        function (data) {
            if (data !== null) {
                ruleDataAndSummary = data;
            }
        });
    $.get(baseAddress + "CustomView/GetDecisionChartView?projectId=" + projectId + "" +
        "&fileId=" + fileId + "&statementId=" + methodStatementId + "&pseudoCode=" + chkDecision + "&opt=" + internal, function (tData) {
            if (tData !== null) {
                var loopCounter = 0;
                var cnt = 0;
                var bgColor = "";
                var disp = "inline";
                var allRules =
                    "<table style='width: 100%; border-collapse: separate; border-spacing: 0.1em;'>";
                var allActions =
                    "<table id='tblAllAction'>";
                var allActionsElse =
                    "<table id='tblAllAction'>";
                var allStatements =
                    "<table id='tblAllStatements'>";
                $.each(tData, function (key, value) {
                    disp = loopCounter === 0 ? "inline" : "none";
                    bgColor = loopCounter === 0 ? "#f4b084" : "#ffffff";
                    var index = key.indexOf("#");
                    var statement = key.substring(index + 1); // .split("#")[1];
                    var statement1 = key.split("#")[0];
                    var statementId = statement1.split("StmtId_")[1].split(" ")[0];
                    var parentId = statement1.split("ParentId_")[1].split(" ")[0];
                    var callFunction = "<i class='fa fa-pencil-square-o fa-2x' " +
                        "onclick=funDefineBusinessRule('" + parentId + "'," + statementId + ");></i>";
                    var title = "Create business functions";
                    var nested = statement.indexOf("~") > -1 ? true : false;
                    if (nested) {
                        statement = statement.split("~")[0];
                    }
                    var n = nested === true ? "D" : "";
                    var boolean = false;
                    var loopEnd = false;
                    var cellBgColor = "";
                    for (var i = 0; i < ruleDataAndSummary.length; i++) {
                        var statementRule = ruleDataAndSummary[i].StatementRuleReference;
                        if (loopEnd) break;
                        for (var j = 0; j < statementRule.length; j++) {
                            if (statementRule[j].StatementIdFrom === parseInt(statementId)) {
                                title = "Business Name: " + ruleDataAndSummary[i].RuleName;
                                cellBgColor = "#3acaa1";
                                loopEnd = true;
                                break;
                            }
                        }
                    }

                    allRules += "<tr onclick='showHideOther(" + loopCounter + "," + statementId + ");' id='tr_" +
                        loopCounter + "' style='background-color: " + bgColor + "'><td class='cellInner'>" +
                        statement.replace(" ( ", "(").replace(" ) ", ")") + "</td><td class='cellDependant'>" + n + "</td>" +
                        /*
                        "<td class='cellBusiness' style='background-color: " + cellBgColor + "'><span><a href='#'" +
                        " title='" + title + "'>" + callFunction + "</a></span></td>"
                        */
                        "</tr>";
                    allStatements += "<tr id='allStmtsTr_" + cnt + "' ><td id='allStmts_" + loopCounter + "' style='display:" +
                        disp + ";' class='cellInnerStat'><table>";
                    allActions += "<tr id='allActionsTr_" + cnt + "'><td id='allActions_" + loopCounter + "' style='display:" +
                        disp + ";' class='cellInnerStat'><table>";
                    allActionsElse += "<tr id='allActionsElseTr_" + cnt + "'><td id='allActionsElse_" + loopCounter +
                        "' style='display:" + disp + ";' class='cellInnerStat'><table>";
                    $.each(value, function (k, v) {
                        cnt++;
                        var stmt = v.replace(" ( ", "(").replace(" ) ", ")");
                        if (stmt.indexOf("Else pId_") >= 0 || stmt.indexOf("ELSE pId_") >= 0) {
                            boolean = true;
                            stmt = stmt.split("pId_")[0];
                        }
                        allStatements += "<tr id='allStmtsTr_" + cnt +
                            "' onclick='changeBg(this);'><td>" + stmt + "</td></tr>";
                        if (boolean === false) {
                            allActions += "<tr id='allActionsTr_" + cnt + "' onclick='changeBg(this);'><td>"
                                + stmt + "</td></tr>";
                        }
                        if (boolean === true) {
                            allActionsElse += "<tr id='allActionsElseTr_" + cnt +
                                "' onclick='changeBg(this);'><td>" + stmt + "</td></tr>";
                        }
                    });
                    allStatements += "</td></tr></table>";
                    allActions += "</td></tr></table>";
                    allActionsElse += "</td></tr></table>";
                    loopCounter++;
                });
                allRules += "</table>";
                allStatements += "</table>";
                allActions += "</table>";
                allActionsElse += "</table>";
                $("#tdAllConditionRules")[0].innerHTML = allRules;
                $("#tdAllActions")[0].innerHTML = allActions;
                $("#tdAllActionsElse")[0].innerHTML = allActionsElse;
                $("#tdAllStatements")[0].innerHTML = allStatements;
            }
        });
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: parseInt(projectId),
            BriefDescription: "Viewed Decision Chart  tab for: <b>" + workflowValue + "</b>  with options: Pseudo Code?:" + pseudoCode + " and " + callInclude
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function showHideOther(rowId, statementId) {
    document.getElementById("hdnStatementIdDicision").value = statementId;
    for (var i = 0; i < 5000; i++) {
        var tr = document.getElementById("allStmts_" + i);
        var row = document.getElementById("tr_" + i);
        var action = document.getElementById("allActions_" + i);
        var actionElse = document.getElementById("allActionsElse_" + i);
        if (tr !== null && typeof tr !== "undefined") {
            if (i === rowId) {
                tr.style.display = "inline";
                row.style.backgroundColor = "#f4b084";
                action.style.display = "inline";
                actionElse.style.display = "inline";
            } else {
                tr.style.display = "none";
                action.style.display = "none";
                actionElse.style.display = "none";
                row.style.backgroundColor = "#ffffff";
            }
        }
    }
}

function changeBg(parameters) {
    var currentRowId = $(parameters)[0].id;
    var tbl = $(parameters).closest("table");
    tbl.find("tr").each(function () {
        var rowId = $(this)[0].id;
        if (currentRowId === rowId) {
            $(this).css("background-color", "#f4b084");
        } else {
            $(this).css("background-color", "");
        }
    });
}

function funDefineBusinessRule(parentId, statementId) {
    var projectId = getParameterByName("prjId");
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var stmtId = workFlow.value;
    var actionId = 0;
    var pseudoCode = document.getElementById("chkDecisionMatrix").checked;
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var fileId = item.value;
    var chkInternal = document.querySelector(".js-switch");
    var internal = chkInternal.checked ? "internalCall" : "option";
    $("#btnSubmitRule").removeAttr("disabled", "");
    $("#txtRuleDescription").val("");
    $("#txtRuleName").val("");
    $("#dvRuleDetails")[0].innerHTML = "";
    document.getElementById("tdError12").innerHTML = "";
    var rows = [];
    $.get(baseAddress +
        "CustomView/GetDecisionChartViewBusinessFunction?projectId=" +
        projectId + "&fileId=" + fileId + "&statementId=" + stmtId + "&pseudoCode=" + pseudoCode + "&graphId=" +
        parentId + "&opt=" + internal + "&cStmtId=" + statementId,  //  + "&cStmtId=" + statementId,
        //$.get(baseAddress +
        //    "CustomView/GetDecisionChartViewBusinessFunction" +
        //    "?graphId=" + parentId + "&iStatementId=" + stmtId + "&iProjectId=" + projectId + "&actionId=" + actionId + "&pseudoCode=" + pseudoCode + "&statementId=" + statementId,
        function (data) {
            if (data !== null) {
                for (var i = 0; i < data.length; i++) {
                    rows.push({
                        "StatementId": 0,
                        "GraphName": data[i]
                    });
                }
                var rowData = JSON.stringify(rows);
                window.localStorage.setItem("selectedRows", rowData);
                var table = $("#tblSelectedRows");
                table.html("");
                $.each(rows, function (i, r) {
                    drawRowStmt((i + 1), table, r);
                });
                document.getElementById("hdnstatementId").value = statementId;
                $("#dvCreateBusinessFunc").modal("show");
            }
        });

    $.get(baseAddress + "CustomView/GetBusinessFunction?projectId=" + projectId + "&actionId=" + actionId + "&statementId=" + statementId,
        function (data) {
            if (data !== null) {
                var ruleData = data[0];
                if (typeof ruleData !== "undefined" && ruleData !== null) {
                    // ReSharper disable once QualifiedExpressionMaybeNull
                    $("#txtRuleName").val(ruleData.RuleName);
                    $("#txtRuleDescription").val(ruleData.RuleSummary);
                    $("#dvRuleDetails")[0].innerHTML = "Business function name: " + ruleData.RuleName;
                    $("#dvRuleDetails")[0].style.color = "green";
                    $("#ddlCatalogs").val(ruleData.CatalogMaster.CatalogId);
                }
            }
        });
}

function drawRowStmt(id, table, row) {
    var trRow =
        $("<tr id='tr_" + row.StatementId + "'><td style='background-color: #0000FF; width: 5px;'></td><td style='width: 12px; background-color: #f0f0f0;'></td>" +
            "<td bgcolor='#f0f0f0'><font color='blue'>" + id + "</font></td> <td width='8'></td>" +
            "<td>" + row.GraphName + "</td></tr>");
    table.append(trRow);
}

$("#btnSubmitRule").click(function () {
    if ($("#ddlCatalogs").val() === "0") {
        $("#tdError12")[0].innerHTML = "Please select catalog";
        $("#ddlCatalogs").focus();
        return false;
    }
    if ($("#txtRuleName").val() === "") {
        $("#tdError12")[0].innerHTML = "Please enter Business name";
        $("#txtRuleName").focus();
        return false;
    }
    createRuleForSelectedStatements();
    return false;
});

$("#dvCreateBusinessFunc").on("hidden.bs.modal", function () {
    chkDecisionMatrix();
});

function getTodaysDate() {
    var fullDate = new Date();
    var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : "0" + (fullDate.getMonth() + 1);
    var twoDigitDate = fullDate.getDate() + "";
    if (twoDigitDate.length === 1)
        twoDigitDate = "0" + twoDigitDate;

    return twoDigitMonth + "/" + twoDigitDate + "/" + fullDate.getFullYear();
}

function createRuleForSelectedStatements() {
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var programId = item.value;
    var ruleSummaryAndAssociations = [];
    var statementRuleReference = [];
    // var rteHtml = "";
    var rteHtml = "";  // $("#rteStatementsNote").ejRTE("getHtml");
    // var actionWorkflowId = getParameterByName("aId");
    var statementId = document.getElementById("hdnstatementId").value;
    statementRuleReference.push({
        StatementIdFrom: statementId,
        StatementIdTo: statementId,
        StatementNotes: rteHtml,
        CreatedOn: getTodaysDate(),
        CreatedBy: userId,
        ProjectId: projectId,
        ProgramId: programId,
        //  IsDeleted :0,
        ActionWorkflowId: 0
    });
    ruleSummaryAndAssociations.push({
        RuleCatalogId: $("#ddlCatalogs").val(),
        RuleName: $("#txtRuleName").val(),
        RuleSummary: $("#txtRuleDescription").val(),
        CreatedOn: getTodaysDate(),
        CreatedBy: userId,
        ProjectId: projectId,
        IsDeleted: 0,
        ProgramId: programId,
        StatementRuleReference: statementRuleReference,
        ActionWorkflowId: 0
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "CustomView/AddStatementRules?programId=" + programId + "&projectId=" + projectId,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(ruleSummaryAndAssociations[0]),
        success: function (result) {
            if (result !== null) {
                document.getElementById("tdError12").innerHTML = "Business Function created for selected statements";
                document.getElementById("tdError12").style.color = "green";
                $("#txtRuleName")[0].value = "";
                $("#txtRuleDescription")[0].value = "";
                $("#ddlCatalogs").val("0");
                $("#btnSubmitRule").attr("disabled", "disabled");
                $("#" + clickedDefineFunction).html("");
                $("#" + clickedDefineFunction).css("background-color", "#800000");
                return false;
            }
            return false;
        },
        statusCode: {
            400: function (response) {
                document.getElementById("tdError12").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError12").innerHTML = "User " + response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError12").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError12").innerHTML = "Error while connecting to API";
            return false;
        }
    });
}

$("#btnRemoveBusinessFun").click(function () {
    if ($("#txtRuleName").val() === "") {
        $("#tdError12")[0].innerHTML = "Enter Business function.";
        $("#txtRuleName").focus();
        return false;
    }
    RemoveBusinessFunction();
    return false;
});

function RemoveBusinessFunction() {
    var ruleSummaryAndAssociations = [];
    var statementRuleReference = [];
    var rteHtml = ""; // $("#rteStatementsNote").ejRTE("getHtml");
    var actionWorkflowId = 0;
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var programId = item.value;
    statementRuleReference.push({
        StatementIdFrom: document.getElementById("hdnstatementId").value,
        StatementIdTo: document.getElementById("hdnstatementId").value,
        StatementNotes: rteHtml,
        CreatedOn: getTodaysDate(),
        CreatedBy: userId,
        ProjectId: projectId,
        ProgramId: programId,
        //  IsDeleted :0,
        ActionWorkflowId: actionWorkflowId
    });
    ruleSummaryAndAssociations.push({
        RuleCatalogId: $("#ddlCatalogs").val(),
        RuleName: $("#txtRuleName").val(),
        RuleSummary: $("#txtRuleDescription").val(),
        CreatedOn: getTodaysDate(),
        CreatedBy: userId,
        ProjectId: projectId,
        IsDeleted: 1,
        ProgramId: programId,
        StatementRuleReference: statementRuleReference,
        ActionWorkflowId: actionWorkflowId
    });
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "CustomView/RemoveBusinessFunction?programId=" + programId + "&projectId=" + projectId,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(ruleSummaryAndAssociations[0]),
        success: function (result) {
            if (result !== null) {
                document.getElementById("tdError12").innerHTML = "Business Function removed for selected statements";
                document.getElementById("tdError12").style.color = "green";
                $("#txtRuleName")[0].value = "";
                $("#txtRuleDescription")[0].value = "";
                $("#ddlCatalogs").val("0");
                $("#btnSubmitRule").attr("disabled", "disabled");
                $("#" + clickedDefineFunction).html("");
                $("#" + clickedDefineFunction).css("background-color", "#800000");
                return false;
            }
            return false;
        },
        statusCode: {
            400: function (response) {
                document.getElementById("tdError12").innerHTML = response.responseJSON.Message;
            },
            404: function (response) {
                document.getElementById("tdError12").innerHTML = "User " + response.statusText;
            },
            500: function (response) {
                document.getElementById("tdError12").innerHTML = response.statusText;
            }
        },
        error: function () {
            document.getElementById("tdError12").innerHTML = "Error while connecting to API";
            return false;
        }
    });
}

$("#btnDecisionExportHtml").click(function () {
    changeDecisionTab();
});

function showCatalogDialog() {
    document.getElementById("tdError").innerHTML = "";
    document.getElementById("txtCatalogName").value = "";
    $("#txtCatalogName").focus();
    $("#dvCatalog").modal("show");
}

function bindCatalogs() {
    $("#ddlCatalogs").val("");
    $("#ddlCatalogs").html("");
    $("#ddlCatalogs").append($("<option></option>").val("").html(""));
    $("#ddlCatalogs").empty().append('<option selected="selected" value="0">Select</option>');
    $.get(baseAddress + "CatalogMaster/GetAllCatalogs", function (cData) {
        if (cData != null) {
            $.each(cData, function (i, item) {
                $("#ddlCatalogs").append($("<option>", {
                    value: item.CatalogId,
                    text: item.CatalogName
                }));
            });
        }
    });
}

/* Fifh Tab */
function changBgCss() {
    $("#diagram").empty();
    var butterflyFun = document.getElementById("chkButterflyView");
    var parentButterFly = butterflyFun.parentElement;
    $(parentButterFly).prop("className", "form-checkbox form-icon form-text");

    var flowchartFun = document.getElementById("chkFlowchartView");
    var parentFlowchart = flowchartFun.parentElement;
    $(parentFlowchart).prop("className", "form-checkbox form-icon form-text active");

    var sequentailFun = document.getElementById("chkSequentialView");
    var parentSequentail = sequentailFun.parentElement;
    $(parentSequentail).prop("className", "form-checkbox form-icon form-text");
    document.getElementById("chkSequentialView").checked = false;
    document.getElementById("chkButterflyView").checked = false;

    document.getElementById("dvWorkflowList").style.display = "inline";
    document.getElementById("dvSearch").style.display = "none";
    var projectId = getParameterByName("prjId");
    var item = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    if (item) {
        window.localStorage.setItem("forthTabDataNodes", "");
        window.localStorage.setItem("forthTabDataLinks", "");
        var originalItem = item.originalItem;
        var stmtId = originalItem.value;
        forthTabClickEvent(projectId, stmtId);
    }
}

function forthTabClickEvent(projectId, stmtId) {
    getFileTypeExtension();

    document.getElementById("chkSequentialView").checked = false;
    document.getElementById("chkButterflyView").checked = false;
    document.getElementById("chkFlowchartView").checked = true;
    document.getElementById("dvBusinessFun").style.visibility = "visible";
    document.getElementById("dvBusinessFun").style.display = "inline";
    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
    document.getElementById("dvWorkFlowDiagram").style.display = "inline";
    var tDataNewNodes = window.localStorage.getItem("forthTabDataNodes");
    var tDataNewLinks = window.localStorage.getItem("forthTabDataLinks");
    if ((tDataNewNodes === "null" || tDataNewNodes === "")
        && (tDataNewLinks === "null" || tDataNewLinks === "")) {
        callforthtab(projectId, stmtId, false, false, true);
    } else {
        var nodes = JSON.parse(tDataNewNodes);
        var links = JSON.parse(tDataNewLinks);
        if (nodes.length > nodesCount) {
            $("#dvWorkflowDownloadPopUp").modal("show");
        } else {
            buildDiagram(nodes, links);
        }
    }
}

function getFileTypeExtension() {
    var projectId = getParameterByName("prjId");
    $("#tblLegend").html("");
    jQuery.ajax({
        url: baseAddress + "General/GetFileTypeExtension?projectId=" + projectId,
        type: "GET",
        success: function (tData) {
            $("#tblLegend").html("");
            if (tData !== null) {
                var row = $("<tr />");
                $("#tblLegend").append(row);
                row.append("<td><div class='divStartingClass' style='padding-right: 4px;'><span>Starting Point</span></div></td>" +
                    " <td><div class='divClass' style='padding-right: 4px;'><span>All Statements</span></div></td>" +
                    "<td> <div class='divMissingClass' style='padding-right: 4px;'><span>Missing Object</span></div></td>" +
                    "<td> <div class='divCondition' style='padding-right: 4px;'><span>Decision</span></div></td>" +
                    "<td> <div class='divStatementOrLoop' style='padding-right: 4px;'><span>Statement Or Loop</span></div></td>" +
                    "<td> <div class='divMethod' style='padding-right: 4px;'><span>Workflow (Method)</span></div></td>" +
                    "<td> <div class='divDeactivate' style='padding-right: 4px;'><span>Deactivate</span></div></td>" +
                    "<td> <div class='divCallInternal' style='padding-right: 4px;'><span>Call Internal</span></div></td>");

                for (var i = 0; i < tData.length; i++) {
                    var color = tData[i].Color;
                    var fileTypeName = tData[i].FileTypeName;
                    row.append("<td><div class='divDynamic' style='padding-right: 4px;'><span style=background-color:" + color + "; >" + fileTypeName + "</span></div></td>");
                }
            }
        }
    });
}

function callforthtab(projectId, stmtId, squentail, butterfly, flowchart) {
    var tDataNew;
    var item = $("#ddlSelectFiles").jqxComboBox("getSelectedItem");
    var workFlow = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var workflowText = workFlow.originalItem.label;
    var workflowValue = $(workflowText).text();
    var chkInternal = document.querySelector(".js-switch");
    var internal = chkInternal.checked ? "internalCall" : "option";
    var formatView;
    // $("#divWorkflowDiagram").html('');
    var fileId = item.value;
    if (fileId === 0) return false;
    if (squentail) {
        formatView = "Sequential View";
        $.get(baseAddress + "CustomView/GetStatementSequentialView?projectId=" + projectId + "&fileId=" + fileId +
            "&statementId=" + stmtId + "&workflowViewType=false&option=" + internal,
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $("#dvWorkflowDownloadPopUp").modal("show");
                }
                else if (nodes.length > nodesCount) {
                    $("#dvWorkflowDownloadPopUp").modal("show");
                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                } else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }
            });
    }
    else if (butterfly) {
        formatView = "Butterfly View";
        $.get(baseAddress + "CustomView/GetStatementsButterflyView?projectId=" + projectId + "&fileId=" + fileId
            + "&statementId=" + stmtId + "&workflowViewType=true&option=" + internal,
            function (tData) {
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                if (nodes == null) {
                    $("#dvWorkflowDownloadPopUp").modal("show");
                }
                else if (nodes.length > nodesCount) {
                    buildAndDownloadDiagram(nodes, links);
                    //$('#dvWorkflowDownloadPopUp').modal('show');
                    //window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    //window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                }
                else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                    // buildAndDownloadDiagram(nodes, links);
                }
            });
    }
    else if (flowchart) {
        formatView = "FlowChart View";
        $.get(baseAddress + "CustomFileView/GetFileFlowChartView?projectId=" + projectId + "&fileId=" + fileId
            + "&statementId=" + stmtId + "&workflowViewType=true&option=" + internal,
            function (tData) {
                /*
                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                buildAndDownloadDiagram(nodes, links);
                */

                tDataNew = tData;
                var nodes = tData.Nodes;
                var links = tData.Links;
                // buildDiagram(nodes, links);
                // buildAndDownloadDiagram(nodes, links);                
                if (nodes === null) {
                    $("#dvWorkflowDownloadPopUp").modal("show");
                }
                else if (nodes.length > nodesCount) {
                    buildAndDownloadDiagram(nodes, links);
                }
                else {
                    document.getElementById("dvBusinessFun").style.visibility = "visible";
                    document.getElementById("dvBusinessFun").style.display = "inline";

                    document.getElementById("dvWorkFlowDiagram").style.visibility = "visible";
                    document.getElementById("dvWorkFlowDiagram").style.display = "inline";

                    window.localStorage.setItem("forthTabDataNodes", JSON.stringify(nodes));
                    window.localStorage.setItem("forthTabDataLinks", JSON.stringify(links));
                    buildDiagram(nodes, links);
                }

            });
    }
    // Log this action...
    var audit = {
        postData: {
            OptionUsed: "Object Search",
            PrimaryScreen: "Object Search",
            UserId: userId,
            ProjectId: parseInt(projectId),
            BriefDescription: "Viewed Workflow Diagram tab for: <b>" + workflowValue + "</b> with option: " + formatView
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function chkCallDiagramView(option) {
    var projectId = getParameterByName("prjId");
    var item = $("#ddlFileWorkflows").jqxComboBox("getSelectedItem");
    var originalItem = item.originalItem;
    var stmtId = originalItem.value;
    var butterflyFun = document.getElementById("chkButterflyView");
    var parentButterFly = butterflyFun.parentElement;
    $(parentButterFly).prop("className", "form-checkbox form-icon form-text");
    var flowchartFun = document.getElementById("chkFlowchartView");
    var parentFlowchart = flowchartFun.parentElement;
    $(parentFlowchart).prop("className", "form-checkbox form-icon form-text");
    var sequentailFun = document.getElementById("chkSequentialView");
    var parentSequentail = sequentailFun.parentElement;
    $(parentSequentail).prop("className", "form-checkbox form-icon form-text");
    switch (option) {
    case 1:
        document.getElementById("chkButterflyView").checked = false;
        document.getElementById("chkFlowchartView").checked = false;
        $(parentSequentail).prop("className", "form-checkbox form-icon form-text active");
        break;
    case 2:
        document.getElementById("chkSequentialView").checked = false;
        document.getElementById("chkFlowchartView").checked = false;
        $(parentButterFly).prop("className", "form-checkbox form-icon form-text active");
        break;
    case 3:
        document.getElementById("chkSequentialView").checked = false;
        document.getElementById("chkButterflyView").checked = false;
        $(parentFlowchart).prop("className", "form-checkbox form-icon form-text active");
        break;
    default:
        break;
    }
    var chksquentail = document.getElementById("chkSequentialView").checked;
    var chkButterfly = document.getElementById("chkButterflyView").checked;
    var chkFlowChart = document.getElementById("chkFlowchartView").checked;
    callforthtab(projectId, stmtId, chksquentail, chkButterfly, chkFlowChart);
}

function downloadGraphTooManyNodes() {
    var tDataNewNodes = window.localStorage.getItem("forthTabDataNodes");
    var tDataNewLinks = window.localStorage.getItem("forthTabDataLinks");
    var nodes = JSON.parse(tDataNewNodes);
    var links = JSON.parse(tDataNewLinks);
    var gNodes = [];
    var gLinks = [];
    $.each(nodes, function (i, node) {
        gNodes.push({
            Id: node.Id,
            Name: node.Name,
            ProgramId: node.ProgramId,
            ActionWorkflowId: node.ActionWorkflowId,
            GroupId: node.GroupId,
            GroupName: node.GroupName,
            StatementId: node.StatementId,
            ShapeId: node.ShapeId,
            Color: node.Color,
            JsonId: node.Id
        });
    });
    $.each(links, function (i, link) {
        var lineTp = "";
        var lineCl = "";
        if (link.lineType !== null && typeof link.lineType !== "undefined" && link.lineType !== "") {
            lineTp = link.lineType;
            lineCl = link.lineColor;
        }
        gLinks.push({
            LinkText: link.LinkText,
            StatementId: link.StatementId,
            ProgramId: link.ProgramId,
            Origin: link.Origin,
            Target: link.Target,
            ActionWorkflowId: link.ActionWorkflowId,
            LineType: lineTp,
            LineColor: lineCl
        });
    });
    // var workFlowData = { Nodes: gNodes, Links: gLinks };

    var graphString = "";
    graphString += getGraphHeader();
    $.each(gNodes, function (i, node) {
        graphString += createNode(node);
    });
    graphString += getFileTypeExtension();

    $.each(gLinks, function (i, link) {
        var linkId = "edge_" + (i + 1);
        graphString += createLink(linkId, link);
    });
    graphString += closeGraph();
    graphString = graphString.replace(/ /g, "%20");
    var fileName = gNodes[0].Name;
    fileName = fileName + ".graphml";
    this.download(fileName, graphString);
}

/* Additional sidebar */
function loadProjectAssociationData(projectId, programId) {
    $("#treeAssociationsTab").jqxTreeGrid("refresh");
    var prjId = parseInt(projectId);
    $.get(baseAddress + "CustomView/GetProjectAssociationAndProperties?projectId=" + prjId + "&programId=" + programId,
        function (tData) {
            var sourceNew =
            {
                dataType: "json",
                dataFields: [
                    { name: "GraphId", type: "string" },
                    { name: "ParentId", type: "string" },
                    { name: "GraphName", type: "string" },
                    { name: "NodeId", type: "integer" }
                ],
                hierarchy:
                {
                    keyDataField: { name: "GraphId" },
                    parentDataField: { name: "ParentId" }
                },
                id: "GraphId",
                localData: tData
            };

            var dataAdapter = new $.jqx.dataAdapter(sourceNew);
            $("#treeAssociationsTab")
                .jqxTreeGrid(
                    {
                        width: "100%",
                        height: 220,
                        source: dataAdapter,
                        altRows: true,
                        showHeader: false,
                        sortable: true,
                        columns: [
                            { text: "GraphName", dataField: "GraphName", width: "100%" }
                        ]
                    });
            $("#treeAssociationsTab").on("cellEndEdit", function (event) {
                var args = event.args;
                var rowKey = args.key;
                var rowData = args.row;
                var columnDataField = args.dataField;
                var columnDisplayField = args.displayField;
                var value = args.value;
                if (rowData.ParentId === "3") {
                    updateAssociationData(projectId, stmtId, value, 0);
                } else if (rowData.ParentId === "4") {
                    updateAssociationData(projectId, stmtId, value, 1);
                }

            });

        });
}

function loadProjectDataDependency(projectId, programId) {
    $("#treeDataDependency").jqxTreeGrid("refresh");
    $.get(baseAddress + "CustomView/GetDataDependency?projectId=" + projectId + "&programId=" + programId,
        function (tData) {
            if (tData.length === 0) {
                document.getElementById("treeDataDependency").style.visibility = "hidden";
                document.getElementById("treeDataDependency").style.display = "none";

                document.getElementById("treeDataDependency1").style.visibility = "visible";
                document.getElementById("treeDataDependency1").style.display = "inline";
            } else {

                document.getElementById("treeDataDependency1").style.visibility = "hidden";
                document.getElementById("treeDataDependency1").style.display = "none";

                document.getElementById("treeDataDependency").style.visibility = "visible";
                document.getElementById("treeDataDependency").style.display = "inline";
                var sourceNew =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" },
                        { name: "NodeId", type: "integer" }
                    ],
                    hierarchy:
                    {
                        keyDataField: { name: "GraphId" },
                        parentDataField: { name: "ParentId" }
                    },
                    id: "GraphId",
                    localData: tData
                };

                var dataAdapter = new $.jqx.dataAdapter(sourceNew);

                $("#treeDataDependency").jqxTreeGrid(
                    {
                        width: "100%",
                        height: 150,
                        source: dataAdapter,
                        altRows: true,
                        showHeader: false,
                        sortable: true,
                        columns: [
                            { text: "GraphName", dataField: "GraphName", width: "100%" }
                        ]
                    });
            }
        });
}

function viewSourceDialog(projectId, fileId) {
    $("#ViewSourceInputBody").hide();
    /*
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId,
        success: function (projectDetails) {
            if (projectDetails != null) {
                if (projectDetails[0].LanguageMaster.LanguageId === 6) {
                }
            }
        }
    });
    */
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

    $("#ViewSourceInputModal_SearchBox").keypress(function (e) {
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

    $("#ViewSourceInputModal_SearchPrev").click(function () {
        hitHighlighter.prevHit();
    });

    $("#ViewSourceInputModal_SearchNext").click(function () {
        hitHighlighter.nextHit();
    });

    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        jQuery.ajax({
            url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?projectId=" + projectId + "&fileId=" + fileId,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSourcePopup").innerHTML = tData.SourceData;
                    $("#ViewSourceInputBody").hide();
                    $(("#li1")).addClass("active");
                    $(("#li2")).removeClass("active");
                    $(("#tabSourceCodPopup")).addClass("tab-pane fade in active");
                    $(("#tabPseudoCodePopup")).addClass("tab-pane fade in");
                    $("#tabSourceCodPopup").show();
                    $("#tabPseudoCodePopup").hide();
                    $("#ViewSourceInputBody").show();
                    $("#viewSourceDialog").modal("show");
                }
            }
        });
    }
}

function openLink(dvCtrl) {
    var parentWin = window.opener;
    var thisDiv = $(dvCtrl)[0];
    var url = thisDiv.innerHTML.replace(/&amp;/g, "&");
    if (parentWin) {
        parentWin.location.href = url;
    } else {
        open(url, "_blank");
    }
}

function displayMessage(message, size) {
    bootbox.alert({
        message: message,
        size: size
    });
}

function clearGidForObjectType() {
    $body.addClass("loading");
    $("#treeViewSource").val("");
    $("#jqGirdFirstTab").val("");
    $("#jqxFormattedSource").val("");
    document.getElementById("FileDetails").style.display = "none";
    document.getElementById("EntityDetails").style.display = "none";
    document.getElementById("descriptorDetails").style.display = "none";
    var gridObjEntity = $("#divDatabaseSchema").data("ejGrid");
    if (typeof gridObjEntity !== "undefined") {
        gridObjEntity.refreshContent(); // Refreshes the grid contents only
        gridObjEntity.refreshContent(true); // Refreshes the template and grid contents
    }
    var gridDivUniverseDecriptor = $("divUniverseDecriptor").data("ejGrid");
    if (typeof gridDivUniverseDecriptor !== "undefined") {
        gridDivUniverseDecriptor.refreshContent(); // Refreshes the grid contents only
        gridDivUniverseDecriptor.refreshContent(true); // Refreshes the template and grid contents
    }
    var gridAssDepEntities = $("AssDepEntities").data("ejGrid");
    if (typeof gridAssDepEntities !== "undefined") {
        gridAssDepEntities.refreshContent(); // Refreshes the grid contents only
        gridAssDepEntities.refreshContent(true); // Refreshes the template and grid contents
    }
    var griDivDescriptor = $("divDescriptor").data("ejGrid");
    if (typeof griDivDescriptor !== "undefined") {
        griDivDescriptor.refreshContent(); // Refreshes the grid contents only
        griDivDescriptor.refreshContent(true); // Refreshes the template and grid contents
    }
    $body.removeClass("loading");
}

/* Tags tab */
function getTagCategoryMaster() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTags",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var localData = [];
            localData.push({
                TagsMasterId: "0",
                TagName: "Select Tag"
            });
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
                    selectedIndex: 0,
                    source: dataAdapter,
                    displayMember: "TagName",
                    valueMember: "TagsMasterId",
                    width: 200,
                    height: 25
                });
                $("#ddlTags").val("0");
                $("#ddlTags").on("change", function (event) {
                    var args = event.args;
                    var tagId = args.item.value;
                    if (tagId === 0) return;
                    fillTagCategories(tagId);
                });
                $("#txtTag").removeAttr("disabled");
                $("#dvAddTags").modal("show");
            }
        }
    });
}

var fillTagCategories = function (tagId) {
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
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagCategory?tagId=" + tagId,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var localData = [];
            localData.push({
                TagCategoryMasterId: "0",
                TagCategoryName: "Select Category"
            });
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
                    source: dataAdapter,
                    displayMember: "TagCategoryName",
                    valueMember: "TagCategoryMasterId",
                    width: 200,
                    height: 24
                });
                $("#ddlTagCategories").val("0");
                $("#ddlTagCategories").on("change", function (event) {
                    var args = event.args;
                    var categoryId = args.item.value;
                    if (categoryId === 0) return;
                    document.getElementById("txtTag").disabled = true;
                    // $("#txtTag").attr("disabled", "disabled");
                    fillTagCategoryValues(categoryId);
                });
            }
        }
    });
};

var fillTagCategoryValues = function (categoryId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagsValues?categoryId=" + categoryId,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var localData = [];
            localData.push({
                TagCategoryValuesId: "0",
                TagCategoryValue: "Select Value"
            });
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
                source: dataAdapter,
                displayMember: "TagCategoryValue",
                valueMember: "TagCategoryValuesId",
                width: 200,
                height: 24
            });
            $("#ddlTagCategoryValues").val("0");
        }
    });
};

$(document).ready(function () {
    $("#btnAddTag").click(function () {
        var error = document.getElementById("tdEmpError12");
        if ($("#ddlTags").val() === "0") {
            error.innerHTML = "Please select Tag";
            $("#ddlTags").focus();
            $("#ddlTags").css("border-color", "red");
            $("#ddlTags").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#ddlTagCategories").val() !== "0" && $("#ddlTagCategoryValues").val() === "0") {
            error.innerHTML = "Please select Tag Category Value";
            $("#ddlTagCategoryValues").focus();
            $("#ddlTagCategoryValues").css("border-color", "red");
            $("#ddlTagCategoryValues").on("change", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagName = "";
        tagName += $("#ddlTagCategoryValues").val() === "0" || $("#ddlTagCategoryValues").val() === ""
            ? "" : $("#ddlTagCategoryValues").text();

        tagName += $("#ddlTagCategories").val() === "0" || $("#ddlTagCategories").val() === ""
            ? "" : " (" + $("#ddlTagCategories").text() + ")";


        // if (tagName === "") { tagName = $("#ddlTags").text(); }

        tagName = $("#txtTag").val() === "" ? tagName : $("#txtTag").val() + " - " + tagName;
        var programId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
        // var selectedObject = $("#ddlObjectTypes").val();
        var itemSource = {
            ProjectId: parseInt(projectId),
            TagName: tagName,
            programId: programId,
            TagsMasterId: $("#ddlTags").val(),
            TagCategoryId: $("#ddlTagCategories").val(),
            TagCategoryValuesId: $("#ddlTagCategoryValues").val(),
            DataInventoryId: 0,
            UserId: parseInt(userId)
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "WorkspaceWorkflow/AddTagMaster",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(itemSource),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag Name added successfully";
                    error.style.color = "green";
                    $("#txtTag").val("");
                    getTagNameData(parseInt(projectId), programId);
                    $("#ddlTags").val("0");
                    $("#ddlTagCategories").val("0");
                    $("#ddlTagCategoryValues").val("0");
                }
            }
        });
    });
});

var showTags = function () {
    document.getElementById("tdEmpError12").innerHTML = "";
    var tagInput = document.getElementById("txtTag");
    tagInput.removeAttribute("disabled");
    $("#txtTag").removeAttr("disabled");

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
    getTagCategoryMaster();
};

