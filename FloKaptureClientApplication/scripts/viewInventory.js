var baseAddress = $.fn.baseAddress();
var projectId = getParameterByName("prjId");
var userId = window.localStorage.getItem("userId");
// $.fn.getLicenseDetails("no");

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); },
    ajaxComplete: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    $("#li_1").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', "Objects Inventory");
    }, function () {
        $(this).css('cursor', 'auto');
    });

    $("#li_2").hover(function () {
        $(this).css('cursor', 'pointer').attr('title', "Data Inventory");
    }, function () {
        $(this).css('cursor', 'auto');
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("id"); // activated tab
        if (target === "tab2") {
            applyDataFilter();
        }
    });

    // $("#li_2").click(applyDataFilter);
});

$(document).ready(function () {
    document.getElementById("tdUserQry").style.display = "none";
    document.getElementById("tdUploadedDoc").style.display = "none";
    document.getElementById("tdTags").style.display = "none";
    document.getElementById("tdUsesRpt").style.display = "none";
    $("#btnExportKeywords").click(function () {
        var keyTable = $("#tblViewInventory")[0];
        exportGrid(keyTable, 'excel');
        return false;
    });
    document.getElementById("chkSkipSameInventory").checked = false;
    callSkipSame();
    bindDataInventory();

    $('.collapse').on('shown.bs.collapse', function () {
        $(this).parent().find(".fa-angle-right").removeClass("fa-angle-right").addClass("fa-angle-down");
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right");
    });
});
var dataColumns = ["SrNo", "ObjectName", "ObjectType", "ExternalCall", "CalledFrom", "UsesEntities", "Tags", "ObjectDescription"];

var getFilter = function (ctrl) {
    var filterInfoInv = $('#tblViewInventory').jqxGrid('getfilterinformation');
    var filterInfoData = $('#tblDataInventory').jqxGrid('getfilterinformation');
    var inventoryFilter = [];
    var dataFilter = [];

    filterInfoInv.forEach(function (inv) {
        var filterInv = inv.filter.getfilters();
        for (var k = 0; k < filterInv.length; k++) {
            inventoryFilter.push({
                filterValue: filterInv[k].value,
                filterCondition: 'contains',
                filterColumn: inv.datafield
            });
        }
    });
    filterInfoData.forEach(function (dt) {
        var filterDt = dt.filter.getfilters();
        for (var k = 0; k < filterDt.length; k++) {
            dataFilter.push({
                filterValue: filterDt[k].value,
                filterCondition: 'contains',
                filterColumn: dt.datafield
            });
        }
    });
    localStorage.setItem("inventoryFilter", JSON.stringify(inventoryFilter));
    localStorage.setItem("dataFilter", JSON.stringify(dataFilter));
};
var dColumns = [];
var inventoryGrid = {};

var applyDataFilter = function () {
    $('#tblDataInventory').jqxGrid('render');
    var invFilterDt = JSON.parse(localStorage.getItem("dataFilter"));
    if (invFilterDt !== null && typeof invFilterDt !== "undefined" && invFilterDt.length > 0) {
        invFilterDt.forEach(function (invDt) {
            var filterGroupDt = new $.jqx.filter();
            if (!invDt) return;
            var filterDt = filterGroupDt.createfilter('stringfilter', invDt.filterValue, invDt.filterCondition);
            filterGroupDt.addfilter(1, filterDt);
            $("#tblDataInventory").jqxGrid('addfilter', invDt.filterColumn, filterGroupDt);
        });
        $("#tblDataInventory").jqxGrid('applyfilters');
    }

    var inventoryClmn = JSON.parse(localStorage.getItem("dColumns"));
    if (inventoryClmn === null || typeof inventoryClmn === "undefined") return;
    inventoryClmn.forEach(function (ic) {
        var chked = ic.showHide;
        $("#tblDataInventory").jqxGrid('beginupdate');
        if (chked) {
            $("#tblDataInventory").jqxGrid('showcolumn', ic.name);
            $("#" + ic.id).closest("label").addClass("active");
        } else {
            $("#tblDataInventory").jqxGrid('hidecolumn', ic.name);
            $("#" + ic.id).closest("label").removeClass("active");
        }
        $("#tblDataInventory").jqxGrid('endupdate');
    });
    $('#tblDataInventory').jqxGrid('autoresizecolumns');
};

var inventoryColumns = [
    "SrNo", "ObjectName", "ExtenstionType", "LoC", "Complexity", "ExternalCall", "InternalCall", "CalledFrom",
    "UsesEntities", "ParticipateInWorkflow", "Description", "Tags", "UploadedDocuments"
];
var invColumns = [];

function showHideColumn(ctrl) {
    // var ctrlId = $(ctrl)[0].id;
    var value = $(ctrl).val();
    $("#tblViewInventory").jqxGrid('beginupdate');
    if ($(ctrl)[0].checked) {
        $("#tblViewInventory").jqxGrid('showcolumn', value);
    } else {
        $("#tblViewInventory").jqxGrid('hidecolumn', value);
    }
    // $("#tblViewInventory").jqxGrid('autoresizecolumns');
    $("#tblViewInventory").jqxGrid('endupdate');
    // invColumns[value] = $(ctrl)[0].checked;
    invColumns.push({
        name: value,
        id: $(ctrl).attr("id"),
        showHide: $(ctrl)[0].checked
    });
    localStorage.setItem("invColumns", JSON.stringify(invColumns));
}

