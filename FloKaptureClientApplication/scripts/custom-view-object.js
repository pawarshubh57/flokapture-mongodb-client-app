var baseAddress = $.fn.baseAddress();

$(document).ready(function () {
    var detailedTagging = new DetailedTagging();
    var projectId = getParameterByName("prjId");
    $("#li-detailed-tagging").click(function () {
        // var fileId = $("#ddlSelectFiles").val();
        //  detailedTagging.getObjectMethods(fileId, projectId);
    });

    $("#btnShowParaDetails").click(function () {
        document.getElementById("tdErr2").innerHTML = "";
        if ($("#ddlObjParagraphs").val() === "0") {
            var err = document.getElementById("tdErr2");
            err.innerHTML = "Please select Paragraph";
            $("#ddlObjParagraphs").focus();
            $("#ddlObjParagraphs").css("border-color", "red");
            $("#ddlObjParagraphs").on("change", function () {
                $(this).css("border-color", "");
                err.innerHTML = "";
            });
            return false;
        }
        clearBusinsessTagDetails();
        $("#dv-add-btags").css("display", "inline");
        $("#dv-edit-btags").css("display", "none");
        var statementId = $("#ddlObjParagraphs").val();
        var fileId = $("#ddlSelectFiles").val();
        detailedTagging.getMethodPseudoCode(projectId, fileId, statementId);
        // detailedTagging.getMethodTreeView(projectId, fileId, statementId);
        detailedTagging.getMethodTagDetails(fileId, statementId)
            .then(function (tagData) {
                bindBusinessTagDetails(tagData);
            })
            .catch(function () { });
    });

    $("#btnAddBusinessTag").click(function () {
        var error = document.getElementById("tagError");
        if ($("#ddlObjParagraphs").val() === "0") {
            var err = document.getElementById("tdErr2");
            err.innerHTML = "Please select Paragraph";
            $("#ddlObjParagraphs").focus();
            $("#ddlObjParagraphs").css("border-color", "red");
            $("#ddlObjParagraphs").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;

        }
        if ($("#ddlBusinessTags").val() === "0") {
            if ($("#txt-business-verbiage").val() !== "") {
                $("#ddlBusinessTags").css("border-color", "");
                error.innerHTML = "";
            } else {
                error.innerHTML = "Please select Tag";
                $("#ddlBusinessTags").focus();
                $("#ddlBusinessTags").css("border-color", "red");
                $("#ddlBusinessTags").on("keypress", function () {
                    $(this).css("border-color", "");
                });
                return false;
            }

        }
        if ($("#ddlBusinessTagCategories").val() !== "0" && $("#ddlBusinessTagCategoryValues").val() === "0") {
            error.innerHTML = "Please select Tag Category Value";
            $("#ddlBusinessTagCategoryValues").focus();
            $("#ddlBusinessTagCategoryValues").css("border-color", "red");
            $("#ddlBusinessTagCategoryValues").on("change", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagName = "";
        tagName += $("#ddlBusinessTagCategoryValues").val() === "0" || $("#ddlBusinessTagCategoryValues").val() === ""
            ? "" : $("#ddlBusinessTagCategoryValues").text();

        tagName += $("#ddlBusinessTagCategories").val() === "0" || $("#ddlBusinessTagCategories").val() === ""
            ? "" : " (" + $("#ddlBusinessTagCategories").text() + ")";
        // if (tagName === ""){ tagName = $("#ddlBusinessTags").text(); }
        tagName = $("#txtBusinessTag").val() === "" ? tagName : $("#txtBusinessTag").val() + " - " + tagName;
        var selectedFileId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
        var statementId = $("#ddlObjParagraphs").val();

        var itemSource = {
            ProjectId: parseInt(projectId),
            TagName: tagName,
            FileId: selectedFileId,
            TagsMasterId: $("#ddlBusinessTags").val(),
            TagCategoryMasterId: $("#ddlBusinessTagCategories").val(),
            TagCategoryValuesId: $("#ddlBusinessTagCategoryValues").val(),
            BusinessVerbiage: $("#txt-business-verbiage").val() !== null ? $("#txt-business-verbiage").val() : "",
            MethodStatementId: $("#ddlObjParagraphs").val()
        };
        detailedTagging.submitMethodTagDetails(itemSource).then(function (d) {
            console.log(d);
            detailedTagging.getMethodTagDetails(selectedFileId, statementId)
                .then(function (tagData) {

                    bindBusinessTagDetails(tagData);
                    clearBusinsessTagDetails();
                })
                .catch(function () { });
        }).catch(function (e) {
            console.log(e);
        });
        return true;
    });

    $("#ddlBusinessTagCategories").jqxDropDownList({
        source: [{
            TagCategoryMasterId: "0",
            TagCategoryName: "Select Category"
        }],
        width: 200,
        height: 24,
        displayMember: "TagCategoryName",
        valueMember: "TagCategoryMasterId"
    });

    $("#ddlBusinessTagCategoryValues").jqxDropDownList({
        source: [{
            TagCategoryValuesId: "0",
            TagCategoryValue: "Select Value"
        }],
        width: 200,
        height: 24,
        displayMember: "TagCategoryValue",
        valueMember: "TagCategoryValuesId"
    });

    getBusinessTagCategoryMaster();

    $("#dv-add-btags").css("display", "inline");
    $("#dv-edit-btags").css("display", "none");
});

$(document).ready(function () {
    $("#ddl-business-tags").on("change", {}, fillCategoryMaster);
    $("#ddl-business-tags").on("change", {}, fillCategotyValues);
    $("#btn-update-business-tag").on("click", updateBusinessTagDetails);
});

var clearBusinsessTagDetails = function () {
    document.getElementById("tagError").innerHTML = "";
    // $("#tagError").remove();
    $("#txtBusinessTag").val("");
    $("#txt-business-verbiage").val("");
    $("#ddlBusinessTags").jqxDropDownList({
        selectedIndex: 0,
    });
    //  $("#ddlBusinessTags").jqxDropDownList('clear');
    $("#ddlBusinessTagCategories").jqxDropDownList('clear');
    $("#ddlBusinessTagCategoryValues").jqxDropDownList('clear');
};

var updateBusinessTagDetails = function () {
    var detailedTagging = new DetailedTagging();
    var data = $(this).data();
    var methodTagDetailsId = data.MethodTagDetailsId;
    var error = document.getElementById("tag-error");
    if ($("#ddl-business-tags").val() === "0") {
        if ($("#txtBusinessVerbiage").val() !== "") {
            $("#ddl-business-tags").css("border-color", "");
            error.innerHTML = "";
        } else {
            error.innerHTML = "Please select Tag";
            $("#ddl-business-tags").focus();
            $("#ddl-business-tags").css("border-color", "red");
            $("#ddl-business-tags").on("keypress",
                function () {
                    $(this).css("border-color", "");
                });
            return false;
        }
    }
    if ($("#ddl-business-tag-categories").val() !== "0" && $("#ddl-business-tag-categories").val() === "0") {
        error.innerHTML = "Please select Tag Category Value";
        $("#ddl-business-tag-category-values").focus();
        $("#ddl-business-tag-category-values").css("border-color", "red");
        $("#ddl-business-tag-category-values").on("change", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    var tagName = "";
    tagName += $("#ddl-business-tag-category-values").val() === "0" ? "" : $("#ddl-business-tag-category-values option:selected").text();
    tagName += $("#ddl-business-tag-categories").val() === "0" ? "" : " (" + $("#ddl-business-tag-categories option:selected").text() + ")";
    if (tagName === "") {
        $("#ddl-business-tags").val() !== "0" ? tagName = $("#ddl-business-tags option:selected").text() : "";
    }
    tagName = $("#txt-business-tag").val() === "" ? tagName : $("#txt-business-tag").val() + " - " + tagName;
    var selectedFileId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
    var statementId = $("#ddlObjParagraphs").val();

    var itemSource = {
        ProjectId: parseInt(projectId),
        TagName: tagName,
        FileId: selectedFileId,
        TagsMasterId: $("#ddl-business-tags").val(),
        TagCategoryMasterId: $("#ddl-business-tag-categories").val(),
        TagCategoryValuesId: $("#ddl-business-tag-category-values").val(),
        BusinessVerbiage: $("#txtBusinessVerbiage").val() !== null ? $("#txtBusinessVerbiage").val() : "",
        MethodStatementId: $("#ddlObjParagraphs").val(),
        MethodTagDetailsId: methodTagDetailsId
    };
    detailedTagging.updateMethodTagDetails(itemSource).then(function (d) {
        detailedTagging.getMethodTagDetails(selectedFileId, statementId).then(function (tagData) {
            bindBusinessTagDetails(tagData);
            $("#dv-add-btags").css("display", "inline");
            $("#dv-edit-btags").css("display", "none");
        }).catch(function () { });
    }).catch(function (e) {
        console.log(e);
    });
    return true;
};

var fillCategoryMaster = function () {
    var tagId = $("#ddl-business-tags").val();
    if (tagId === "0" || tagId === 0) return;
    jQuery.ajax({
        url: baseAddress + "TagsMaster/GetAllTagCategory?tagId=" + tagId
    }).done(function (result) {
        $("#ddl-business-tag-categories").empty();
        $("#ddl-business-tag-categories").append($("<option />").val("0").html("Select Tag Category"));
        result.forEach(function (d) {
            $("#ddl-business-tag-categories").append($("<option />").val(d.TagCategoryMasterId).html(d.TagCategoryName));
        });
    }).fail();
};

var fillCategotyValues = function () {
    var categoryId = $("#ddl-business-tag-categories").val();
    if (categoryId === "0" || categoryId === 0) return;
    jQuery.ajax({
        url: baseAddress + "TagsMaster/GetAllTagsValues?categoryId=" + categoryId
    }).done(function (result) {
        $("#ddl-business-tag-category-values").empty();
        $("#ddl-business-tag-category-values").append($("<option />").val("0").html("Select Category Value"));
        result.forEach(function (d) {
            $("#ddl-business-tag-category-values").append($("<option />").val(d.TagCategoryValuesId).html(d.TagCategoryValue));
        });
    }).fail();
};

var deleteBusinessTag = function (ctrl) {
    var detailedTagging = new DetailedTagging();
    var selectedFileId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
    var statementId = $("#ddlObjParagraphs").val();
    var tagId = ctrl.title;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagMaster/DeleteBusinessTag?businessTagId=" + tagId,
        success: function () {
            detailedTagging.getMethodTagDetails(selectedFileId, statementId)
                .then(function (tagData) {
                    bindBusinessTagDetails(tagData);
                })
                .catch(function () { });
        }
    });
};

var editBusinessTag = function (ctrl) {
    // var detailedTagging = new DetailedTagging();
    // var selectedFileId = $("#ddlSelectFiles").val() || getParameterByName("fileId");
    // var statementId = $("#ddlObjParagraphs").val();
    $("#btn-update-business-tag").data({ MethodTagDetailsId: ctrl.title });
    $("#dv-add-btags").css("display", "none");
    $("#dv-edit-btags").css("display", "inline");
    var tagId = ctrl.title;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagMaster/EditBusinessTag?businessTagId=" + tagId
    }).done(function (bTag) {
        fillEditDropDowns(bTag.TagsMasterId, bTag.TagCategoryMasterId, bTag.TagCategoryValuesId);
        $("#ddl-business-tags").val(bTag.TagCategoryId);
        $("#ddl-business-tag-categories").val(bTag.TagCategoryMasterId);
        $("#ddl-business-tag-category-values").val(bTag.TagCategoryValuesId);
        var nameIndex = bTag.TagName !== null ? bTag.TagName.indexOf("-") >= 0 ? bTag.TagName.split("-")[0] : "" : "";
        $("#txt-business-tag").val(nameIndex);
        $("#txtBusinessVerbiage").val(bTag.BusinessVerbiage);
    }).fail(function (err) {
        console.log(err);
    });
};

