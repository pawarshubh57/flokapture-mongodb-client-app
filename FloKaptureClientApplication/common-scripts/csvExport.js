(function ($) {
    $.fn.extend({
        csvExport: function (opt) {
            var defaults = {
                separator: ",",
                ignoreColumn: [],
                tableName: "yourTableName",
                type: "csv",
                pdfFontSize: 14,
                pdfLeftMargin: 20,
                escape: true,
                htmlContent: false,
                fileName: "exportData.csv"
            };
            var options = $.extend(defaults, opt);
            var tblElement = this;
            if (options.type === "csv" || options.type === "txt") {
                var tdData = "";
                $(tblElement).find("thead").find("tr").each(function () {
                    tdData += "\n";
                    $(this).filter(":visible").find("th").each(function (index) {
                        if ($(this).css("display") !== "none") {
                            if (options.ignoreColumn.indexOf(index) === -1) {
                                tdData += '"' + parseString($(this)) + '"' + options.separator;
                            }
                        }
                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                $(tblElement).find("tbody").find("tr").each(function () {
                    tdData += "\n";
                    $(this)
                        .filter(":visible")
                        .find("td")
                        .each(function (index) {
                            if ($(this).css("display") !== "none") {
                                if (options.ignoreColumn.indexOf(index) === -1) {
                                    tdData += '"' + parseString($(this)) + '"' + options.separator;
                                }
                            }
                        });
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                var encodedUri = encodeURI("data:text/csv;charset=utf-8," + tdData);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", options.fileName);
                document.body.appendChild(link); // Required for FF
                window.open(link.href);
                // link.click();
            }

            function parseString(data) {
                var contentData;
                if (options.htmlContent) {
                    contentData = data.html().trim();
                } else {
                    contentData = data.text().trim();
                }
                if (options.escape) {
                    contentData = escape(contentData);
                }
                return contentData;
            }
        }
    });
})(jQuery);