function callSkipSame() {
    var skipSame = document.getElementById("chkSkipSameInventory").checked;
    var businessName = document.getElementById("chkBusinessSameInventory").checked;
    var langauageId;
    $('#tblViewInventory').jqxGrid('refresh');
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetLaunguageId?projectId=" + projectId,
        success: function (projectDetails) {
            if (projectDetails !== null) {
               // ReSharper disable once QualifiedExpressionMaybeNull
                langauageId = projectDetails.LanguageId;
                jQuery.ajax({
                    type: "GET",
                    url: baseAddress + "FileObjectMethodReference/ViewInventoryForProject?projectId=" +
                        projectId + "&skipSame=" + skipSame + "&businessName=" + businessName,
                    success: function (data) {
                        if (data !== null && typeof data !== "undefined") {
                            $body.addClass("loading");
                            var l = 1;
                            for (var k = 0; k < data.length; k++) {
                                data[k].SrNo = l;
                                data[k].Delete = false;
                                l++;
                            }
                            if (langauageId === 6) {
                                document.getElementById("tdUserQry").style.display = "inline";
                                document.getElementById("tdUsesRpt").style.display = "inline";
                                var sourceVba =
                                {
                                    datatype: "json",
                                    datafields: [
                                        { name: "SrNo", type: "int" },
                                        { name: "ObjectName", type: "string" },
                                        { name: "LoC", type: "int" },
                                        { name: "Complexity", type: "int" },
                                        { name: "ExternalCall", type: "int" },
                                        //{ name: "InternalCall", type: "int" },
                                        { name: "ExtenstionType", type: "string" },
                                        { name: "UsesEntities", type: "string" },
                                        { name: "UsesQueries", type: "string" },
                                        { name: "UsesReports", type: "string" },
                                        // { name: "UsesObjects", type: "string" },
                                        { name: "ParticipateInWorkflow", type: "string" },
                                        { name: "Description", type: "string" },
                                        { name: "CalledFrom", type: "string" }
                                    ],
                                    pagesize: 50,
                                    localdata: data
                                };
                                var dataAdapterVba = new $.jqx.dataAdapter(sourceVba);
                                $body.addClass("loading");
                                $("#tblViewInventory")
                                    .jqxGrid(
                                        {
                                            width: "100%",
                                            height: 550,
                                            source: dataAdapterVba,
                                            columnsautoresize: true,
                                            columnsresize: true,
                                            columnsreorder: true,
                                            pageable: true,
                                            pagesizeoptions: ['15', '30', '50'],
                                            pagermode: 'simple',
                                            sortable: true,
                                            altrows: true,
                                            scrollmode: 'logical',
                                            rendered: function (type) {
                                                if (type === "full") {
                                                    $('#tblViewInventory').jqxGrid({ pagesize: 50 });
                                                }
                                            },
                                            columns: [
                                                { text: "Sr#", datafield: "SrNo" },
                                                { text: "Object Name", datafield: "ObjectName" },
                                                { text: "Type", datafield: "ExtenstionType" },
                                                { text: "LoC", datafield: "LoC" },
                                                { text: "Complexity", datafield: "Complexity" },
                                                { text: "External Call", datafield: "ExternalCall" },
                                                // { text: "Internal Call", datafield: "InternalCall" },
                                                { text: "Called From", datafield: "CalledFrom" },
                                                { text: "Uses Entities", datafield: "UsesEntities" },
                                                { text: "Uses Queries", datafield: "UsesQueries" },
                                                { text: "Uses Reports", datafield: "UsesReports" },
                                                // { text: "Uses Objects", datafield: "UsesObjects" },
                                                { text: "Participate In Workflows", datafield: "ParticipateInWorkflow" },
                                                { text: "Description", datafield: "Description" }
                                            ]
                                        });
                                $('#tblViewInventory').jqxGrid('refresh');
                            } else {
                                document.getElementById("tdUploadedDoc").style.display = "inline";
                                document.getElementById("tdTags").style.display = "inline";
                                var source =
                                {
                                    datatype: "json",
                                    datafields: [
                                        { name: "SrNo", type: "int" },
                                        { name: "ObjectName", type: "string" },
                                        { name: "LoC", type: "int" },
                                        { name: "Complexity", type: "int" },
                                        { name: "ExternalCall", type: "int" },
                                        // { name: "InternalCall", type: "int" },
                                        { name: "ExtenstionType", type: "string" },
                                        { name: "UsesEntities", type: "string" },
                                        // { name: "UsesObjects", type: "string" },
                                        { name: "ParticipateInWorkflow", type: "string" },
                                        { name: "Description", type: "string" },
                                        { name: "CalledFrom", type: "string" },
                                        { name: "Tags", type: "string" },
                                        { name: "UploadedDocuments", type: "string" }
                                    ],
                                    pagesize: 50,
                                    localdata: data
                                };
                                var dataAdapter = new $.jqx.dataAdapter(source);
                                $body.addClass("loading");

                                $("#tblViewInventory").on("pagechanged", function (event) {
                                    var args = event.args;
                                    var pageNum = args.pagenum;
                                    var pageSize = args.pagesize;
                                    inventoryGrid.gridPage = { pageNum: pageNum, pageSize: pageSize };
                                    localStorage.setItem("inventoryGrid", JSON.stringify(inventoryGrid));
                                });

                                $("#tblViewInventory").on("bindingcomplete", function (event) {
                                    var invFilter = JSON.parse(localStorage.getItem("inventoryFilter"));
                                    if (invFilter !== null && typeof invFilter !== "undefined" && invFilter.length > 0) {
                                        invFilter.forEach(function (inv) {
                                            var filterGroup = new $.jqx.filter();
                                            if (!inv) return;
                                            var filter = filterGroup.createfilter('stringfilter', inv.filterValue, inv.filterCondition);
                                            filterGroup.addfilter(1, filter);
                                            $("#tblViewInventory").jqxGrid('addfilter', inv.filterColumn, filterGroup);
                                        });
                                        $("#tblViewInventory").jqxGrid('applyfilters');
                                    }
                                    var inventoryClmn = JSON.parse(localStorage.getItem("invColumns"));
                                    if (inventoryClmn !== null && typeof inventoryClmn !== "undefined") {
                                        inventoryClmn.forEach(function (ic) {
                                            var chked = ic.showHide;
                                            $("#tblViewInventory").jqxGrid('beginupdate');
                                            if (chked) {
                                                $("#tblViewInventory").jqxGrid('showcolumn', ic.name);
                                                $("#" + ic.id).closest("label").addClass("active");
                                            } else {
                                                $("#tblViewInventory").jqxGrid('hidecolumn', ic.name);
                                                $("#" + ic.id).closest("label").removeClass("active");
                                            }
                                            $("#tblViewInventory").jqxGrid('endupdate');
                                        });
                                    }
                                    var invGrid = JSON.parse(localStorage.getItem("inventoryGrid"));
                                    if (invGrid !== null && typeof invGrid !== "undefined") {
                                        $('#tblViewInventory').jqxGrid('gotopage', invGrid.gridPage.pageNum);
                                    }
                                    // showHideColumn(document.getElementById("chkDescription"));
                                });
                                $("#tblViewInventory").jqxGrid(
                                    {
                                        width: "100%",
                                        height: 550,
                                        source: dataAdapter,
                                        columnsautoresize: true,
                                        columnsresize: true,
                                        columnsreorder: true,
                                        pageable: true,
                                        showfilterrow: true,
                                        filterable: true,
                                        pagesizeoptions: ['15', '30', '50'],
                                        pagermode: 'simple',
                                        sortable: true,
                                        autorowheight: true,
                                        autoheight: true,
                                        altrows: true,
                                        scrollmode: 'logical',
                                        autosavestate: true,
                                        autoloadstate: true,
                                        rendered: function (type) {
                                            if (type === "full") {
                                                $('#tblViewInventory').jqxGrid({ pagesize: 50 });
                                            }
                                        },
                                        columns: [
                                            { text: "Sr#", datafield: "SrNo", width: 40 },
                                            { text: "Object Name", datafield: "ObjectName", width: 140 },
                                            { text: "Type", datafield: "ExtenstionType", width: 50 },
                                            { text: "LoC", datafield: "LoC", width: 50 },
                                            { text: "Complexity", datafield: "Complexity", width: 60 },
                                            { text: "External Call", datafield: "ExternalCall", width: 130 },
                                            // { text: "Internal Call", datafield: "InternalCall", width: 100 },
                                            { text: "Called From", datafield: "CalledFrom", width: 150 },
                                            { text: "Uses Entities", datafield: "UsesEntities", width: 100 },
                                            // { text: "Uses Objects", datafield: "UsesObjects" },
                                            { text: "Participate In Workflows", datafield: "ParticipateInWorkflow", width: 170 },
                                            { text: "Description", datafield: "Description", width: 110 },
                                            { text: "Tags", datafield: "Tags", width: 120 },
                                            { text: "Uploaded Documents", datafield: "UploadedDocuments", width: 120 }
                                        ]
                                    });
                                $('#tblViewInventory').jqxGrid('refresh');
                            }
                        }
                    }
                });
            }
        }
    });
}