var fillEditDropDowns = function (tagCatId, catMasterId, catValueId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetEditBusinessTagDetails?tagCatId=" + tagCatId + "&catMasterId=" + catMasterId,
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            if (result !== null && typeof result !== "undefined") {
                $("#ddl-business-tags").empty();
                $("#ddl-business-tags").append($("<option />").val("0").html("Select Tag"));
                result.Tags.$values.forEach(function (d) {
                    $("#ddl-business-tags").append($("<option />").val(d.TagsMasterId).html(d.TagName));
                });
                $("#ddl-business-tags").val(tagCatId);

                $("#ddl-business-tag-categories").empty();
                $("#ddl-business-tag-categories").append($("<option />").val("0").html("Select Tag Category"));
                result.CategoryMaster.$values.forEach(function (d) {
                    $("#ddl-business-tag-categories").append($("<option />").val(d.TagCategoryMasterId).html(d.TagCategoryName));
                });
                $("#ddl-business-tag-categories").val(catMasterId);

                $("#ddl-business-tag-category-values").empty();
                $("#ddl-business-tag-category-values").append($("<option />").val("0").html("Select Category Value"));
                result.CategoryValues.$values.forEach(function (d) {
                    $("#ddl-business-tag-category-values").append($("<option />").val(d.TagCategoryValuesId).html(d.TagCategoryValue));
                });
                $("#ddl-business-tag-category-values").val(catValueId);
            }
        }
    });
};

