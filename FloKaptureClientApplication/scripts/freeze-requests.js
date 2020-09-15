var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectId = getParameterByName("pid");

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("landingRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
});

$(document).ready(function () {
    bindProjectFreezeRequests(userId);
});

var drawHtmlTable = function (id, columns, data) {
    data.forEach(function (r) {
        var tr = $("<tr />");
        columns.forEach(function (c) {
            tr.append($("<td />").html(r[c]));
        });
        $(`#${id}`).append(tr);
    });
};

var bindProjectFreezeRequests = function (userId) {
    $.ajax({
        type: "GET",
        url: baseAddress + "TagMaster/GetAllFreezeRequests?userId=" + userId
    }).done(function (fRes) {
        $("#project-freeze-requests").html("");
        fRes.forEach(function (f, idx) {
            f["SR#"] = ++idx;
            f["RequestFrom"] = f.UserMaster.UserName;
            var buttonText = f["IsApproved"] === true ? "Approved" : "Approve";
            var r = f["IsApproved"] === true ? "" : "onclick=showApproveDialog(this);";
            f["IsApproved"] = f["IsApproved"] === true ? "Yes" : "No";
            f["ApprovedBy"] = f["ApprovedByUser"] ? f.ApprovedByUser.UserName : "-";
            f["ApprovedOn"] = f["ApprovedOn"] ? f["ApprovedOn"] : "-";
            f["Action"] = "<a href='#' id='freeze-" + f.FreezeTagsMasterId + "' " + r + "><button class='btn btn-mint'>" + buttonText + "</button></a>";
        });
        var columns = ["SR#", "RequestFrom", "InitiatedOn", "IsApproved", "ApprovedBy", "ApprovedOn", "Comments", "Action"];
        // console.log(fRes);
        drawHtmlTable("project-freeze-requests", columns, fRes);
    }).fail(function (err) {
        console.log(err);
    });
};

var approveFreeze = function (flag) {
    // console.log(flag);
    var freezeTagsMasterId = $("#project-freeze-id").attr("value");
    var freeze = {
        IsApproved: flag === "Approved" ? true : false,
        ApprovedBy: parseInt(userId),
        ApprovedOn: new Date().toLocaleDateString("us"),
        FreezeTagsMasterId: parseInt(freezeTagsMasterId)
    };
    $.ajax({
        type: "POST",
        url: baseAddress + "TagMaster/UpdateFreezeProject",
        data: freeze
    }).done(function (res) {
        console.log(res);
        bindProjectFreezeRequests(projectId, userId);
    }).fail(function (err) { console.log(err); });
};

var showApproveDialog = function (ctrl) {
    $("#div-approve-freeze-project").modal("show");
    var rowId = $(ctrl).attr("id");
    var freezeId = rowId.split("-")[1];
    $("#project-freeze-id").val(freezeId);
};

$("#aLogout").click(function () {
    userLogout(userId);
});

function userLogout(userId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "UserMaster/UserLogout?userId=" + userId + "",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("uName");
            window.localStorage.setItem("userId", "");
            window.localStorage.setItem("uName", "");
            window.localStorage.clear();
            window.location = "index.html";
        },
        error: function (e) {
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("uName");
            window.localStorage.setItem("userId", "");
            window.localStorage.setItem("uName", "");
            window.localStorage.clear();
            window.location = "index.html";
        }
    });
}