function bindViewInventory(data, languageId) {
    if (data !== null && typeof data !== "undefined") {
        $body.addClass("loading");
        var l = 1;
        for (var k = 0; k < data.length; k++) {
            data[k].SrNo = l;
            data[k].Delete = false;
            l++;
        }
        var source =
        {
            datatype: "json",
            datafields: [
                { name: "SrNo", type: "int" },
                { name: "ObjectName", type: "string" },
                { name: "Loc", type: "int" },
                { name: "Complexity", type: "int" },
                { name: "ExternalCall", type: "int" },
                // { name: "InternalCall", type: "int" },
                { name: "ExtenstionType", type: "string" },
                { name: "UsesEntities", type: "string" },
                { name: "UsesQueries", type: "string" },
                { name: "UsesReports", type: "string" },
                // { name: "UsesObjects", type: "string" },
                { name: "ParticipateInWorkflow", type: "string" },
                { name: "Description", type: "string" },
                { name: "Tags", type: "string" },
                { name: "UploadedDocuments", type: "string" }
            ],
            pagesize: 50,
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        $body.addClass("loading");
        $("#tblViewInventory").jqxGrid(
            {
                width: "100%",
                height: 550,
                source: dataAdapter,
                columnsautoresize: true,
                columnsresize: true,
                showfilterrow: true,
                filterable: true,
                pageable: true,
                pagesizeoptions: ['15', '30', '50'],
                pagermode: 'simple',
                sortable: true,
                altrows: true,
                scrollmode: 'logical',
                rendered: function (type) {
                    if (type === "full") {
                        $('#tblViewInventory').jqxGrid({ pagesize: 50 });
                    }
                },
                columns: [
                    { text: "Sr#", datafield: "SrNo", width: 40 },
                    { text: "Object Name", datafield: "ObjectName", width: 140 },
                    { text: "Type", datafield: "ExtenstionType", width: 50 },
                    { text: "LoC", datafield: "LoC", width: 40 },
                    { text: "Complexity", datafield: "Complexity", width: 50 },
                    { text: "External Call", datafield: "ExternalCall", width: 130 },
                    // { text: "Internal Call", datafield: "InternalCall", width: 100 },
                    { text: "Called From", datafield: "CalledFrom", width: 150 },
                    { text: "Uses Entities", datafield: "UsesEntities", width: 100 },
                    // { text: "Uses Objects", datafield: "UsesObjects" },
                    { text: "Participate In Workflows", datafield: "ParticipateInWorkflow", width: 120 },
                    { text: "Description", datafield: "Description", width: 200 },
                    { text: "Tags", datafield: "Tags", width: 120 },
                    { text: "UploadedDocuments", datafield: "Tags", width: 120 }

                ]
            });
        // $body.removeClass("loading");
        $('#tblViewInventory').jqxGrid('refresh');
    }
}

function bindDataInventory() {
    // var url = (window.location !== window.parent.location) ? document.referrer : document.location.href;
    // var fileName = url.substring(url.lastIndexOf('/') + 1).split("?")[0];
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "FileObjectMethodReference/DataInventoryForProject?projectId=" + projectId,
        success: function (data) {
            if (data !== null && typeof data !== "undefined") {
                $body.addClass("loading");
                var l = 1;
                for (var k = 0; k < data.length; k++) {
                    data[k].SrNo = l;
                    data[k].Delete = false;
                    // data[k].ObjectName = data[k].ObjectName;
                    $(data[k].StatementInList).find("a").each(function () {
                        $(this).attr({ "href": "javascript:void(0);" });
                    });
                    l++;
                }
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: "SrNo", type: "int" },
                        { name: "ObjectName", type: "string" },
                        { name: "ObjectType", type: "string" },
                        //{ name:"StatementInList", type:"string"},
                        { name: "ExternalCall", type: "string" },
                        { name: "CalledFrom", type: "string" },
                        { name: "UsesEntities", type: "string" },
                        { name: "ObjectDescription", type: "string" },
                        { name: "Tags", type: "string" }
                    ],
                    pagesize: 50,
                    localdata: data
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                /*
                $("#tblDataInventory").on("bindingcomplete", function (event) {
                    var invFilterDt = JSON.parse(localStorage.getItem("dataFilter"));
                    if (invFilterDt !== null && typeof invFilterDt !== "undefined" && invFilterDt.length > 0) {
                        invFilterDt.forEach(function (invDt) {
                            var filterGroupDt = new $.jqx.filter();
                            if (!invDt) return;
                            var filterDt = filterGroupDt.createfilter('stringfilter', invDt.filterValue, invDt.filterCondition);
                            filterGroupDt.addfilter(1, filterDt);
                            $("#tblDataInventory").jqxGrid('addfilter', invDt.filterColumn, filterGroupDt);
                        });
                        $("#tblDataInventory").jqxGrid('applyfilters');
                    }

                    var inventoryClmn = JSON.parse(localStorage.getItem("dColumns"));
                    if (inventoryClmn === null || typeof inventoryClmn === "undefined") return;
                    inventoryClmn.forEach(function (ic) {
                        var chked = ic.showHide;
                        $("#tblDataInventory").jqxGrid('beginupdate');
                        if (chked) {
                            $("#tblDataInventory").jqxGrid('showcolumn', ic.name);
                            $("#" + ic.id).closest("label").addClass("active");
                        } else {
                            $("#tblDataInventory").jqxGrid('hidecolumn', ic.name);
                            $("#" + ic.id).closest("label").removeClass("active");
                        }
                        $("#tblDataInventory").jqxGrid('endupdate');
                    });
                    $('#tblDataInventory').jqxGrid('autoresizecolumns');
                });
                */
                $("#tblDataInventory").jqxGrid(
                    {
                        width: "100%",
                        height: 550,
                        source: dataAdapter,
                        showfilterrow: true,
                        filterable: true,
                        columnsautoresize: true,
                        columnsresize: true,
                        columnsreorder: true,
                        pageable: true,
                        pagesizeoptions: ['15', '30', '50'],
                        pagermode: 'simple',
                        sortable: true,
                        autorowheight: true,
                        autoheight: true,
                        altrows: true,
                        scrollmode: 'logical',
                        rendered: function (type) {
                            if (type === "full") {
                                $('#tblDataInventory').jqxGrid({ pagesize: 50 });
                            }
                        },
                        columns: [
                            { text: "Sr#", datafield: "SrNo", width: 100 },
                            { text: "Object Name", datafield: "ObjectName", width: 200 },
                            { text: "Object Type", datafield: "ObjectType", width: 100 },
                            { text: "External Call", datafield: "ExternalCall", width: 150 },
                            { text: "Called From", datafield: "CalledFrom", width: 150 },
                            { text: "Uses Entities", datafield: "UsesEntities", width: 150 },
                            { text: "Object Description / Long Description", datafield: "ObjectDescription", width: 260 },
                            { text: "Tags", datafield: "Tags", width: 150 }
                        ]
                    });
                // $body.removeClass("loading");
                $('#tblDataInventory').jqxGrid('refresh');
            }
        }
    });
}

