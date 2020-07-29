var baseAddress = $.fn.baseAddress();



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["ObjectDocument"], factory);
    }
    else if (typeof exports === "object") {
        module.exports = factory(require(jQuery));
    } else {
        root.objectDocument = factory(jQuery);
    }
}(typeof window !== "undefined" ? window : this, function ($) {
    "use strict";
    var baseAddress = $.fn.baseAddress();
    var ObjectDocument = function () { };
    ObjectDocument.prototype.getAttachementObjects = async function (programId, projectId) {
        var url = `${baseAddress}CustomView/GetObjectDocuments?programId=${programId}&projectId=${projectId}`;
        return await this._ajaxRequest("GET", null, url);
    };

    ObjectDocument.prototype._ajaxRequest = async function (type, data, url) {
        return await new Promise(function (resolve, reject) {
            jQuery.ajax({
                type: type,
                data: data,
                url: url
            }).then(function (response) {
                    var res = response;
                    resolve(res);
                },
                function (error) {
                    reject(error);
                });
        });
    };
    return new ObjectDocument();
}));