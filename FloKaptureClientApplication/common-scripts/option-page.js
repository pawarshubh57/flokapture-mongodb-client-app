var baseAddress = $.fn.baseAddress();
var prjctId = window.localStorage.getItem("prjctId");

$(document).ready(function () {
    $("#btnOptionFirst").click(function () {
        window.location.href = "projects_workspace.html?pid=" + prjctId;
    });
    $("#btnOptionSecond").click(function () {
        var projectId = $("#ddlProjectType").val();
        var pId = parseInt(projectId);
        if (pId !== 0) {
            window.location.href = "projects_workspace.html?pid=" + pId;
        } else {
            document.getElementById("tdError").innerHTML = "Please select Project Name";
            document.getElementById("tdError").style.color = "Red";
        }
    });
    $("#btnOptionThird").click(function () {
        var projectId = $("#ddlProjectType").val();
        var pId = parseInt(projectId);
        if (pId !== 0) {
            window.location.href = "projects_workspace.html?pid=" + pId;
        } else {
            document.getElementById("tdError").innerHTML = "Please select Project Name";
            document.getElementById("tdError").style.color = "Red";
        }
    });
    $("#btnOptionforth").click(function () {
        var projectId = $("#ddlProjectType").val();
        var pId = parseInt(projectId);
        if (pId !== 0) {
            window.location.href = "projects_workspace.html?pid=" + pId;
        } else {
            document.getElementById("tdError").innerHTML = "Please select Project Name";
            document.getElementById("tdError").style.color = "Red";
        }
    });
    $("#btnOptionfifth").click(function () {
        var projectId = $("#ddlProjectType").val();
        var pId = parseInt(projectId);
        if (pId !== 0) {
            window.location.href = "projects_workspace.html?pid=" + pId;
        } else {
            document.getElementById("tdError").innerHTML = "Please select Project Name";
            document.getElementById("tdError").style.color = "Red";
        }
    });

    $("#btnOptionSixth").click(function () {
        var projectId = $("#ddlProjectType").val();
        var pId = parseInt(projectId);
        if (pId !== 0) {
            window.location.href = "projects_workspace.html?pid=" + pId;
        } else {
            document.getElementById("tdError").innerHTML = "Please select Project Name";
            document.getElementById("tdError").style.color = "Red";
        }
    });
    $("#btnOptionSeventh").click(function () {
        window.location.href = "query_console.html";
    });
    $("#btnOptionEight").click(function () {
        window.location.href = "query_console.html";
    });
    $("#btnOptionNinth").click(function () {
        window.location.href = "query_console.html";
    });
    $("#btnOptionTenth").click(function () {
        window.location.href = "query_console.html";
    });
});

function fillProjectDropDownOpionFirst() {
    var userId = window.localStorage.getItem("userId");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "Projectmaster/Get?userId=" + userId,
        success: function (result) {
            if (result != null) {
                $("#ddlProjectType").append("<option value='0'>Select</option>");
                $.each(result, function (key, value) {
                    $("#ddlProjectType").append("<option value=" + value.ProjectId + ">" + value.ProjectName + "</option>");

                });
            }
        }
    });
}