function showHideColumnDataInventory(ctrl) {
    // var ctrlId = $(ctrl)[0].id;
    var value = $(ctrl)[0].value;
    $("#tblDataInventory").jqxGrid('beginupdate');
    if ($(ctrl)[0].checked) {
        $("#tblDataInventory").jqxGrid('showcolumn', value);
    } else {
        $("#tblDataInventory").jqxGrid('hidecolumn', value);
    }
    // $("#tblViewInventory").jqxGrid('autoresizecolumns');
    $("#tblDataInventory").jqxGrid('endupdate');
    dColumns.push({
        name: value,
        id: $(ctrl).attr("id"),
        showHide: $(ctrl)[0].checked
    });
    localStorage.setItem("dColumns", JSON.stringify(dColumns));
}

var deleteOpt = false;
var reload = "";
function showData(dvCtrl) {
    deleteOpt = false;
    reload = "";
    $("#dvData")[0].innerHTML = dvCtrl.innerHTML;
    var ctrlId = dvCtrl.id;
    var selectedrowindex = $('#tblViewInventory').jqxGrid('selectedrowindex');
    var objectName = $('#tblViewInventory').jqxGrid('getcelltext', selectedrowindex, "ObjectName");
    var objName = $(objectName).text();
    if (selectedrowindex === -1 && objectName === null) {
        selectedrowindex = $('#tblDataInventory').jqxGrid('selectedrowindex');
        objectName = $('#tblDataInventory').jqxGrid('getcelltext', selectedrowindex, "ObjectName");
        objName = objectName;
    }
    var oName = "<span style='color:#555ed3'>" + objName + "</span>";
    if (ctrlId.startsWith("dvObjects_")) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Object(s) for object " + oName;
    }
    if (ctrlId.startsWith("dvUploadedDocs_")) {
        $("#ViewDataHeader")[0].innerHTML = "Document(s) Uploaded for object " + oName;
    }
    if (ctrlId.startsWith("dvReports_")) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Report(s) for object " + oName;
    }
    if (ctrlId.startsWith("dvQuery_")) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Query(ies) for object " + oName;
    }
    if (ctrlId.startsWith("dvDataDepend_")) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Entity(ies) for object " + oName;
    }
    if (ctrlId.startsWith("dvPartInWork_")) {
        $("#dvData").find('li').each(function () {
            var that = $(this);
            $(this).find("a").each(function() {
                var plainText = $(this).html();
                console.log(plainText);
                $(this).remove();
                that.html(plainText);
            });
        });
        $("#ViewDataHeader")[0].innerHTML = "Participates In Workflow(s) for object " + oName;
    }
    if (ctrlId.startsWith("calledFrom")) {
        $("#ViewDataHeader")[0].innerHTML = "Called From for object " + oName;
    }
    if (ctrlId.startsWith("dvCExternal_")) {
        $("#ViewDataHeader")[0].innerHTML = "External Call(s) for object " + oName;
    }
    if (ctrlId.startsWith("dataInventoryDesc_")) {
        $("#ViewDataHeader")[0].innerHTML = "Statements in List for " + $(objectName).html();
        $("#dvData").find('a').each(function () {
            $(this).css("color", "black");
        });
    }
    if (ctrlId.startsWith("iDescptCalledFrom_")) {
        $("#ViewDataHeader")[0].innerHTML = "Called From for " + $(objectName).html();
    }
    if (ctrlId.startsWith("iDescptUsedEntities_")) {
        // var name = $(dvCtrl).find("a").html();
        $("#ViewDataHeader")[0].innerHTML = "Uses Entity(ies) for " + $(objectName).html();
    }
    if (ctrlId.startsWith("entityCalledFrom_")) {
        $("#ViewDataHeader")[0].innerHTML = "Called From for " + $(objectName).html();
    }
    if (ctrlId.startsWith("iDescptCalledExternal_")) {
        $("#ViewDataHeader")[0].innerHTML = "External Call(s) for " + $(objectName).html();
    }
    if (ctrlId.startsWith("dvTags_")) {
        $("#ViewDataHeader")[0].innerHTML = "Tag(s) for " + $(objectName).html();
    }
    // Log this action...
    var desc = $("#ViewDataHeader").html();
    var audit = {
        postData: {
            OptionUsed: "Inventory Details",
            PrimaryScreen: "Inventory Details",
            UserId: userId,
            ProjectId: projectId,
            BriefDescription: "Viewed: <b>" + desc + "</b>"
        }
    };
    $.fn.auditActionLog(audit).then(function (d) {
        console.log(d);
        $("#viewData").modal("show");
        $('#tblViewInventory').jqxGrid('selectrow', -1);
        $('#tblDataInventory').jqxGrid('selectrow', -1);
    }).catch(function (e) {
        console.log(e);
    });

    return false;

    /*
    if (ctrlId.match(/^dvObjects_/)) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Object(s)";
    }
    if (ctrlId.match(/^dvReports_/)) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Report(s)";
    }
    if (ctrlId.match(/^dvQuery_/)) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Query(ies)";
    }
    if (ctrlId.match(/^dvDataDepend_/)) {
        $("#ViewDataHeader")[0].innerHTML = "Uses Entity(ies)";
    }
    if (ctrlId.match(/^dvPartInWork_/)) {
        $("#ViewDataHeader")[0].innerHTML = "Participates In Workflow(s)";
    }
    if (ctrlId.match(/^calledFrom/)) {
        $("#ViewDataHeader")[0].innerHTML = "Called From";
    }
    */
}

