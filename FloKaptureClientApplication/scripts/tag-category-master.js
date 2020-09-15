var baseAddress = $.fn.baseAddress();
$(document).ready(function () {
    bindAllTags();
    fillCategoryGrid();
    $("#btnAddTagCategory").click(function () {
        $("#txtTagCategoryName").val("");
        document.getElementById("tdError").innerHTML = "";
        $("#divAdd").show();
        $("#divView").hide();
        $("#divUpdate").hide();
    });

    $("#addTagCategory").click(function () {
        var error = document.getElementById("tdError");
        if ($("#ddlTags").val() === "" || $("#ddlTags").val() === "0") {
            error.innerHTML = "Please select tag";
            $("#ddlTags").focus();
            $("#ddlTags").css("border-color", "red");
            $("#ddlTags").on("keypress", function () {
                $(this).css("border-color", "");
            });
            $("#ddlTags").on("change", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtTagCategoryName").val() === "") {
            error.innerHTML = "Please enter tag category name";
            $("#txtTagCategoryName").focus();
            $("#txtTagCategoryName").css("border-color", "red");
            $("#txtTagCategoryName").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagCategoryMaster = {
            TagsMasterId: $("#ddlTags").val(),
            TagCategoryName: $("#txtTagCategoryName").val(),
            Active: true
          };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagsCategoryMaster/AddNewTagCategory",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagCategoryMaster), 
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag category added successfully.";
                    error.style.color = "green";
                    fillCategoryGrid();
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

    $("#btnEditTagCategory").click(function() {
        $("#divUpdate").show(); $("#divView").hide(); $("#divAdd").hide();
    });

    $("#btnUpdateTagCategory").click(function() {
        var tagCatMasterId = $("#hdnTagCategoryId").attr("value");
        console.log(tagCatMasterId);
        var error = document.getElementById("tdError12");
        if ($("#ddlTags12").val() === "0") {
            error.innerHTML = "Please select tag";
            $("#ddlTags12").focus();
            $("#ddlTags12").css("border-color", "red");
            $("#ddlTags12").on("keypress", function () {
                $(this).css("border-color", "");
            });
            $("#ddlTags12").on("change", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        if ($("#txtTagCategory12").val() === "") {
            error.innerHTML = "Please enter tag category";
            $("#txtTagCategory12").focus();
            $("#txtTagCategory12").css("border-color", "red");
            $("#txtTagCategory12").on("keypress", function () {
                $(this).css("border-color", "");
            });
            return false;
        }
        var tagCategoryMaster = {
            TagsMasterId: $("#ddlTags12").val(),
            TagCategoryName: $("#txtTagCategory12").val(),
            Active: true
        };
        jQuery.ajax({
            type: "POST",
            url: baseAddress + "TagsCategoryMaster/UpdateTagCategory?catMasterId=" + tagCatMasterId,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(tagCategoryMaster),
            success: function(result) {
                if (result !== null) {
                    error.innerHTML = "Tag category updated successfully.";
                    error.style.color = "green";
                    fillCategoryGrid();
                    return true;
                }
                return false;
            }
        });
    });

    $("#btnDeleteTag").click(function() {
        var categoryId = document.getElementById("hdnTagCategoryId").value;
        document.getElementById("tdEmpError").innerHTML = "";
        var error = document.getElementById("tdEmpError");
        if (categoryId === "") {
            error.innerHTML = "Please select tag category";
            return false;
        }
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "TagsCategoryMaster/DeleteCategory?categoryId=" + categoryId,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result !== null) {
                    error.innerHTML = "Tag category deleted successfully.";
                    error.style.color = "green";
                    $("#tdTagName")[0].innerHTML = "";
                    $("#tdTagCategory")[0].innerHTML = "";
                    document.getElementById("hdnTagCategoryId").value = "";
                    fillCategoryGrid();
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

});

var bindAllTags = function() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTags",
        success: function (result) {
            if (typeof result !== "undefined" && result !== null) {
                $("#ddlTags").append($("<option />").attr("value", "0").html("Select Tag"));
                $("#ddlTags12").append($("<option />").attr("value", "0").html("Select Tag"));
                $.each(result, function(i, tag) {
                    $("#ddlTags").append($("<option />").attr("value", tag.TagsMasterId).html(tag.TagType));
                    $("#ddlTags12").append($("<option />").attr("value", tag.TagsMasterId).html(tag.TagType));
                });
            }
        },
        error: function(err) { console.log(err); }
    });
};

var fillCategoryGrid = function () {
    var divCategories = $("#categoryDetails");
    divCategories.html("");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsCategoryMaster/GetAllCategories",
        success: function (result) {
            if (typeof result !== "undefined" && result !== null) {
                result.forEach(function(cat) {
                    var status = cat.Active === true ? "Active" : "InActive";
                    var headerRow = $("<tr />").attr({ "style": "cursor: pointer;", id: cat.TagCategoryMasterId, title: cat.TagsMaster.TagType });
                    headerRow.append($("<td />").append($("<label />").attr({ "class": "form-checkbox form-icon" })
                        .append($("<input />").attr({ "type": "checkbox" }))));
                    var catRow = $("<td />").attr({ "style": "cursor: pointer;", id: cat.TagCategoryMasterId })
                        .html(cat.TagCategoryName);
                    headerRow.append($("<td />").attr({ "style": "cursor: pointer;" }).html(cat.TagsMaster.TagType));
                    headerRow.append(catRow);
                    headerRow.append($("<td />").append($("<span />").attr({ "class": "label label-table label-success" }).html(status)));
                    var tempRow = $("<td />").attr({ "style": "display:none;", id: cat.TagsMasterId })
                        .html(cat.TagsMasterId);
                    headerRow.append(tempRow);
                    headerRow.on("click", function () {
                        document.getElementById("tdError12").innerHTML = "";
                        $("#divAdd").hide();
                        $("#divView").show();
                        $("#divUpdate").hide();
                        var id = $(this).attr("id");
                        $("#hdnTagCategoryId").val(id);
                        var tagMasterId = $(this).find("td").eq(4).html();
                        var tagName = $(this).attr("title");
                        var tagCatName = $(this).find("td").eq(2).html();
                        $("#tdTagName").html(tagName);
                        $("#tdTagCategory").html(tagCatName);
                        $("#ddlTags12").val(parseInt(tagMasterId));
                        $("#txtTagCategory12").val(tagCatName);
                    });
                    divCategories.append(headerRow);
                });
            }
        },
        error: function (err) { console.log(err); }
    });
};