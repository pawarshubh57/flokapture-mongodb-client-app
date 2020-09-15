
$(document).ready(function () {
    getAllTags();

    $("#btnCreateNewTag").click(function () {
        document.getElementById("tdError").innerHTML = "";
        $("#divAdd").show();
        // $("#divShow").hide();
        $("#divView").hide();
        $("#divUpdate").hide();
    });

    $("#btnUpdateTags").click(function() {
        var error = document.getElementById("tdError12");
        if ($("#txtTabType12").val() === "") {
            error.innerHTML = "Please enter tag type";
            $("#txtTabType12").focus();
            $("#txtTabType12").css("border-color", "red");
            $("#txtTabType12").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtTabName12").val() === "") {
            error.innerHTML = "Please enter tag name";
            $("#txtTabName12").focus();
            $("#txtTabName12").css("border-color", "red");
            $("#txtTabName12").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagId = document.getElementById("hdnTagId").value;
        var tagsMaster = {
            TagName: $("#txtTabName12").val(),
            TagType: $("#txtTabType12").val(),
            Active: 1,
            TagsMasterId: tagId
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagsMaster/UpdateTag",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagsMaster),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag updated successfully.";
                    error.style.color = "green";
                    $("#txtTabName12").val(""),
                    $("#txtTabType12").val(""),
                    getAllTags();
                    return true;
                }
                return false;
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    error.innerHTML = response.responseJSON.Message;
                    error.style.color = "red";
                },
                404: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                },
                500: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                }
            },
            error: function (e) {
                console.log(e);
                error.innerHTML = "Error while connecting to API";
                error.style.color = "red";
            }
        });
    });

    $("#btnEditTags").click(function() {
        var tagId = document.getElementById("hdnTagId").value;
        $("#tdError12").html("");
        if (tagId !== "") {
            $("#divView").hide();
            $("#divAdd").hide();
            $("#divUpdate").show();
            $.get(baseAddress + "TagsMaster/GetTags?tagId=" + tagId,
                function (result) {
                    if (result !== null) {
                        $("#txtTabType12").val(result.TagType);
                        $("#txtTabName12").val(result.TagName);
                    }
                    return false;
                });
        }
        return false;
    });

    $("#btnAddTag").click(function() {
        var error = document.getElementById("tdError");
        if ($("#txtTagName").val() === "") {
            error.innerHTML = "Please enter tag name";
            $("#txtTagName").focus();
            $("#txtTagName").css("border-color", "red");
            $("#txtTagName").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtTagType").val() === "") {
            error.innerHTML = "Please enter tag type";
            $("#txtTagType").focus();
            $("#txtTagType").css("border-color", "red");
            $("#txtTagType").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagsMaster = {
            TagName: $("#txtTagName").val(),
            TagType: $("#txtTagType").val(),
            Active: 1
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagsMaster/AddNewTags",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagsMaster),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag added successfully.";
                    error.style.color = "green";
                    $("#txtTagName").val("");
                    $("#txtTagType").val("");
                    getAllTags();
                    return true;
                }
                return false;
            },
            statusCode: {
                200: function () {

                },
                201: function () {

                },
                400: function (response) {
                    error.innerHTML = response.responseJSON.Message;
                    error.style.color = "red";
                },
                404: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                },
                500: function (response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                }
            },
            error: function (e) {
                console.log(e);
                error.innerHTML = "Error while connecting to API";
                error.style.color = "red";
            }
        });
    });

    $("#btnDeleteTag").click(function() {
        document.getElementById("tdEmpError").innerHTML = "";
        var error = document.getElementById("tdEmpError");
        var tagId = document.getElementById("hdnTagId").value;
        if (tagId === "") {
            error.innerHTML = "Please select Tag ";
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "TagsMaster/DeteleItem?categoryId=" + tagId,
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                if (result !== null) {
                    error.innerHTML = "Tag deleted successfully.";
                    error.style.color = "green";
                    $("#tdTagType")[0].innerHTML = "";
                    $("#tdTagName")[0].innerHTML = "";
                    document.getElementById("hdnTagId").value = "";
                    getAllTags();
                    return true;
                }
                return false;
            },
            statusCode: {
                200: function() {

                },
                201: function() {

                },
                400: function(response) {
                    error.innerHTML = response.responseJSON.Message;
                    error.style.color = "red";
                },
                404: function(response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                },
                500: function(response) {
                    error.innerHTML = response.statusText;
                    error.style.color = "red";
                }
            },
            error: function(e) {
                console.log(e);
                error.innerHTML = "Error while connecting to API";
                error.style.color = "red";
            }
        });
    });
});

function getTagMaster(tagId) {
    document.getElementById("tdError12").innerHTML = "";
    document.getElementById("tdEmpError").innerHTML = "";
    $("#divView").show();
    $("#divAdd").hide();
    $("#divUpdate").hide();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetTags?tagId=" + tagId,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data !== "undefined") {
                $("#tdTagType")[0].innerHTML = data.TagType;
                $("#tdTagName")[0].innerHTML = data.TagName;
            }
        }
    });
}

function getAllTags() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTags",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var width = "100%";
            if (data.length === 0) {
                width = "80%";
            }
            if (data.length > 0) {
                $("#divTags").ejGrid(
                    {
                        dataSource: data,
                        allowSorting: true,
                        allowPaging: true,
                        allowReordering: true,
                        allowResizeToFit: true,
                        allowScrolling: true,
                        scrollSettings: { width: width },
                        allowSearching: true,
                        allowResizing: true,
                        toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Search] },
                        columns: [
                            { headerText: 'TagsMasterId', visible: false, field: 'TagsMasterId' },
                            { headerText: 'Tag Type', field: 'TagType' },
                            { headerText: 'Tag Name', field: 'TagName' }
                        ],
                        rowSelected: function (args) {
                            var tagId = args.data.TagsMasterId;
                            document.getElementById("hdnTagId").value = tagId;
                            getTagMaster(tagId);
                        }
                    });
            }
        }
    });
}