function showIDespt(dvCtrl) {
    var element = document.getElementById(dvCtrl);
    $("#dvIDescriptorData")[0].innerHTML = element.innerHTML;

    var divHeader = element.lang;
    var oName = "<span style='color:#555ed3'>" + divHeader + "</span>";
    $("#ViewIDescriptorDataHeader")[0].innerHTML = "Statements in List for Entity - I-Desc " + oName;
    $("#viewIDescriptorData").modal("show");
}

function showEntitySchema(ctrl) {
    var entName = ctrl.title;
    jQuery.ajax({
        type: "GET",
        url: baseAddress +
            "ViewDataBaseSchema/GetEntitySchema?projectId=" + projectId + "&entityName=" + entName,
        success: function (dataBaseSchema) {
            $.each(dataBaseSchema, function (i, r) {
                dataBaseSchema[i].RowId = ++i;
            });
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: "RowId", type: "int" },
                    { name: "EntityName", type: "string" },
                    { name: "FieldName", type: "string" },
                    { name: "Length", type: "string" },
                    { name: "DataType", type: "string" },
                    { name: "Description", type: "string" },
                    { name: "FieldNo", type: "string" }
                ],
                pagesize: 50,
                localdata: dataBaseSchema
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $body.addClass("loading");
            $("#divDatabaseSchema").jqxGrid(
                {
                    width: "100%",
                    height: 550,
                    source: dataAdapter,
                    columnsautoresize: true,
                    columnsresize: true,
                    pageable: true,
                    pagesizeoptions: ['15', '30', '50'],
                    pagermode: 'simple',
                    sortable: true,
                    altrows: true,
                    scrollmode: 'logical',
                    rendered: function (type) {
                        if (type === "full") {
                            $('#divDatabaseSchema').jqxGrid({ pagesize: 50 });
                        }
                    },
                    columns: [
                        { text: "Sr#", datafield: "RowId", width: "5%" },
                        { text: "Entity Name", datafield: "EntityName", width: "15%" },
                        { text: "Attribute Number", datafield: "FieldNo", width: "15%" },
                        { text: "Attribute Name", datafield: "FieldName", width: "15%" },
                        { text: "Length", datafield: "Length", width: "12%" },
                        { text: "Data Type", datafield: "DataType", width: "15%" },
                        { text: "Description", datafield: "Description", width: "23%" }
                    ]
                });
            $("#viewEntitySchema").modal("show");
            return false;
        }
    });
    // Log this action...
    // var desc = $("#ViewDataHeader").html();
    var audit = {
        postData: {
            OptionUsed: "Inventory Details",
            PrimaryScreen: "Inventory Details",
            UserId: userId,
            ProjectId: projectId,
            BriefDescription: "Viewed Database Schema for Entity: <b>" + entName + "</b>"
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function openLink(dvCtrl) {
    var parentWin = window.opener;
    var thisDiv = $(dvCtrl)[0];
    var url = thisDiv.innerHTML.replace(/&amp;/g, '&');
    if (parentWin) {
        parentWin.location.href = url;
    } else {
        open(url, '_blank');
    }
}

function downloadInventory() {
    var skipSame = document.getElementById("chkSkipSameInventory").checked;
    var businessName = document.getElementById("chkBusinessSameInventory").checked;
    jQuery.ajax({
        url: baseAddress + "FileObjectMethodReference/ExportInventoryToExcel?projectId=" + parseInt(projectId) + "&skipSame=" + skipSame + "&businessName=" + businessName,
        type: "GET",
        contentType: "application/xlsx; charset=utf-8",
        headers: "Content-Type: application/xlsx",
        success: function (data) {
            downloadFile(data);
        }
    });
    // Log this action...
    var audit = {
        postData: {
            OptionUsed: "Inventory Details",
            PrimaryScreen: "Inventory Details",
            UserId: userId,
            ProjectId: projectId,
            BriefDescription: "Downloaded Objects and Data Inventory"
        }
    };
    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
        console.log(e);
    });
}

