document.addEventListener("DOMContentLoaded", function () {
    var checkBrowser = function () {
        var errMsg =
            "<p style='color: red;'> Please use certified browsers to use this product.<br /><br /> Valid browsers are Microsoft Edge and Chrome.</ p> ";
        var isOpera = !!window.opr && !!window.opr.addons ||
            !!window.opera ||
            navigator.userAgent.indexOf(" OPR/") >= 0;
        if (isOpera) $("#LoginForm").html("").html(errMsg);
        // var isFirefox = typeof window.InstallTrigger !== "undefined";
        // if (isFirefox) $("#LoginForm").html("").html(errMsg);
        var isSafari = /constructor/i.test(window.HTMLElement) ||
            (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
            (!window['safari'] || window.safari.pushNotification);
        if (isSafari) $("#LoginForm").html("").html(errMsg);
        var isIe = false || !!document.documentMode;
        if (isIe) $("#LoginForm").html("").html(errMsg);
        // var isEdge = !isIE && !!window.StyleMedia;
        // var isChrome = !!window.chrome && !!window.chrome.webstore;
        // if (isChrome) $("#LoginForm").html("").html(errMsg);
        // var isBlink = (isChrome || isOpera) && !!window.CSS;
    };
    checkBrowser();
});
var baseAddress = $.fn.baseAddress();
window.localStorage.clear();

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function() {
    $("#BtnLogin").click(checkLogin);
});

var checkLogin = function() {
    if ($("#TxtUserName").val() === "") {
        document.getElementById("tdError").innerHTML = "Please enter username";
        $("#TxtUserName").focus();
        return;
    }
    if ($("#TxtPassword").val() === "") {
        document.getElementById("tdError").innerHTML = "Please enter password";
        $("#TxtPassword").focus();
        return;
    }
    document.getElementById("tdError").innerHTML = "";
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "UserMaster/UserLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "UserName": document.getElementById("TxtUserName").value,
            "Password": document.getElementById("TxtPassword").value
        }),
        success: function(data) {
            if (data !== null) {
              // ReSharper disable once QualifiedExpressionMaybeNull
                $.fn.actionAuditLog(result.UserId, "User Login", "0").then(function() {
                    const userInfo = result;
                    const loginUserInfo = {
                        UserName: userInfo.UserName,
                        UserId: userInfo.UserId,
                        UserRoleId: userInfo.RoleId,
                        AssignedProjects: userInfo.ProjectIds
                    };
                    window.localStorage.setItem("login-user-info", JSON.stringify(loginUserInfo));
                    window.localStorage.setItem("userId", result.UserId);
                    window.localStorage.setItem("uName", result.UserName);
                    window.localStorage.setItem("orgId", result.OrgnizationId);
                    window.localStorage.setItem("projectIds", result.ProjectIds);
                    window.localStorage.setItem("userRoleMenu", result.UserRoleMenu);
                    window.localStorage.setItem("landingRoleMenu", result.LandingRoleMenu);
                    const defualtLandingPage = result.DefualtLandingPage;
                    if (defualtLandingPage === "Portfolio - Default") {
                        window.location = "landing.html";
                    } else if (defualtLandingPage === "Project Dashboard") {
                        window.localStorage.setItem("prjctId", result.DefualtProjectId);
                        window.location = "projects_workspace.html?pid=" + result.DefualtProjectId + "";
                    } else if (defualtLandingPage === "Search - Query Console") {
                        window.location = "query_console.html";
                    } else {
                        window.location = "landing.html";
                    }
                   
                }).catch(function(e) {
                    console.log(e);
                });
            }
        },
        statusCode: {
            200: function() {

            },
            201: function() {

            },
            400: function(response) {
                document.getElementById("tdError").innerHTML = response.responseJSON.Message;
            },
            404: function(response) {
                document.getElementById("tdError").innerHTML = "User " + response.statusText;
            },
            500: function(response) {
                document.getElementById("tdError").innerHTML = response.statusText;
            }
        },
        error: function(e) {
            console.log(e);
            document.getElementById("tdError").innerHTML = "Error while connecting to API";
        }
    });
};