var bindBusinessTagDetails = function (tagData) {
    $("#objectBusinessTags").removeData(); $("#objectBusinessTags").html(""); $("#objectBusinessTags").empty();
    tagData.forEach(function (data) {
        var tName = data.TagName !== null ? data.TagName : "";
        var tagName = data.TagsMaster !== null ? tName + " (" + data.TagsMaster.TagType + ")" : "";
        var annotation = data.BusinessVerbiage !== null ? data.BusinessVerbiage : "";
        var deleteTag = "<button type='button' id=" +
            data.MethodTagDetailsId + " onclick='deleteBusinessTag(this)' " +
            "title=" + data.MethodTagDetailsId + " ><i class='fa fa-trash' aria-hidden='true'></i></button>";
        deleteTag += "<span>&nbsp;</span><button type='button' id=" +
            data.MethodTagDetailsId + " onclick='editBusinessTag(this)' " +
            "title=" + data.MethodTagDetailsId + " ><i class='fa fa-edit' aria-hidden='true'></i></button> ";
        var finalStr = "<tr><td><li>" + tagName + "</li></td>" +
            "<td>" + annotation + "</td>" +
            " <td style='vertical-align: top; padding-top: 3px;'>" + deleteTag + "</td></tr></table>";
        $("#objectBusinessTags").append(finalStr);
    });
};