function downloadFile(path) {
    var element = document.getElementById("a123456");
    element.href = path;
    element.target = "_blank";
    window.open(path, "_self");
}

function drawInventory(data, tableName) {
    for (var i = 0; i < data.length; i++) {
        drawInventoryRow(data[i], tableName, i + 1);
    }
}

function drawInventoryRow(rowData, tableName, srNo) {
    var row = $("<tr />");
    $("#" + tableName).append(row);
    row.append($("<td>" + srNo + "</td>"));
    row.append($("<td>" + rowData.ObjectName + "</td>"));
    row.append($("<td>" + rowData.ParicipateInWorkflow + "</td>"));
    row.append($("<td>" + rowData.UsesObjects + "</td>"));
    row.append($("<td>" + rowData.UsesReports + "</td>"));
    row.append($("<td>" + rowData.UsesQueries + "</td>"));
    row.append($("<td>" + rowData.UsesEntities + "</td>"));
    row.append($("<td>" + rowData.Description + "</td>"));
    row.append($("<td>" + rowData.ExtenstionType + "</td>"));
    row.append($("<td>" + rowData.Loc + "</td>"));
}

function includeStateDialog(fileId) {
    $("#ViewSourceInputBody").hide();
    document.getElementById("subRoutineprogramId").value = fileId;
    var hitHighlighter = new Hilitor("ViewSourceInputBody");
    hitHighlighter.setMatchType("left");
    $("#ViewSourceInputModal_SearchButton").off();
    $("#ViewSourceInputModal_SearchBox").off();
    $("#ViewSourceInputModal_SearchPrev").off();
    $("#ViewSourceInputModal_SearchNext").off();
    $("#ViewSourceInputModal_SearchBox").val("");
    $("#ViewSourceInputModal_SearchNav").hide();
    $("#ViewSourceInputModal_SearchHitCount").text("");

    $("#ViewSourceInputModal_SearchButton").click(function () {
        hitHighlighter.remove();
        var keywords = $("#ViewSourceInputModal_SearchBox").val();
        var words = keywords.split(",").sort(function (a, b) {
            return b.length - a.length;
        });
        var hitCount = 0;
        $.each(words, function () {
            hitHighlighter.apply(this);
            hitCount += hitHighlighter.hitCount;
        });

        if (hitCount === 0) {
            $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
        } else {
            $("#ViewSourceInputModal_SearchNav").show();
            $("#ViewSourceInputModal_SearchHitCount").text(hitCount + (hitCount === 1 ? " match" : " matches"));
        }
    });

    $("#ViewSourceInputModal_SearchBox").keypress(function (e) {
        if (e.keyCode === 13) {
            hitHighlighter.apply($("#ViewSourceInputModal_SearchBox").val());
            if (hitHighlighter.hitCount === 0) {
                $("#ViewSourceInputModal_SearchHitCount").text("no matches found");
            } else {
                $("#ViewSourceInputModal_SearchNav").show();
                $("#ViewSourceInputModal_SearchHitCount").text(hitHighlighter.hitCount + (hitHighlighter.hitCount === 1 ? " match" : " matches"));
            }
        }
    });

    $("#ViewSourceInputModal_SearchPrev").click(function () {
        hitHighlighter.prevHit();
    });

    $("#ViewSourceInputModal_SearchNext").click(function () {
        hitHighlighter.nextHit();
    });

    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        var pId = getParameterByName("prjId");
        jQuery.ajax({
            url: baseAddress + "WorkspaceWorkflow/GetViewSourceData?projectId=" + pId + "&fileId=" + fileId,
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                if (tData != null) {
                    document.getElementById("treeViewSource").innerHTML = tData.SourceData;
                    $("#ViewSourceInputBody").show();
                    $("#viewSourceDialog").modal("show");

                    // Log this action...
                    var audit = {
                        postData: {
                            OptionUsed: "Object Details from Inventory",
                            PrimaryScreen: "Object Details from Inventory",
                            UserId: userId,
                            ProjectId: pId,
                            BriefDescription: "Inventory Object: <b>" + tData.FileMaster.FileName + "</ b>"
                        }
                    };
                    $.fn.auditActionLog(audit).then(function (d) { console.log(d); }).catch(function (e) {
                        console.log(e);
                    });
                }
            }
        });
    }
}

