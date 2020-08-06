var baseAddress = $.fn.baseAddress();
var prjctId = window.localStorage.getItem("prjctId");
var userId = window.localStorage.getItem("userId");
var languageId = window.localStorage.getItem("languageId");
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
    $("#mainnav-menu").metisMenu();
});

var options = {
    contentWidth: 850,
    contentHeight: 450,
    showCancel: true,
    progressBarCurrent: true
};
var wizard = undefined;
var wizardCobol = undefined;
var wizardVba = undefined;

var langId = parseInt(languageId);
langId === 5 ? wizard = $("#some-wizard").wizard(options) : langId === 4 ? wizardCobol = $("#some-wizard-Cobol").wizard(options) : wizardVba = $("#some-wizard-vba").wizard(options);

/*
if (langId === 5) wizard = $("#some-wizard").wizard(options);
else if (langId === 4) wizardCobol = $("#some-wizard-Cobol").wizard(options);
else if (langId === 6) wizardVba = $("#some-wizard-vba").wizard(options);
*/

$(document).ready(function () {
    document.getElementById("dvError").innerHTML = "";

    languageId = parseInt(languageId);
    if (prjctId === "0") {
        document.getElementById("dvError").innerHTML = "Please select project for custom impacts from main dashboard page!";
        return false;
    }
    // fillJclObjects();

    $("#btnIncludeJcl").click(function () {
        $("#listSelectedJclObject").jqxListBox("refresh");
        var items = $("#listJclObjects").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox("addItem",
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveJcl").click(function () {
        var items = $("#listSelectedJclObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnIncludePrograms").click(function () {
        $("#listSelectedProgramsObject").jqxListBox("refresh");
        var items = $("#listProgramsObjects").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedProgramsObject").jqxListBox("addItem",
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemovePrograms").click(function () {
        var items = $("#listSelectedProgramsObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedProgramsObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnIncludeSubroutines").click(function () {
        $("#listSelectedSubroutinesObject").jqxListBox("refresh");
        var items = $("#listSubroutinesObjects").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox("addItem",
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveSubroutines").click(function () {
        var items = $("#listSelectedSubroutinesObject").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox("removeItem", item);
            }); return false;
    });

    $("#btnIncludeIncludes").click(function () {
        $("#listSelectedIncludesObject").jqxListBox("refresh");
        var items = $("#listIncludesObjects").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox("addItem", { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveIncludes").click(function () {
        var items = $("#listSelectedIncludesObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnSummary").on("click", function () {
        languageId === 5 ? summaryObject() : languageId === 4 ? summaryCobolObject() : summaryVbaObject();
    });

    $("#btnGenerate").on("click", function () {
        languageId === 5 ? generateObject() : languageId === 4 ? generateCobolObject() : generateVbaObject();
    });

    $("#btnDownload").on("click", function () {
         var path = document.getElementById("hdnDownloadPath").value;
         downloadFile(path);
        /*
        var element = document.getElementById("a654321");
        element.href = path;
        element.target = "_blank";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        */
    });

    processFlow.addEventListener("click", function () {
        if (this.checked) {
            $("#tdObjConnectivity").hide();
            $("#footerSecond").addClass("modal-footer").hide();
            $("#footerFirst").removeClass("modal-footer").show();
        }
    });

    /*
    objectDependency.addEventListener("click", function () {
        if (this.checked) {
            $("#footerSecond").removeClass("modal-footer").show();
            $("#footerFirst").addClass("modal-footer").hide();
        }
    });
   */
    $("#btnFirstStepNext").click(function () {
        document.getElementById("errMsg").innerHTML = "";
        var title = $("#diagramTitle").val();
        if (title === "" || !title.match(/^[a-zA-Z0-9]/) || title.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)) {
            document.getElementById("errMsg").innerHTML = "Title should starts with Alphabet or Number and should not contain special characters.";
            return false;
        }
        var isProcessFlow = document.getElementById("processFlow").checked;
        if (isProcessFlow) {
            $("#tdObjConnectivity").hide();
            if (parseInt(languageId) === 5) {
                $("#txtTitle").val(title);
                fillJclObjects();
            }
            else if (parseInt(languageId) === 4) {
                $("#txtTitleCobol").val(title);
                fillCobolObjects();
            }
            else if (parseInt(languageId) === 6) {
                $("#txtTitleVba").val(title);
                fillVbaObjects();
            }
            return false;
        }
        var objDependency = document.getElementById("objectDependency").checked;
        if (!objDependency && title === "") return false;

        var urlAddress = languageId === 5
            ? baseAddress + "CustomRequirment/GetUniverseObjects?projectId=" + prjctId
            : languageId === 4 ? baseAddress + "CustomRequirment/GetCobolObjects?projectId=" + prjctId 
                : baseAddress + "CustomRequirment/GetVbaObjects?projectId=" + prjctId;

        jQuery.ajax({
            type: "GET",
            url: urlAddress,
            success: function (result) {
                var loopCnt = 0;
                result.forEach(function (obj) {
                    var type = obj.FileTypeExtensionReference.FileTypeName;
                    if (type === "") return;
                    loopCnt++;
                    var row = $("<tr />").attr({ style: "cursor: pointer;" }).data(obj);
                    row.append($("<td />").html(loopCnt)).append($("<td />").html(obj.FileName)).append($("<td />").html(type));
                    $("#objectsForConnectivity").append(row);
                });
                $("#tblObjConnectivity").on("click", "tr", function () {
                    $("#tblObjConnectivity").find("tr").each(function () {
                        $(this).attr({ style: "background-color: white; cursor: pointer;" });
                    });
                    $(this).attr({ style: "background-color: #ecec57; cursor: pointer;" });
                });
                $("#tdObjConnectivity").show();
                $("#footerSecond").addClass("modal-footer").show();
                $("#footerFirst").removeClass("modal-footer").hide();
            }
        });
        return true;
    });

    $("#btnGenerateAndDownload").click(function () {
        $("#tblObjConnectivity tr").each(function () {
            if ($(this).css("background-color") !== "rgb(236, 236, 87)") return;

            var title = $("#diagramTitle").val();
            var data = $(this).data();
            var includeObject = [];
            includeObject.push({
                FileName: data.FileName,
                FileId: data.FileId,
                FileTypeExtenstionId: data.FileTypeExtensionId
            });

            var includeOjbectDet = {
                ObjDetailsLst: includeObject,
                CalledFrom: true,
                ExternalCall: true,
                IncludeData: true
            };

            var customRequirmentDocDetails = {
                ProjectId: prjctId,
                Title: title,
                JclObject: null,
                ProgramObject: null,
                SubRoutineObject: null,
                IncludeObject: includeOjbectDet
            };
            jQuery.ajax({
                type: "POST",
                data: customRequirmentDocDetails,
                contenttype: "application/json",
                url: baseAddress + "ExportWordDocument/GenerateCustomDiagarm",
                success: function (d) {
                    // downloadFile(data);
                    downloadObjectConnectivityFromData(d.Nodes, d.Links, d.Legend,"Object");
                    /*
                    // document.getElementById("hdnDownloadPath").value = data;
                    var element = document.getElementById("connectivityGraph");
                    element.click();
                    document.body.removeChild(element);
                    */
                },
                error: function () {
                    $body.removeClass("loading");
                },
                statusCode: {
                    200: function () {

                    },
                    201: function () {

                    },
                    400: function (response) {
                        $body.removeClass("loading");
                    },
                    404: function (response) {
                        $body.removeClass("loading");
                    },
                    500: function (response) {
                        $body.removeClass("loading");
                    }
                }
            });
            console.log(data);
        });
    });

    setTimeout(function () {
        $("#customDiagramModal").modal("show");
    }, 3000);

    // cobol //

    $("#btnIncludeCblJcl").click(function () {
        $("#listSelectedCblJclObject").jqxListBox("refresh");
        var items = $("#listCblJclObjects").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedCblJclObject").jqxListBox("addItem",
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveCblJcl").click(function () {
        var items = $("#listSelectedCblJclObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedCblJclObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnIncludeCobol").click(function () {
        $("#listSelectedCobolObject").jqxListBox("refresh");
        var items = $("#listCobolObjects").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedCobolObject").jqxListBox("addItem",
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveCobol").click(function () {
        var items = $("#listSelectedCobolObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedCobolObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnIncludeProc").click(function () {
        $("#listSelectedProcObject").jqxListBox("refresh");
        var items = $("#listProcObjects").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedProcObject").jqxListBox("addItem",
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveProc").click(function () {
        var items = $("#listSelectedProcObject").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedProcObject").jqxListBox("removeItem", item);
            }); return false;
    });

    $("#btnIncludeInputLib").click(function () {
        $("#listSelectedInputLibObject").jqxListBox("refresh");
        var items = $("#listInputLibObjects").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedInputLibObject").jqxListBox("addItem", { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveInputLib").click(function () {
        var items = $("#listSelectedInputLibObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedInputLibObject").jqxListBox("removeItem", item);
        }); return false;
    });



    // VBA // 

    $("#btnIncludeForm").click(function () {
        $("#listSelectedFormObject").jqxListBox("refresh");
        var items = $("#listFormObjects").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedFormObject").jqxListBox("addItem",
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveForm").click(function () {
        var items = $("#listSelectedFormObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedFormObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnIncludeBas").click(function () {
        $("#listSelectedBasObject").jqxListBox("refresh");
        var items = $("#listBasObjects").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedBasObject").jqxListBox("addItem",
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveBas").click(function () {
        var items = $("#listSelectedBasObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedBasObject").jqxListBox("removeItem", item);
        }); return false;
    });

    $("#btnIncludeRpt").click(function () {
        $("#listSelectedRptObject").jqxListBox("refresh");
        var items = $("#listRptObjects").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedRptObject").jqxListBox("addItem",
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveRpt").click(function () {
        var items = $("#listSelectedRptObject").jqxListBox("getCheckedItems");
        $.each(items,
            function (i, item) {
                $("#listSelectedRptObject").jqxListBox("removeItem", item);
            }); return false;
    });

    $("#btnIncludeQuery").click(function () {
        $("#listSelectedQryObject").jqxListBox("refresh");
        var items = $("#listQueryObjects").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedQryObject").jqxListBox("addItem", { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveQuery").click(function () {
        var items = $("#listSelectedQryObject").jqxListBox("getCheckedItems");
        $.each(items, function (i, item) {
            $("#listSelectedQryObject").jqxListBox("removeItem", item);
        }); return false;
    });
});

var connectivityObject = function (nodes, links) {
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
            JsonId: node.Id,
            BusinessName: node.BusinessName,
            ParentGroupId: node.ParentGroupId,
            ChlidGroupId: node.ChlidGroupId
        });
    });

    $.each(links, function (i, link) {
        var lineTp = "";
        var lineCl = "";
        if (link.LineType !== null && typeof link.LineType !== "undefined" && link.LineType !== "") {
            lineTp = link.LineType;
            lineCl = link.LineColor;
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
    var name = $("#diagramTitle").val() || $("#txtTitle").val() || gNodes[0].Name;
    // var fileName = name + ".graphml";
    var workFlowData = { Nodes: gNodes, Links: gLinks, FileName: name };

    return workFlowData;
};

function downloadObjectConnectivityFromData(nodes, links, legend, str) {
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
            JsonId: node.Id,
            BusinessName: node.BusinessName,
            ParentGroupId: node.ParentGroupId,
            ChlidGroupId: node.ChlidGroupId
        });
    });

    $.each(links, function (i, link) {
        var lineTp = "";
        var lineCl = "";
        if (link.LineType !== null && typeof link.LineType !== "undefined" && link.LineType !== "") {
            lineTp = link.LineType;
            lineCl = link.LineColor;
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

    var workFlowData = { Nodes: gNodes, Links: gLinks };

    var prjctId = window.localStorage.getItem("prjctId");
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjctId,
        type: "POST",
        data: JSON.stringify(workFlowData),
        contentType: "application/json;charset=utf-8",
        success: function (tData) {
            document.getElementById("hdnDownloadPath").value = tData;
            if (str === "Object")
                downloadFile(tData);
            // document.getElementById("tdError").innerHTML = "Custom Diagram Complete. Click Download to view / save the file.";
            // downloadFile(tData);
        }
    });

    /*
    var graphString = "";
    graphString += getGraphHeader();
    $.each(gNodes, function (i, node) {
        graphString += createNode(node);
    });
    $.each(gLinks, function (i, link) {
        var linkId = "edge_" + (i + 1);
        graphString += createLink(linkId, link);
    });
    graphString += closeGraphNodes();
    graphString += legend;
    graphString += closeGraphComplete();
    graphString = graphString.replace(/ /g, "%20");
    var fileName = $("#diagramTitle").val() || $("#txtTitle").val() || gNodes[0].Name;
    fileName = fileName + ".graphml";
    download(fileName, graphString);
    */
}

var download = function (fileName, graphString) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:application/graphml;charset=utf-8," + graphString);
    element.setAttribute("download", fileName);
    element.id = "connectivityGraph";
    element.style.display = "none";
    document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
};

function downloadFile(path) {
    var element = document.createElement("a");
    element.href = path;
    element.target = "_blank";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function drawRow(enities, cObject) {
    var html = "";
    html += "<tr>";
    html += "<td>" + enities + "</td>";
    html += "<td><table style='width: 100%;' class='table-bordered table-striped table table-hover'>";
    html += "<tr>";
    var entString = "";
    for (var k = 0; k <= cObject["Object Name"].length - 1; k++) {
        entString += cObject["Object Name"][k] + ", ";
    }
    entString = entString.trim();
    var lastChar = entString.slice(-1);
    if (lastChar === ",") {
        entString = entString.slice(0, -1);
    };
    html += "<td style='width: 23%;'>Objects</td><td>" + entString + "</td></tr>";
    var entitySchema = cObject["Called From"];
    if (entitySchema)
        html += "<tr><td>Called From</td><td>" + entitySchema + "</td></tr> ";
    var pseudoCode = cObject["External Call"];
    if (pseudoCode)
        html += "<tr><td>External Call</td><td>" + pseudoCode + "</td></tr> ";
    var sourceCode = cObject["Data"];
    if (sourceCode)
        html += "<tr><td>Data</td><td>" + sourceCode + "</td></tr> ";

    html += "</td></table>";
    return html;
}

function fillJclObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetUniverseObjects?projectId=" + prjctId,
        success: function (result) {
            var jcls = result.filter(function (element) {
                return element.FileTypeExtensionId === 10;
            });
            $("#listJclObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: jcls,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedJclObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var programs = result.filter(function (element) {
                return element.FileTypeExtensionId === 9;
            });
            $("#listProgramsObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: programs,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedProgramsObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var subroutines = result.filter(function (element) {
                return element.FileTypeExtensionId === 17;
            });
            $("#listSubroutinesObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: subroutines,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedSubroutinesObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var includes = result.filter(function (element) {
                return element.FileTypeExtensionId === 12;
            });
            $("#listIncludesObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: includes,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedIncludesObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            // var wizard = $("#some-wizard").wizard(options);
            wizard.show();
            // var wizardCobol = $("#some-wizard-Cobol").wizard(options);
        }
    });
}

function fillCobolObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetCobolObjects?projectId=" + prjctId,
        success: function (result) {
            var jcls = result.filter(function (element) {
                return element.FileTypeExtensionId === 7;
            });
            $("#listCblJclObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: jcls,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedCblJclObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var programs = result.filter(function (element) {
                return element.FileTypeExtensionId === 6
            });
            $("#listCobolObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: programs,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedCobolObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var procObj = result.filter(function (element) {
                return element.FileTypeExtensionId === 8;
            });
            $("#listProcObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: procObj,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedProcObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var inputLib = result.filter(function (element) {
                return element.FileTypeExtensionId === 19;
            });
            $("#listInputLibObjects").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: inputLib,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedInputLibObject").jqxListBox({
                displayMember: "FileName",
                valueMember: "FileId",
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            // var wizardCobol = $("#some-wizard-Cobol").wizard(options);
            wizardCobol.show();
        }
    });
}

function summaryObject() {
    $("#tblSummary").html("");
    var title = $("#txtTitle").val();

    /* Jcl Object */
    var chkJclCalledFrom = document.getElementById("chkJclCalledFrom").checked;
    var chkJclExtCall = document.getElementById("chkJclExternalCall").checked;
    var chkJclIncludeData = document.getElementById("chkJCLData").checked;
    var jclItems = $("#listSelectedJclObject").jqxListBox("getItems");
    var jFileName = [];
    $.each(jclItems, function (i, item) {
        jFileName.push(item.label);
    });
    var jclOjbectDet = {
        "Object Name": jFileName,
        "Called From": chkJclCalledFrom === true ? "Yes" : "No",
        "External Call": chkJclExtCall === true ? "Yes" : "No",
        "Data": chkJclIncludeData === true ? "Yes" : "No"
    };
    /* Program Object */
    var chkPrgCalledFrom = document.getElementById("chkProgCalledFrom").checked;
    var chkPrgExtCall = document.getElementById("chkProgExtCall").checked;
    var chkPrgData = document.getElementById("chkProgData").checked;
    var programItems = $("#listSelectedProgramsObject").jqxListBox("getItems");
    var pFileName = [];
    $.each(programItems, function (i, item) {
        pFileName.push(item.label);
    });
    var programOjbectDet = {
        "Object Name": pFileName,
        "Called From": chkPrgCalledFrom === true ? "Yes" : "No",
        "External Call": chkPrgExtCall === true ? "Yes" : "No",
        "Data": chkPrgData === true ? "Yes" : "No"
    };
    /* SubRoutine Object */
    var chkSubCalledFrom = document.getElementById("chkSubCalledFrom").checked;
    var chkSubExtCall = document.getElementById("chkSubExtCall").checked;
    var chkSubData = document.getElementById("chkSubData").checked;
    var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox("getItems");
    var sFileName = [];
    $.each(subRoutineItems, function (i, item) {
        sFileName.push(item.label);
    });
    var subRoutineOjbectDet = {
        "Object Name": sFileName,
        "Called From": chkSubCalledFrom === true ? "Yes" : "No",
        "External Call": chkSubExtCall === true ? "Yes" : "No",
        "Data": chkSubData === true ? "Yes" : "No"
    };
    /* Include Object */
    var chkIncludeCalledFrom = document.getElementById("chkIncCalledFrom").checked;
    var chkIncludeExtCall = document.getElementById("chkIncExtCall").checked;
    var chkIncludeData = document.getElementById("chkIncData").checked;
    var includeItems = $("#listSelectedIncludesObject").jqxListBox("getItems");
    var iFileName = [];
    $.each(includeItems, function (i, item) {
        iFileName.push(item.label);
    });
    var includeOjbectDet = {
        "Object Name": iFileName,
        "Called From": chkIncludeCalledFrom === true ? "Yes" : "No",
        "External Call": chkIncludeExtCall === true ? "Yes" : "No",
        "Data": chkIncludeData === true ? "Yes" : "No"
    };
    var customRequirmentDocDetails = {
        Title: title,
        "JCL Objects": jclOjbectDet,
        "Program Objects": programOjbectDet,
        "Sub-Routine Objects": subRoutineOjbectDet,
        "Include Objects": includeOjbectDet
    };
    var html = "";
    html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
    $.each(customRequirmentDocDetails, function (i, item) {
        if (typeof item === "object")
            html += drawRow(i, item);
    });
    $("#tblSummary").append(html);
}

