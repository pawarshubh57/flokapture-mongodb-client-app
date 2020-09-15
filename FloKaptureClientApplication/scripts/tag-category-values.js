
$(document).ready(function () {
    getAllTagValues();
    $("#btnCreateNewTagValues").click(function () {
        getAllTagsCategory();
        document.getElementById("tdError").innerHTML = "";
        $("#divAdd").show();
        $("#divUpdate").hide();
        $("#divView").hide();
        $("#txtCategory").val();
    });

    $("#btnAddTagCValues").click(function () {
        var error = document.getElementById("tdError");
        if ($("#ddlCategoryValues").val() === "" || $("#ddlCategoryValues").val() === "0") {
            error.innerHTML = "Please select category";
            $("#ddlCategoryValues").focus();
            $("#ddlCategoryValues").css("border-color", "red");
            $("#ddlCategoryValues").on("keypress",
                function () {
                    $(this).css("border-color", "");
                });
            $("#ddlCategoryValues").on("change", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtTagValues").val() === "") {
            error.innerHTML = "Please enter category values";
            $("#txtTagValues").focus();
            $("#txtTagValues").css("border-color", "red");
            $("#txtTagValues").on("keypress",
                function () {
                    $(this).css("border-color", "");
                });
            return false;
        }
        var tagCategoryValues = {
            TagCategoryMasterId: $("#ddlCategoryValues").val(),
            TagCategoryValue: $("#txtTagValues").val(),
            Active: 1
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagsMaster/AddTagValues",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagCategoryValues),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Category values added successfully.";
                    error.style.color = "green";
                    $("#divCategory").val("");
                    $("#txtTagValues").val("");
                    getAllTagValues();
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

    $("#btnEditTagsValues").click(function () {
        getAllTagsCategoryUpdate();
        var tagValuesId = document.getElementById("hdnTagValuesId").value;
        $("#tdError12").html("");
        if (tagValuesId !== "") {
            $("#divView").hide();
            $("#divAdd").hide();
            $("#divUpdate").show();
        }
        return false;
    });

    $("#btnUpdateTagValues").click(function () {
        var error = document.getElementById("tdError12");
        if ($("#ddlCategoryValues12").val() === "") {
            error.innerHTML = "Please select category";
            $("#ddlCategoryValues12").focus();
            $("#ddlCategoryValues12").css("border-color", "red");
            $("#ddlCategoryValues12").on("keypress",
                function () {
                    $(this).css("border-color", "");
                });
            $("#ddlCategoryValues12").on("change",
                function () {
                    $(this).css("border-color", "");
                });
            return false;
        }
        if ($("#txtTagValues12").val() === "") {
            error.innerHTML = "Please enter category values";
            $("#txtTagValues12").focus();
            $("#txtTagValues12").css("border-color", "red");
            $("#txtTagValues12").on("keypress",
                function () {
                    $(this).css("border-color", "");
                });
            return false;
        }
        var tagCategoryValues = {
            TagCategoryValuesId: document.getElementById("hdnTagValuesId").value,
            TagCategoryMasterId: $("#ddlCategoryValues12").val(),
            TagCategoryValue: $("#txtTagValues12").val(),
            Active: 1
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagsMaster/UpdateTagValues",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagCategoryValues),
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Category values updated successfully.";
                    error.style.color = "green";
                    $("#divCategory").val("");
                    $("#txtTagValues").val("");
                    getAllTagValues();
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


    $("#btnDeleteTagValues").click(function() {
        document.getElementById("tdEmpError").innerHTML = "";
        var error = document.getElementById("tdEmpError");
        var tagId = document.getElementById("hdnTagValuesId").value;
        if (tagId === "") {
            error.innerHTML = "Please select tag values";
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "TagsMaster/DeteleCategoryValues?categoryId=" + tagId,
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                if (result !== null) {
                    error.innerHTML = "Tag values deleted successfully.";
                    error.style.color = "green";
                    $("#tdTagCategory")[0].innerHTML = "";
                    $("#tdTagValues")[0].innerHTML = "";
                    document.getElementById("hdnTagValuesId").value = "";
                    getAllTagValues();
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
function getAllTagsCategory() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagCategory",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result !== null) {
                $("#ddlCategoryValues").append($("<option />").attr("value", "0").html("Select category"));
                for (var k = 0; k < result.length; ++k) {
                    var categoryName = result[k].TagCategoryName; // d.TagCategoryMaster.TagCategoryName;
                    var categoryId = result[k].TagCategoryMasterId;
                    $("#ddlCategoryValues").append('<option value="' + categoryId + '">' + categoryName + "</option>");
                }
            }
        }
    });
}

function getAllTagsCategoryUpdate() {
    $("#ddlCategoryValues12").html("");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagCategory",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result !== null) {
                for (var k = 0; k < result.length; ++k) {
                    var categoryName = result[k].TagCategoryName; // d.TagCategoryMaster.TagCategoryName;
                    var categoryId = result[k].TagCategoryMasterId;
                    $("#ddlCategoryValues12").append('<option value="' + categoryId + '">' + categoryName + "</option>");
                }
                var tagValuesId = document.getElementById("hdnTagValuesId").value;
                $.get(baseAddress + "TagsMaster/GetTagValues?tagValuesId=" + tagValuesId,
                    function (data) {
                        if (data !== null) {
                            $("#ddlCategoryValues12").find("option").each(function () {
                                if (parseInt($(this).val()) === data.TagCategoryMasterId) {
                                    $(this).attr("selected", "selected");
                                }
                            });
                            $("#txtTagValues12").val(data.TagCategoryValue);
                        }
                        return false;
                    });
            }
        }
    });
}

function getAllTagValues() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagsValues",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var width = "100%";
            if (data.length === 0) {
                width = "80%";
            }
            data.forEach(function (d) {
                d.TagCategoryName = d.TagCategoryMaster.TagCategoryName;
            });
            if (data.length > 0) {
                $("#divTagValues").ejGrid(
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
                            { headerText: 'TagCategoryValuesId', visible: false, field: 'TagCategoryValuesId' },
                            { headerText: 'Category Name', field: 'TagCategoryName' },
                            { headerText: 'Category Values', field: 'TagCategoryValue' }
                        ],
                        rowSelected: function (args) {
                            var tagCategoryValuesId = args.data.TagCategoryValuesId;
                            document.getElementById("hdnTagValuesId").value = tagCategoryValuesId;
                            getTagValues(tagCategoryValuesId);
                        }
                    });
            }
        }
    });
}

function getTagValues(tagValuesId) {
    document.getElementById("tdEmpError").innerHTML = "";
    document.getElementById("tdError").innerHTML = "";
    document.getElementById("tdError12").innerHTML = "";
    $("#divView").show();
    $("#divAdd").hide();
    $("#divUpdate").hide();
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetTagValues?tagValuesId=" + tagValuesId,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data !== "undefined") {
                $("#tdTagCategory")[0].innerHTML = data.TagCategoryMaster.TagCategoryName;
                $("#tdTagValues")[0].innerHTML = data.TagCategoryValue;
            }
        }
    });
}