(function ($) {
    $.fn.extend({
        excelExport: function (opt) {
            var defaults = {
                separator: ",",
                ignoreColumn: [],
                tableName: "Workbook",
                type: "excel",
                pdfFontSize: 18,
                pdfLeftMargin: 20,
                escape: true,
                htmlContent: false,
                fileName: "exportData.xls"
            };
            var options = $.extend(defaults, opt);
            var tblElement = this;
            if (options.type === "excel" || options.type === "doc") {
                var excel = "<table>";
                $(tblElement).find("thead").find("tr").each(function (m, n) {
                    excel += "<tr>";
                    $(this)
                        .filter(":visible")
                        .find("th")
                        .each(function (index) {
                            if ($(this).css("display") !== "none") {
                                if (options.ignoreColumn.indexOf(index) === -1) {
                                    var pString = parseString($(this));
                                    if (m === 0)
                                        excel += "<td style='font-weight: bold;'>" + pString + "</td>";
                                    else
                                        excel += "<td>" + pString + "</td>";
                                }
                            }
                        });
                    excel += "</tr>";
                });

                $(tblElement).find("tbody").find("tr").each(function (m, n) {
                    excel += "<tr>";
                    $(this)
                        .filter(":visible")
                        .find("td")
                        .each(function (index) {
                            if (options.ignoreColumn.indexOf(index) === -1) {
                                var pString = parseString($(this));
                                if (m === 0)
                                    excel += "<td style='font-weight: bold;'>" + pString + "</td>";
                                else
                                    excel += "<td>" + pString + "</td>";
                            }
                        });
                    excel += "</tr>";
                });
                excel += "</table>";

                var excelFile = prepareExcelFile(excel, options.tableName);
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer
                {
                    var blob = new window.Blob([excelFile], { type: "data:application/vnd.ms-excel;charset=utf-8;" });
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, options.fileName);
                        return true;
                    }
                    return true;
                }
                // var re = /�/gi;
                // excelFile = excelFile.replace(re, '');
                var base64Data = "base64," + $.base64.encode(excelFile);

                if (options.type === "excel") {
                    var element = document.createElement("a");
                    var fileBlob = new window.Blob([excelFile], { type: "data:application/vnd.ms-excel;charset=utf-8;" });
                    var url = window.URL.createObjectURL(fileBlob);
                    element.setAttribute("download", options.fileName);
                    element.style.display = "none";
                    element.href = url;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                } else {
                    window.open("data:application/vnd.ms-" + options.type + ";filename=" + fName + ";" + base64Data);
                }
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
                if (contentData === "undefined")
                    return "";
                return contentData;
            }

            function prepareExcelFile(excel, sheetName) {
                var excelFile =
                    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                        "xmlns:x='urn:schemas-microsoft-com:office:" +
                        options.type +
                        "' " +
                        "xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += sheetName;
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<xf fontId='Calibri'></xf>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel;
                excelFile += "</body>";
                excelFile += "</html>";
                return excelFile;
            }
            return true;
        }
    });
})(jQuery);