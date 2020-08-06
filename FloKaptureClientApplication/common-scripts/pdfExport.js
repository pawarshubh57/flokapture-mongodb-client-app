(function ($) {
    $.fn.extend({ pdfExport: function (opt) {
            var defaults = {
                separator: ',',
                ignoreColumn: [],
                tableName: 'yourTableName',
                type: 'pdf',
                pdfFontSize: 14,
                pdfLeftMargin: 20,
                escape: 'true',
                htmlContent: 'false',
                fileName: "exportData.pdf"
            };

            var options = $.extend(defaults, opt);
            var tblElement = this;
            if (options.type === 'pdf') {
                var doc = new JsPdf('p', 'pt', 'a4', true);
                doc.setFontSize(defaults.pdfFontSize);
                var startColPosition = defaults.pdfLeftMargin;
                $(tblElement).find('thead').find('tr').each(function () {
                    $(this).filter(':visible').find('th').each(function (index, data) {
                        if ($(this).css('display') !== 'none') {
                            if (defaults.ignoreColumn.indexOf(index) === -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, 20, parseString($(this)));
                            }
                        }
                    });
                });
                var startRowPosition = 20;
                var page = 1;
                var rowPosition = 0;
                $(tblElement).find('tbody').find('tr').each(function (index) {
                    var rowCalc = index + 1;

                    if (rowCalc % 26 === 0) {
                        doc.addPage();
                        page++;
                        startRowPosition = startRowPosition + 10;
                    }
                    rowPosition = (startRowPosition + (rowCalc * 10)) - ((page - 1) * 280);

                    $(this).filter(':visible').find('td').each(function (index) {
                        if ($(this).css('display') !== 'none') {
                            if (defaults.ignoreColumn.indexOf(index) === -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, rowPosition, parseString($(this)));
                            }
                        }
                    });
                });
                doc.output('datauri');
            }

            function parseString(data) {
                var contentData;
                if (options.htmlContent === 'true') {
                    contentData = data.html().trim();
                } else {
                    contentData = data.text().trim();
                }
                if (options.escape === 'true') {
                    contentData = escape(contentData);
                }
                return contentData;
            }
        }
    });
})(jQuery);