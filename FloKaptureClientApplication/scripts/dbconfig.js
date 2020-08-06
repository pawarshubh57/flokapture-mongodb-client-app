

$(document).ready(function () {
    var hostName = window.location.hostname;
    $("#dbServer").val(hostName);
    $("#dbPort").val("3307");
    $("#dbUsername").val("****");
    $("#dbPassword").val("*******");
});
function moveToLanding() {
    window.location = "landing.html";
    return false;
};