function funFilesPopup(fileId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "FileObjectMethodReference/ViewInventoryFile?fileId=" + fileId,
        success: function (data) {
            if (data !== null) {
                $('#dvBindFiles').html(data);
            }
            $("#dvShowFiles").modal("show");
        }
    });
}

function funActionWorkFlowsPopup(actionWorkflowId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "FileObjectMethodReference/ViewInventoryActionWorkFlows?actionId=" + actionWorkflowId,
        success: function (data) {
            if (data !== null) {
                $('#dvBindFiles').html(data);
            }
            $("#dvShowFiles").modal("show");
        }
    });
}

function exportViewSourceFile() {
    var fileId = document.getElementById("subRoutineprogramId").value;
    if (fileId !== 0) {
        $.ajaxSetup({
            async: true
        });
        jQuery.ajax({
            type: "GET",
            url: baseAddress + "WorkspaceWorkflow/DownLoadSubRoutineViewSource?fileId=" + fileId,
            contentType: "text/plain;charset=utf-8",
            success: function (data) {
                if (data !== null) {
                    downloadTextFile(data[0], data[1]);
                }
            }
        });
    }
}

function downloadTextFile(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getTableHeaderProperties(tblModel) {
    var tblColumns = tblModel._columns;
    var headerDetails = {};
    var headerFields = [];
    var headersText = [];
    for (var k = 0; k < tblColumns.length; k++) {
        headerFields.push(tblColumns[k].datafield);
        headersText.push(tblColumns[k].text);
    }
    headerDetails["HeaderFields"] = headerFields;
    headerDetails["HeadersText"] = headersText;
    return headerDetails;
}

function exportGrid(tableName) {
    // var selectedProjectList = $("#ddlSelectProject").find("option:selected").text();
    // var selectedProjectList = window.localStorage.getItem("selectedProjectText");
    var tblName = "#" + tableName.id;
    var gridObj = $(tblName).data("jqxGrid");
    var headerDetails = getTableHeaderProperties(gridObj.instance);
    var rows = gridObj.instance.source.records;
    var tblData = $("#tblData");
    $("#tblData").html("");
    var headerRow = $("<tr />");
    for (var k = 0; k < headerDetails.HeadersText.length; k++) {
        if (headerDetails.HeadersText[k] !== "Action" && headerDetails.HeadersText[k] !== "Statements") {
            var cell = $("<td>" + headerDetails.HeadersText[k] + "</td>");
            headerRow.append(cell);
        }
    }

    tblData.append(headerRow);
    for (var i = 0; i < rows.length; i++) {
        var dataRow = $("<tr />");
        for (var j = 0; j < headerDetails.HeaderFields.length; j++) {
            var field = headerDetails.HeaderFields[j];
            var fieldName = rows[i][field];
            if (typeof fieldName !== 'undefined' && fieldName !== "") {
                var dataCell = $("<td>" + fieldName + "</td>");
                dataRow.append(dataCell);
            }
        }
        tblData.append(dataRow);
    }
    $("#tblData").excelExport({ type: 'excel', escape: 'false', htmlContent: 'true', fileName: "SearchResults.xls" });
    $("#tblData").html("");
}

// var selectedDiv = null;
function addTags(programId, type) {
    // var programId = ctrl.title;
    var tagInput = document.getElementById("txtTag");
    tagInput.removeAttribute("disabled");
    document.getElementById("hdnProgramId").value = programId;
    document.getElementById("hdnType").value = type;
    document.getElementById("tdEmpError12").innerHTML = "";
    // selectedDiv = ctrl;
    $('#txtTag').removeAttr("disabled");
    $("#dvAddTags").modal("show");
}

function getTagCategoryMaster() {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTags",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var localData = [];
            localData.push({
                TagsMasterId: "0",
                TagName: "Select Tag"
            });
            if (result !== null && typeof result !== "undefined") {
                result.forEach(function (t) {
                    localData.push(t);
                });
                var dataSource =
                {
                    datatype: "json",
                    datafields: [
                        { name: "TagsMasterId", type: "integer" },
                        { name: "TagName", type: "string" }
                    ],
                    localdata: localData
                };
                var dataAdapter = new $.jqx.dataAdapter(dataSource);
                $("#ddlTags").jqxDropDownList({
                    selectedIndex: 0,
                    source: dataAdapter,
                    displayMember: "TagName",
                    valueMember: "TagsMasterId",
                    width: 200,
                    height: 25
                });
                $("#ddlTags").val("0");
                $('#ddlTags').on('change', function (event) {
                    var args = event.args;
                    var tagId = args.item.value;
                    if (parseInt(tagId) !== 0 &&
                        $("#ddlTagCategories").val() === "0" &&
                        $("#ddlTagCategoryValues").val() === "0") {
                        var tagInput = document.getElementById("txtTag");
                        tagInput.removeAttribute("disabled");
                        $('#txtTag').removeAttr("disabled");
                    }
                    fillTagCategories(tagId);
                });
            }
        }
    });
}

var fillTagCategories = function (tagId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagCategory?tagId=" + tagId,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var localData = [];
            localData.push({
                TagCategoryMasterId: "0",
                TagCategoryName: "Select Category"
            });
            if (result !== null && typeof result !== "undefined") {
                result.forEach(function (tag) {
                    localData.push(tag);
                });
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: "TagCategoryMasterId", type: "integer" },
                        { name: "TagCategoryName", type: "string" }
                    ],
                    localdata: localData
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#ddlTagCategories").jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "TagCategoryName",
                    valueMember: "TagCategoryMasterId",
                    width: 200,
                    height: 24
                });
                $("#ddlTagCategories").val("0");
                $('#ddlTagCategories').on('change', function (event) {
                    var args = event.args;
                    var categoryId = args.item.value;
                    if (categoryId === 0) {
                        document.getElementById("txtTag").disabled = false;
                    } else {
                        document.getElementById("txtTag").disabled = true;
                    }
                    // $("#txtTag").attr("disabled", "disabled");
                    fillTagCategoryValues(categoryId);
                });
            }
        }
    });
};

