var baseAddress = $.fn.baseAddress();
$(document).ready(function () {
    var importExportTag = new ImportExportTag();
    importExportTag.getProjects();

    $(".btn-mint").click(importExportTag.importObjectTags);

    $(".btn-primary").click(importExportTag.importParagraphTags);

    $(".btn-warning").click(importExportTag.importAnnotations);

    $(".btn-danger").click(importExportTag.importUploadedDocuments);
});

var ImportExportTag = function () { };

ImportExportTag.prototype = {
    getProjects: function () {
        $.ajax({
            type: "GET",
            url: baseAddress + "ProjectMaster/GetAllItems?UserId=1"
        }).done(function (data) {
            console.log(data);
            data.forEach(function (p) {
                $("#sourceProject").append($("<option />").html(p.ProjectName).val(p.ProjectId));
                $("#destinationProject").append($("<option />").html(p.ProjectName).val(p.ProjectId));
            });
        }).fail(function (err) { console.log(err); });
    },
    importObjectTags: function () {
        var sourceProject = $("#sourceProject").val();
        var destProject = $("#destinationProject").val();
        $.ajax({
            type: "GET",
            url: baseAddress + "TagMaster/ImportObjectTags?sourceProjectId=" + sourceProject + "&destProjectId=" + destProject
        }).done(function (res) {
            console.log(res);
            $("#msgTd").html(res).css("color", "green");
        }).fail(function (err) {
            console.log(err);
            $("#msgTd").html("Something went wrong. Please again...").css("color", "red");
        });
    },

    importParagraphTags: function () {
        var sourceProject = $("#sourceProject").val();
        var destProject = $("#destinationProject").val();
        $.ajax({
            type: "GET",
            url: baseAddress + "TagMaster/ImportParagraphTags?sourceProjectId=" + sourceProject + "&destProjectId=" + destProject
        }).done(function (res) {
            console.log(res);
            $("#msgTd").html(res).css("color", "green");
        }).fail(function (err) {
            console.log(err);
            $("#msgTd").html("Something went wrong. Please again...").css("color", "red");
        });
    },

    importAnnotations: function () {
        var sourceProject = $("#sourceProject").val();
        var destProject = $("#destinationProject").val();
        $.ajax({
            type: "GET",
            url: baseAddress + "TagMaster/ImportAnnotations?sourceProjectId=" + sourceProject + "&destProjectId=" + destProject
        }).done(function (res) {
            console.log(res);
            $("#msgTd").html(res).css("color", "green");
        }).fail(function (err) {
            console.log(err);
            $("#msgTd").html("Something went wrong. Please again...").css("color", "red");
        });
    },

    importUploadedDocuments: function () {
        var sourceProject = $("#sourceProject").val();
        var destProject = $("#destinationProject").val();
        $.ajax({
            type: "GET",
            url: baseAddress + "TagMaster/ImportUploadedDocuments?sourceProjectId=" + sourceProject + " &destProjectId=" + destProject
        }).done(function (res) {
            console.log(res);
            $("#msgTd").html(res).css("color", "green");
        }).fail(function (err) {
            console.log(err);
            $("#msgTd").html("Something went wrong. Please again...").css("color", "red");
        });
    }
};

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("landingRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
    $("#mainnav-menu").metisMenu();
});