var DetailedTagging = function () { };
DetailedTagging.prototype = {
    getMethodTagDetails: function (fileId, methodStatementId) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                    url: baseAddress + "TagMaster/GetMethodTagDetails?fileId=" + fileId + "&methodStatementId=" + methodStatementId,
                    type: "GET"
                })
                .done(function (d) {
                    resolve(d);
                })
                .fail(function (e) {
                    reject(e);
                });
        });
    },
    updateMethodTagDetails: function (methodTagDetails) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                url: baseAddress + "TagMaster/UpdateMethodTagDetails",
                data: methodTagDetails,
                type: "POST"
            }).done(function (d) {
                var res = { data: d };
                resolve(res);
            }).fail(function (e) {
                reject(e);
            });
        });
    },
    submitMethodTagDetails: function (methodTagDetails) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                url: baseAddress + "TagMaster/AddMethodTagDetails",
                data: methodTagDetails,
                type: "POST"
            }).done(function (d) {
                var res = { data: d };
                resolve(res);
            }).fail(function (e) {
                reject(e);
            });
        });
    },
    getObjectMethods: function (fileId, prjId) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetAllStatementWorkflows?fileId=" + fileId + "&projectId=" + prjId,
            success: function (data) {
                $("#ddlObjParagraphs").empty();
                if (data !== null && typeof data !== "undefined") {
                    $("#ddlObjParagraphs").append($("<option />").html("Select").val("0"));
                    data.forEach(function (w) {
                        $("#ddlObjParagraphs").append($("<option />").html(w.OriginalStatement).val(w.StatementId));
                    });
                }
            }
        });
    },
    getMethodPseudoCode: function (prjId, fileId, statementId) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetMethodPseudoCode?projectId=" + prjId + "&programId=" + fileId + "&statementId=" + statementId,
            success: function (data) {
                // console.log(data);
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
                    localData: data
                };
                var dataAdapter = new $.jqx.dataAdapter(sourceSecondTab);
                $("#jqxTagFormattedView").jqxGrid(
                    {
                        width: "100%",
                        height: 330,
                        showheader: false,
                        source: dataAdapter,
                        scrollmode: "logical",
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ]
                    });
            }
        });
    },
    getMethodTreeView: function (prjId, fileId, statementId) {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomView/GetMethodTreeView?projectId=" + prjId + "&programId=" + fileId + "&statementId=" + statementId,
            success: function (data) {
                // console.log(data);
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
                $("#jqxTagTreeView").jqxTreeGrid(
                    {
                        width: "99%",
                        height: 330,
                        source: dataAdapterSecondTab,
                        showHeader: false,
                        columns: [
                            { text: "GraphName", dataField: "GraphName" }
                        ]
                    });
                $("#jqxTagTreeView").jqxTreeGrid("expandAll");
            }
        });
    }
};