var fillTagCategoryValues = function (categoryId) {
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagsMaster/GetAllTagsValues?categoryId=" + categoryId,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var localData = [];
            localData.push({
                TagCategoryValuesId: "0",
                TagCategoryValue: "Select Value"
            });
            data.forEach(function (d) {
                d.TagCategoryName = d.TagCategoryMaster.TagCategoryName;
            });
            data.forEach(function (r) {
                localData.push(r);
            });
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: "TagCategoryValuesId", type: "integer" },
                    { name: "TagCategoryValue", type: "string" }
                ],
                localdata: localData
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#ddlTagCategoryValues").jqxDropDownList({
                source: dataAdapter,
                displayMember: "TagCategoryValue",
                valueMember: "TagCategoryValuesId",
                width: 200,
                height: 24
            });
            $("#ddlTagCategoryValues").val("0");
        }
    });
};

var deleteTag = function (ctrl) {
    var tagId = ctrl.title;
    var opt = ctrl.lang;
    if (opt === "data-inventory" || opt === "project-inventory") deleteOpt = true;
    reload = opt;
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "TagMaster/DeleteTag?tagId=" + tagId,
        success: function (result) {
            console.log(result);
            $(ctrl).closest("tr").remove();
        }
    });
};

$("#viewData").on('hidden.bs.modal', function (e) {
    if (deleteOpt) {
        if (reload === "data-inventory") {
            bindDataInventory();
        } else {
            callSkipSame();
        }
    }
});

var addNewTag = function (e) {
    var error = document.getElementById("tdEmpError12");
    if ($("#ddlTags").val() === "0") {
        error.innerHTML = "Please select Tag";
        $("#ddlTags").focus();
        $("#ddlTags").css("border-color", "red");
        $("#ddlTags").on("keypress", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    if ($("#ddlTagCategories").val() !== "0" && $("#ddlTagCategoryValues").val() === "0") {
        error.innerHTML = "Please select Tag Category Value";
        $("#ddlTagCategoryValues").focus();
        $("#ddlTagCategoryValues").css("border-color", "red");
        $("#ddlTagCategoryValues").on("change", function () {
            $(this).css("border-color", "");
        });
        return false;
    }
    var tagName = "";
    tagName += ($("#ddlTagCategoryValues").val() === "0" || $("#ddlTagCategoryValues").val() === "Please Choose")
        ? "" : $("#ddlTagCategoryValues").text();
    tagName += ($("#ddlTagCategories").val() === "0" || $("#ddlTagCategories").val() === "Please Choose")
        ? "" : " (" + $("#ddlTagCategories").text() + ")";

    tagName = tagName === "Please Choose" ? "" : tagName;
    if (tagName !== "") { tagName = tagName + "(" + $("#ddlTags").text() + ")"; }
    else { tagName = $("#txtTag").val() === "" ? tagName : $("#txtTag").val() + " (" + $("#ddlTags").text() + ")"; }
    var programId = document.getElementById("hdnProgramId").value;
    var type = parseInt(document.getElementById("hdnType").value);
    var itemSource = {
        ProjectId: parseInt(projectId),
        TagName: tagName, // $("#txtTag").val(),
        programId: type === 1 ? programId : 0,
        TagsMasterId: $("#ddlTags").val(),
        TagCategoryId: $("#ddlTagCategories").val(),
        TagCategoryValuesId: $("#ddlTagCategoryValues").val(),
        DataInventoryId: type === 2 ? programId : 0,
        UserId: parseInt(userId)
    };
    jQuery.ajax({
        type: "POST",
        url: baseAddress + "WorkspaceWorkflow/AddTagMaster",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(itemSource),
        success: function (result) {
            if (result !== null) {
                error.innerHTML = "Tag Name added successfully";
                error.style.color = "green";
                $("#txtTag").val("");
                $("#ddlTags").val("0");
                $("#ddlTagCategories").val("0");
                $("#ddlTagCategoryValues").val("0");
                $('#dvAddTags').modal("hide");
                if (type === 1) {
                    // callSkipSame();
                    location.reload();
                } else {
                    // bindDataInventory();
                    location.reload();
                }
            }
        }
    });
};

$(document).ready(function () {
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val();
        if (value === "") return;
        removeHighlighting($("tblViewInventory div em"));
        var viewInventory = $("#tblViewInventory span");
        var allBoldSpans = viewInventory.find("span");
        allBoldSpans.each(function (i) {
            var row = $(this);
            addHighlighting(row, value);
        });

    });

    $("#btnAddTag").click(addNewTag);

    $("#ddlTagCategories").jqxDropDownList({
        source: [{
            TagCategoryMasterId: "0",
            TagCategoryName: "Select Category"
        }],
        width: 200,
        height: 24,
        displayMember: "TagCategoryName",
        valueMember: "TagCategoryMasterId"
    });

    $("#ddlTagCategoryValues").jqxDropDownList({
        source: [{
            TagCategoryValuesId: "0",
            TagCategoryValue: "Select Value"
        }],
        width: 200,
        height: 24,
        displayMember: "TagCategoryValue",
        valueMember: "TagCategoryValuesId"
    });

    getTagCategoryMaster();
});

$('#dvAddTags').on('hidden.bs.modal', function (e) {
    // console.log(e);
    var tagInput = document.getElementById("txtTag");
    tagInput.removeAttribute("disabled");
    $('#txtTag').removeAttr("disabled");
    $("#txtTag").val("");
    $("#ddlTags").val("0");
    $("#ddlTagCategories").val("0");
    $("#ddlTagCategoryValues").val("0");
});