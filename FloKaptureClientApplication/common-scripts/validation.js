
(function($) {
    var projectIdList = window.localStorage.getItem("projectIds");
    $.fn.getUserProjectDetails = function (pid) {
        var n = projectIdList.indexOf(pid);
        if (n === -1) {
            bootbox.confirm({
                message: "You have no permission to access this project details..",
                callback: function () {
                    window.location = "landing.html";
                }
            });
        }
    };
})(jQuery);

