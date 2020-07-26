(function ($) {
    $.fn.baseAddress = function () {  // test

        var hostName = window.location.hostname;
        var baseUrl = window.location.protocol + "//" + hostName + ":8888/api/";
        return baseUrl;

        /*
        var hostName = window.location.hostname;
        var baseUrl = window.location.protocol + "//" + hostName + "//flokapture-main-api/api/";
        return baseUrl;
        */
    };
    this.getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
}(jQuery));

(function ($) {
    $.fn.actionAuditLog = async function (userId, rptName, projectId) {
        return await new Promise(function (resolve, reject) {
            var url = (window.location !== window.parent.location)
                ? document.referrer
                : document.location.href;
            var fileName = url.substring(url.lastIndexOf('/') + 1).split("?")[0];
            jQuery.ajax({
                url: baseAddress + "General/ActionAuditLog",
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("UserId", userId);
                    xhr.setRequestHeader("FromPage", fileName);
                    xhr.setRequestHeader("ReportName", rptName);
                    xhr.setRequestHeader("ProjectId", projectId);
                }
            }).then(function (d) {
                    console.log(`Action logged: ${rptName}`);
                    resolve(d);
                },
                function (e) {
                    console.log(`Action not logged: ${rptName}`);
                    reject(e);
                });
        });
    };
    $.fn.auditActionLog = (opt) => new Promise(function (resolve, reject) {
        var addr = baseAddress || $.fn.baseAddress();
        jQuery.ajax({
            url: addr + "General/AuditActionLog",
            type: "POST",
            data: opt.postData,
            success: function (d) {
                console.log(d);
                resolve(d);
            },
            error: function (e) {
                console.log(e);
                reject(e);
            }
        });
    });
})(jQuery);