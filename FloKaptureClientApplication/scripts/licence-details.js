var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

var moveToLanding = function () {
    window.location.href = "landing.html";
    return false;
};

$(document).ready(function () {
    var finalMeunBar = window.localStorage.getItem("landingRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    var uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;
    $("#mainnav-menu").metisMenu();

    var licenseDetails = new LicenseDetails();
    licenseDetails.getLicenseDetails();
    
    licenseDetails.getTotalLoc();

    $("#btnApplyLicense").click(showDialog);

    $("#btnAssNewLicense").click(applyLicense);

    $("#spanLocUsed").on("click", function () {
        licenseDetails.getTotalLocProjectWise();
    });
});

var applyLicense = function () {
    var licenseDetails = new LicenseDetails();
    var licKey = $("#txtLicenseKey").val();
    licenseDetails.applyLicense(licKey);
};

var showDialog = function () {
    $("#applyLicenseDialog").modal("show");
};

var bindLicData = function (licData) {
    if (licData.length <= 0) return;
    $("#noOfUsers").html(licData.TierType);
    $("#startDate").html(licData.IssuedDate);
    $("#endDate").html(licData.ExpireDate);
    $("#subscriptionTerm").html("Yearly");
    $("#licenseKey").html(licData.LicenseKey);
    $("#applyLicenseDialog").modal("hide");

    $("#licensedLoC").html(licData.MaxLoC);
    $("#allocatedLoC").html(licData.MinLoC);
};

var LicenseDetails = function () { };

var baseAddress = $.fn.baseAddress();
LicenseDetails.prototype = {
    getLicenseDetails: function () {
        var orgId = window.localStorage.getItem("orgId");
        $.ajax({
            type: "GET",
            url: baseAddress + "UserActivityAudit/GetLicenseDetails?orgId=" + orgId,
            success: function (result) {
                bindLicData(result);
            }
        });
    },
    applyLicense: function (licKey) {
        var orgId = window.localStorage.getItem("orgId");
        $.ajax({
            type: "POST",
            data: JSON.stringify({ Name: licKey }),
            contentType: "application/json",
            url: baseAddress + "UserActivityAudit/ApplyLicense?orgId=" + orgId,
            success: function (result) {
                bindLicData(result);
            }
        });
    },
    getTotalLoc: function () {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomeLicense/GetTotalLoc",
            success: function (result) {
                console.log(result);
                $("#spanLocUsed").html(result);
            },
            error: function (err) { console.log(err); }
        });
    },
    getTotalLocProjectWise: function () {
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "CustomeLicense/GetTotalLocProjectWise",
            success: function (result) {
                console.log(result);
                $("#tblProject").html("");
                var tBody = $("#tblProject"); // $(".table-responsive").find("tbody").html("");
                result.forEach(function (d) {
                    tBody.append($("<tr />").append($("<td />").html(d.MethodName)).append($("<td />").html(d.Name)));
                });
                $("#dvLocDetails").modal("show");
            },
            error: function (err) { console.log(err); }
        });
    }
};