function generateObject() {

    var title = $("#txtTitle").val();
    /* Jcl Object */
    var jclObject = [];
    var chkJclCalledFrom = document.getElementById("chkJclCalledFrom").checked;
    var chkJclExtCall = document.getElementById("chkJclExternalCall").checked;
    var chkJclIncludeData = document.getElementById("chkJCLData").checked;
    var jclItems = $("#listSelectedJclObject").jqxListBox("getItems");
    $.each(jclItems, function (i, item) {
        jclObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 10
        });
    });
    var jclOjbectDet = {
        ObjDetailsLst: jclObject,
        CalledFrom: chkJclCalledFrom,
        ExternalCall: chkJclExtCall,
        IncludeData: chkJclIncludeData
    };

    /* Program Object */
    var programObject = [];
    var chkPrgCalledFrom = document.getElementById("chkProgCalledFrom").checked;
    var chkPrgExtCall = document.getElementById("chkProgExtCall").checked;
    var chkPrgData = document.getElementById("chkProgData").checked;
    var programItems = $("#listSelectedProgramsObject").jqxListBox("getItems");
    $.each(programItems, function (i, item) {
        programObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 9
        });
    });

    var programOjbectDet = {
        ObjDetailsLst: programObject,
        CalledFrom: chkPrgCalledFrom,
        ExternalCall: chkPrgExtCall,
        IncludeData: chkPrgData
    };

    /* SubRoutine Object */

    var subRoutineObject = [];
    var chkSubCalledFrom = document.getElementById("chkSubCalledFrom").checked;
    var chkSubExtCall = document.getElementById("chkSubExtCall").checked;
    var chkSubData = document.getElementById("chkSubData").checked;
    var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox("getItems");
    $.each(subRoutineItems, function (i, item) {
        subRoutineObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var subRoutineOjbectDet = {
        ObjDetailsLst: subRoutineObject,
        CalledFrom: chkSubCalledFrom,
        ExternalCall: chkSubExtCall,
        IncludeData: chkSubData
    };

    /* Include Object */
    var includeObject = [];
    var chkIncludeCalledFrom = document.getElementById("chkIncCalledFrom").checked;
    var chkIncludeExtCall = document.getElementById("chkIncExtCall").checked;
    var chkIncludeData = document.getElementById("chkIncData").checked;
    var includeItems = $("#listSelectedIncludesObject").jqxListBox("getItems");
    $.each(includeItems, function (i, item) {
        includeObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var includeOjbectDet = {
        ObjDetailsLst: includeObject,
        CalledFrom: chkIncludeCalledFrom,
        ExternalCall: chkIncludeExtCall,
        IncludeData: chkIncludeData
    };

    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        JclObject: jclOjbectDet,
        ProgramObject: programOjbectDet,
        SubRoutineObject: subRoutineOjbectDet,
        IncludeObject: includeOjbectDet
    };
    $body.addClass("loading");
    document.getElementById("tdError").innerHTML = "Please wait... Generating custom diagram...";
    document.getElementById("tdError").style.color = "red";
    jQuery.ajax({
        type: "POST",
        data: customRequirmentDocDetails,
        contenttype: "application/json",
        url: baseAddress + "ExportWordDocument/GenerateCustomDiagarm",
        success: function (data) {
            var workFlowData = connectivityObject(data.Nodes, data.Links);
            $body.addClass("loading");
            $.ajax({
                url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraphCustomView?projectId=" + prjctId,
                type: "POST",
                data: JSON.stringify(workFlowData),
                contentType: "application/json;charset=utf-8",
                success: function (path) {
                    var element = document.createElement("a");
                    element.id = "a654321";
                    element.href = path;
                    element.target = "_blank";
                    element.style.display = "none";
                    document.body.appendChild(element);
                    document.getElementById("hdnDownloadPath").value = path;
                    document.getElementById("tdError").innerHTML = "Custom Diagram Complete. Click Download to view / save the diagram.";
                    document.getElementById("tdError").style.color = "green";
                    $body.removeClass("loading");
                },
                error: function () {
                    $body.removeClass("loading");
                }
            });

            /*
            downloadObjectConnectivityFromData(data.Nodes, data.Links, data.Legend);
            document.getElementById("tdError").innerHTML = "Custom Diagram Complete. Click Download to view / save the diagram.";
            document.getElementById("tdError").style.color = "green";
            $body.removeClass("loading");
            */
        },
        error: function () {
            $body.removeClass("loading");
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                $body.removeClass("loading");
            },
            404: function (response) {
                $body.removeClass("loading");
            },
            500: function (response) {
                $body.removeClass("loading");
            }
        }
    });
}

// Cobol //

function summaryCobolObject() {
    $("#tblCblSummary").html("");
    var title = $("#txtTitleCobol").val();

    /* Jcl Object */
    var chkJclCalledFrom = document.getElementById("chkcBLJclCalledFrom").checked;
    var chkJclExtCall = document.getElementById("chkCblJclExternalCall").checked;
    var chkJclIncludeData = document.getElementById("chkCblJCLData").checked;
    var jclItems = $("#listSelectedCblJclObject").jqxListBox("getItems");
    var jFileName = [];
    $.each(jclItems, function (i, item) {
        jFileName.push(item.label);
    });
    var jclOjbectDet = {
        "Object Name": jFileName,
        "Called From": chkJclCalledFrom === true ? "Yes" : "No",
        "External Call": chkJclExtCall === true ? "Yes" : "No",
        "Data": chkJclIncludeData === true ? "Yes" : "No"
    };

    /* Cobol Object */

    var chkPrgCalledFrom = document.getElementById("chkCblFrom").checked;
    var chkPrgExtCall = document.getElementById("chkCblExtCall").checked;
    var chkPrgData = document.getElementById("chkCblData").checked;
    var cobolItems = $("#listSelectedCobolObject").jqxListBox("getItems");
    var cFileName = [];
    $.each(cobolItems, function (i, item) {
        cFileName.push(item.label);
    });
    var cobolOjbectDet = {
        "Object Name": cFileName,
        "Called From": chkPrgCalledFrom === true ? "Yes" : "No",
        "External Call": chkPrgExtCall === true ? "Yes" : "No",
        "Data": chkPrgData === true ? "Yes" : "No"
    };

    /* Proc Object */

    var chkProcCalledFrom = document.getElementById("chkProcCalledFrom").checked;
    var chkProcExtCall = document.getElementById("chkProcExtCall").checked;
    var chkProcData = document.getElementById("chkProcData").checked;
    var procItems = $("#listSelectedProcObject").jqxListBox("getItems");
    var pFileName = [];
    $.each(procItems, function (i, item) {
        pFileName.push(item.label);
    });
    var procOjbectDet = {
        "Object Name": pFileName,
        "Called From": chkProcCalledFrom === true ? "Yes" : "No",
        "External Call": chkProcExtCall === true ? "Yes" : "No",
        "Data": chkProcData === true ? "Yes" : "No"
    };

    /* InputLib Object */
    var chkInptCalledFrom = document.getElementById("chkInptCalledFrom").checked;
    var chkInptExtCall = document.getElementById("chkInptExtCall").checked;
    var chkInptData = document.getElementById("chkInptData").checked;
    var inputLibItems = $("#listSelectedInputLibObject").jqxListBox("getItems");
    var iFileName = [];
    $.each(inputLibItems, function (i, item) {
        iFileName.push(item.label);
    });
    var inptOjbectDet = {
        "Object Name": iFileName,
        "Called From": chkInptCalledFrom === true ? "Yes" : "No",
        "External Call": chkInptExtCall === true ? "Yes" : "No",
        "Data": chkInptData === true ? "Yes" : "No"
    };
    var customRequirmentDocDetails = {
        Title: title,
        "JCL Objects": jclOjbectDet,
        "Cobol Objects": cobolOjbectDet,
        "Proc Objects": procOjbectDet,
        "InputLib Objects": inptOjbectDet
    };
    var html = "";
    html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
    $.each(customRequirmentDocDetails, function (i, item) {
        if (typeof item === "object")
            html += drawRow(i, item);
    });
    $("#tblCblSummary").append(html);
}

function generateCobolObject() {

    var title = $("#txtTitleCobol").val();

    /* Jcl Object */
    var jclObject = [];
    var chkJclCalledFrom = document.getElementById("chkcBLJclCalledFrom").checked;
    var chkJclExtCall = document.getElementById("chkCblJclExternalCall").checked;
    var chkJclIncludeData = document.getElementById("chkCblJCLData").checked;
    var jclItems = $("#listSelectedCblJclObject").jqxListBox("getItems");
    $.each(jclItems, function (i, item) {
        jclObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 10
        });
    });
    var jclOjbectDet = {
        ObjDetailsLst: jclObject,
        CalledFrom: chkJclCalledFrom,
        ExternalCall: chkJclExtCall,
        IncludeData: chkJclIncludeData
    };

    /* Cobol Object */
    var cobolObject = [];
    var chkCblCalledFrom = document.getElementById("chkCblFrom").checked;
    var chkCblExtCall = document.getElementById("chkCblExtCall").checked;
    var chkCblData = document.getElementById("chkCblData").checked;
    var cobolItems = $("#listSelectedCobolObject").jqxListBox("getItems");
    $.each(cobolItems, function (i, item) {
        cobolObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 9
        });
    });

    var cobolOjbectDet = {
        ObjDetailsLst: cobolObject,
        CalledFrom: chkCblCalledFrom,
        ExternalCall: chkCblExtCall,
        IncludeData: chkCblData
    };

    /* Proc Object */

    var procObject = [];
    var chkProcCalledFrom = document.getElementById("chkProcCalledFrom").checked;
    var chkProcExtCall = document.getElementById("chkProcExtCall").checked;
    var chkProcData = document.getElementById("chkProcData").checked;
    var procItems = $("#listSelectedProcObject").jqxListBox("getItems");
    $.each(procItems, function (i, item) {
        procObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var procOjbectDet = {
        ObjDetailsLst: procObject,
        CalledFrom: chkProcCalledFrom,
        ExternalCall: chkProcExtCall,
        IncludeData: chkProcData
    };

    /* InputLib Object */
    var inputLibObject = [];
    var chkInptCalledFrom = document.getElementById("chkInptCalledFrom").checked;
    var chkInptExtCall = document.getElementById("chkInptExtCall").checked;
    var chkInptData = document.getElementById("chkInptData").checked;
    var inputLibItems = $("#listSelectedInputLibObject").jqxListBox("getItems");
    $.each(inputLibItems, function (i, item) {
        inputLibObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var inputLibOjbectDet = {
        ObjDetailsLst: inputLibObject,
        CalledFrom: chkInptCalledFrom,
        ExternalCall: chkInptExtCall,
        IncludeData: chkInptData
    };

    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        JclObject: jclOjbectDet,
        ProgramObject: cobolOjbectDet,
        SubRoutineObject: procOjbectDet,
        IncludeObject: inputLibOjbectDet
    };
    $body.addClass("loading");
    jQuery.ajax({
        type: "POST",
        data: customRequirmentDocDetails,
        contenttype: "application/json",
        url: baseAddress + "ExportWordDocument/GenerateCustomDiagarm",
        success: function (data) {
            downloadObjectConnectivityFromData(data.Nodes, data.Links, data.Legend, "Process");
            document.getElementById("tdError2").innerHTML = "Custom Diagram Complete. Click Download to view / save the diagram.";
            document.getElementById("tdError2").style.color = "green";
           
            $body.removeClass("loading");
        },
        error: function () {
            $body.removeClass("loading");
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                $body.removeClass("loading");
            },
            404: function (response) {
                $body.removeClass("loading");
            },
            500: function (response) {
                $body.removeClass("loading");
            }
        }
    });
}

function generateVbaObject() {

    var title = $("#txtTitleVba").val();

    /* Form Object */
    var frmObject = [];
    var chkFrmCalledFrom = document.getElementById("chkFormCalledFrom").checked;
    var chkFrmExtCall = document.getElementById("chkFormExternalCall").checked;
    var chkFrmIncludeData = document.getElementById("chkFormData").checked;
    var formItems = $("#listSelectedFormObject").jqxListBox("getItems");
    $.each(formItems, function (i, item) {
        frmObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 10
        });
    });
    var formOjbectDet = {
        ObjDetailsLst: frmObject,
        CalledFrom: chkFrmCalledFrom,
        ExternalCall: chkFrmExtCall,
        IncludeData: chkFrmIncludeData
    };

    /* Bas Object */
    var basObject = [];
    var chBasCalledFrom = document.getElementById("chkBasFrom").checked;
    var chkBasExtCall = document.getElementById("chkBasExtCall").checked;
    var chkBasData = document.getElementById("chkBasData").checked;
    var basItems = $("#listSelectedBasObject").jqxListBox("getItems");
    $.each(basItems, function (i, item) {
        basObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 9
        });
    });

    var basOjbectDet = {
        ObjDetailsLst: basObject,
        CalledFrom: chBasCalledFrom,
        ExternalCall: chkBasExtCall,
        IncludeData: chkBasData
    };

    /* Report Object */
    var reportObject = [];
    var chkRptCalledFrom = document.getElementById("chkRptCalledFrom").checked;
    var chkRptExtCall = document.getElementById("chkRptExtCall").checked;
    var chkRptData = document.getElementById("chkRptData").checked;
    var reportItems = $("#listSelectedRptObject").jqxListBox("getItems");
    $.each(reportItems, function (i, item) {
        reportObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var reportOjbectDet = {
        ObjDetailsLst: reportObject,
        CalledFrom: chkRptCalledFrom,
        ExternalCall: chkRptExtCall,
        IncludeData: chkRptData
    };

    /* Query Object */
    var queryObject = [];
    var chkQryCalledFrom = document.getElementById("chkInptCalledFrom").checked;
    var chkQryExtCall = document.getElementById("chkInptExtCall").checked;
    var chkQryData = document.getElementById("chkInptData").checked;
    var qryItems = $("#listSelectedQryObject").jqxListBox("getItems");
    $.each(qryItems, function (i, item) {
        queryObject.push({
            FileName: item.label,
            FileId: item.value,
            FileTypeExtenstionId: 17
        });
    });
    var queryOjbectDet = {
        ObjDetailsLst: queryObject,
        CalledFrom: chkQryCalledFrom,
        ExternalCall: chkQryExtCall,
        IncludeData: chkQryData
    };
    var customRequirmentDocDetails = {
        ProjectId: prjctId,
        Title: title,
        JclObject: formOjbectDet,
        ProgramObject: basOjbectDet,
        SubRoutineObject: reportOjbectDet,
        IncludeObject: queryOjbectDet
    };
    $body.addClass("loading");
    jQuery.ajax({
        type: "POST",
        data: customRequirmentDocDetails,
        contenttype: "application/json",
        url: baseAddress + "ExportWordDocument/GenerateCustomDiagarm",
        success: function (data) {
            downloadObjectConnectivityFromData(data.Nodes, data.Links, data.Legend, "Process");
            document.getElementById("tdErr1").innerHTML = "Custom Diagram Complete. Click Download to view / save the diagram.";
            document.getElementById("tdErr1").style.color = "green";
            $body.removeClass("loading");
        },
        error: function () {
            $body.removeClass("loading");
        },
        statusCode: {
            200: function () {

            },
            201: function () {

            },
            400: function (response) {
                $body.removeClass("loading");
            },
            404: function (response) {
                $body.removeClass("loading");
            },
            500: function (response) {
                $body.removeClass("loading");
            }
        }
    });
}

function summaryVbaObject() {
    $("#tblVbaSummary").html("");
    var title = $("#txtTitleVba").val();

    /* Form Object */
    var chkFrmCalledFrom = document.getElementById("chkFormCalledFrom").checked;
    var chkFrmExtCall = document.getElementById("chkFormExternalCall").checked;
    var chkFrmIncludeData = document.getElementById("chkFormData").checked;
    var frmItems = $("#listSelectedFormObject").jqxListBox("getItems");
    var fFileName = [];
    $.each(frmItems, function (i, item) {
        fFileName.push(item.label);
    });
    var frmOjbectDet = {
        "Object Name": fFileName,
        "Called From": chkFrmCalledFrom === true ? "Yes" : "No",
        "External Call": chkFrmExtCall === true ? "Yes" : "No",
        "Data": chkFrmIncludeData === true ? "Yes" : "No"
    };

    /* Bas Object */

    var chkBasCalledFrom = document.getElementById("chkBasFrom").checked;
    var chkBasExtCall = document.getElementById("chkBasExtCall").checked;
    var chkBasData = document.getElementById("chkBasData").checked;
    var basItems = $("#listSelectedBasObject").jqxListBox("getItems");
    var bFileName = [];
    $.each(basItems, function (i, item) {
        bFileName.push(item.label);
    });
    var basOjbectDet = {
        "Object Name": bFileName,
        "Called From": chkBasCalledFrom === true ? "Yes" : "No",
        "External Call": chkBasExtCall === true ? "Yes" : "No",
        "Data": chkBasData === true ? "Yes" : "No"
    };

    /* Report Object */

    var chkRptCalledFrom = document.getElementById("chkRptCalledFrom").checked;
    var chkRptExtCall = document.getElementById("chkRptExtCall").checked;
    var chkRptData = document.getElementById("chkRptData").checked;
    var rptItems = $("#listSelectedRptObject").jqxListBox("getItems");
    var rFileName = [];
    $.each(rptItems, function (i, item) {
        rFileName.push(item.label);
    });
    var rptOjbectDet = {
        "Object Name": rFileName,
        "Called From": chkRptCalledFrom === true ? "Yes" : "No",
        "External Call": chkRptExtCall === true ? "Yes" : "No",
        "Data": chkRptData === true ? "Yes" : "No"
    };

    /* Query Object */
    var chkQryCalledFrom = document.getElementById("chkQryCalledFrom").checked;
    var chkQryExtCall = document.getElementById("chkQryExtCall").checked;
    var chkQryData = document.getElementById("chkQryData").checked;
    var qryItems = $("#listSelectedQryObject").jqxListBox("getItems");
    var qFileName = [];
    $.each(qryItems, function (i, item) {
        qFileName.push(item.label);
    });
    var qryOjbectDet = {
        "Object Name": qFileName,
        "Called From": chkQryCalledFrom === true ? "Yes" : "No",
        "External Call": chkQryExtCall === true ? "Yes" : "No",
        "Data": chkQryData === true ? "Yes" : "No"
    };
    var customRequirmentDocDetails = {
        Title: title,
        "Form Objects": frmOjbectDet,
        "Bas Objects": basOjbectDet,
        "Report Objects": rptOjbectDet,
        "Query Objects": qryOjbectDet
    };
    var html = "";
    html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
    $.each(customRequirmentDocDetails, function (i, item) {
        if (typeof item === "object")
            html += drawRow(i, item);
    });
    $("#tblVbaSummary").append(html);
}

// VBA 
function fillVbaObjects() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "CustomRequirment/GetVbaObjects?projectId=" + prjctId,
        success: function (result) {
            var forms = result.filter(function (element) {
                return element.FileTypeExtensionId === 14;
            });
            $("#listFormObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: forms,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedFormObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var bas = result.filter(function (element) {
                return element.FileTypeExtensionId === 15;
            });

            $("#listBasObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: bas,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedBasObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });

            var reports = result.filter(function (element) {
                return element.FileTypeExtensionId === 13;
            });

            $("#listRptObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: reports,
                checkboxes: true,
                height: 200
            });

            $("#listSelectedRptObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            var query = result.filter(function (element) {
                return element.FileTypeExtensionId === 16;
            });
            $("#listQueryObjects").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: query,
                checkboxes: true,
                height: 200
            });
            $("#listSelectedQryObject").jqxListBox({
                displayMember: 'FileName',
                valueMember: 'FileId',
                width: 200,
                source: [],
                checkboxes: true,
                height: 200
            });
            //wizardVba.language = 6;
            wizardVba.show();
        }
    });
}