function getBusinessTagCategoryMaster() {
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
                $("#ddlBusinessTags").jqxDropDownList({
                    selectedIndex: 0,
                    source: dataAdapter,
                    displayMember: "TagName",
                    valueMember: "TagsMasterId",
                    width: 200,
                    height: 25
                });
                $("#ddlBusinessTags").val("0");
                $("#ddlBusinessTags").on("change", function (event) {
                    var args = event.args;
                    var tagId = args.item.value;
                    if (tagId === 0) return;
                    fillBusinessTagCategories(tagId);
                });
                $("#txtBusinessTag").removeAttr("disabled");
                //$("#ddlBusinessTags").modal("show");
            }
        }
    });
}

var fillBusinessTagCategories = function (tagId) {
    $("#ddlBusinessTagCategories").jqxDropDownList({
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
                $("#ddlBusinessTagCategories").jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "TagCategoryName",
                    valueMember: "TagCategoryMasterId",
                    width: 200,
                    height: 24
                });
                $("#ddlBusinessTagCategories").val("0");
                $("#ddlBusinessTagCategories").on("change", function (event) {
                    var args = event.args;
                    var categoryId = args.item.value;
                    if (categoryId === 0) return;
                    document.getElementById("txtTag").disabled = true;
                    // $("#txtTag").attr("disabled", "disabled");
                    fillBusinessTagCategoryValues(categoryId);
                });
            }
        }
    });
};

var fillBusinessTagCategoryValues = function (categoryId) {
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
            $("#ddlBusinessTagCategoryValues").jqxDropDownList({
                source: dataAdapter,
                displayMember: "TagCategoryValue",
                valueMember: "TagCategoryValuesId",
                width: 200,
                height: 24
            });
            $("#ddlBusinessTagCategoryValues").val("0");
        }
    });
};

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["ObjectDocument"], factory);
    }
    else if (typeof exports === "object") {
        module.exports = factory(require(jQuery));
    } else {
        root.objectDocument = factory(jQuery);
    }
}(typeof window !== "undefined" ? window : this, function ($) {
    "use strict";
    var baseAddress = $.fn.baseAddress();
    var ObjectDocument = function () { };
    ObjectDocument.prototype.getAttachementObjects = async function (programId, projectId) {
        var url = `${baseAddress}CustomView/GetObjectDocuments?programId=${programId}&projectId=${projectId}`;
        return await this._ajaxRequest("GET", null, url);

        //return new Promise(function(resolve,reject) {
        //    this._ajaxRequest("GET",null,url).then(function (object){resolve(object)}).catch(function (e){reject(e);});});
    };

    ObjectDocument.prototype._ajaxRequest = async function (type, data, url) {
        return await new Promise(function (resolve, reject) {
            jQuery.ajax({
                type: type,
                data: data,
                url: url
            }).then(function (response) {
                    var res = response;
                    resolve(res);
                },
                function (error) {
                    reject(error);
                });
        });
    };
    return new ObjectDocument();
}));