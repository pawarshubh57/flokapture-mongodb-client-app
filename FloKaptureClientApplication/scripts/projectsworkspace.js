var baseAddress = $.fn.baseAddress();
var userId = window.localStorage.getItem("userId");
var projectId = getParameterByName("pid");
var pageNumber = window.localStorage.getItem("gridPageNumber") || 1;
var projectIdList = window.localStorage.getItem("projectIds");
var mainDataForVba = window.localStorage.getItem("mainDataForVba");
var childDataForVba = window.localStorage.getItem("childDataForVba");
var searchKeyWord = window.localStorage.getItem("searchKeyWord");
var mainData = null; // window.localStorage.getItem("mainData");
var projectName = window.localStorage.getItem("projectName");
var prajId = window.localStorage.getItem("projectId");
var languageId = window.localStorage.getItem("languageId");

$.fn.getUserProjectDetails(projectId);

var $body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); },
    ajaxError: function () { $body.removeClass("loading"); }
});

$(document).ready(function () {
    /*
    const finalMeunBar = window.localStorage.getItem("userRoleMenu");
    $("#mainnav-menu").html(finalMeunBar);
    const uName = window.localStorage.getItem("uName");
    document.getElementById("userName").innerHTML = uName;*/
});

$(document).ready(function() {
    getProjectName();
    $("#li_1").hover(function () {
        const firstTab = "Discovered Workflows for Project: " + projectName;
        $(this).css("cursor", "pointer").attr('title', firstTab);

    }, function () {
        $(this).css("cursor", "auto");
    });

    $("#li_2").hover(function () {
        var secondTab = "Project Dashboard: " + projectName;
        $(this).css("cursor", "pointer").attr("title", secondTab);

    }, function () {
        $(this).css('cursor', 'auto');
    });

    $("#li_1").click(function () {
        var firstTab = `Discovered Workflows for Project: ${projectName}`;
        $("#projectName")[0].innerHTML = firstTab;
    });

    $("#li_2").click(function () {
        var secondTab = "Project Dashboard: " + projectName;
        $("#projectName")[0].innerHTML = secondTab;
    });
});


$(document).ready(function() {

    /*
    window.localStorage.setItem("projectId", projectId);
    if (prajId === projectId) {
        var mainData = window.localStorage.getItem("mainData");
        if (typeof mainData !== "undefined" && mainData !== null && mainData !== "null")
            loadDataLocalStorage();
        else
            loadDataWithProjectIds(projectId);
    } else {
        loadDataWithProjectIds(projectId);
    }
    */
    loadDataForGraph(projectId);
});


var getProjectName = function() {
    var firstTab = "Discovered Workflows for Project: " + projectName;
    $("#projectName")[0].innerHTML = firstTab;
};

var loadDataLocalStorage = function() {
    var mainDataForVba = window.localStorage.getItem("mainDataForVba");
    var childDataForVba = window.localStorage.getItem("childDataForVba");
    var mainData = window.localStorage.getItem("mainData");
    var projectName = window.localStorage.getItem("projectName");
    $("#txtSearchGrid").val(searchKeyWord);
    if (typeof mainDataForVba !== 'undefined' && mainDataForVba !== "null" && mainDataForVba !== null) {
        var gridDes = $("#tblEntryPoints").data("ejGrid");
        if (typeof gridDes !== 'undefined' && gridDes !== null)
            gridDes.destroy();
        if (typeof searchKeyWord !== 'undefined' && searchKeyWord !== null) {
            var mainDataVba = JSON.parse(mainDataForVba);
            var childData = JSON.parse(childDataForVba);
            var firstTab = $("#tabTitle").val();
            $("#projectName")[0].innerHTML = firstTab + " " + projectName;
            //$("#projectName")[0].innerHTML = "Project: " + projectName;
            $("#pName")[0].innerHTML = projectName;
            $("#tblEntryPoints").ejGrid({
                width: "99%",
                dataSource: mainDataVba,
                allowPaging: true,
                pageSettings: { pageSize: 20 },
                showHeader: false,
                allowSorting: true,
                allowResizing: true,
                allowResizeToFit: true,
                columns: [
                    { field: "ActionWorkFlowName", headerText: "OriginObject", width: "85%" },
                    { field: "ActionId", visible: false, headerText: "Id" }
                ],
                create: "create",
                rowSelected: function(args) {
                    document.getElementById("hdnActionWkId").value = args.data.ActionId;
                    if (args.target[0].className === "btn btn-mint btn-icon icon-lg fa fa-upload") {
                        var actionWflowId = args.data.ActionId;
                        var wflowName = args.data.OriginObject;
                        document.getElementById("hdnActionWkId").value = actionWflowId;
                        // document.getElementById("hdnOriginObject").value = wflowName;
                        uploadFilePopupShow(wflowName, actionWflowId);
                    }
                    if (args.target[0].className === "btn btn-primary btn-icon icon-lg fa fa-download") {
                        var actionWflowId1 = args.data.ActionId;
                        downloadRequirementDoc(actionWflowId1);
                    }
                },
                queryCellInfo: function(args) {
                    $($(args.cell).parent()).css("color", "#000000").css('font-weight', 'bold');
                },
                childGrid: {
                    dataSource: childData,
                    queryString: "RowId",
                    allowScrolling: true,
                    scrollSettings: { height: 400, frozenRows: 0 },
                    allowResizing: true,
                    allowSorting: true,
                    allowResizeToFit: true,
                    columns: [
                        {
                            field: "ProjectId",
                            headerText: "ProjectId",
                            visible: false,
                            template: "<span>{{:ProjectId}}</span>"
                        },
                        { field: "TechnicalAndBusinessName", headerText: "Name", width: "60%" },
                        //{ field: "ExtrernalCalls", headerText: "External<br /> Calls?", width: "9%" },
                        //{ field: "InternalCalls", headerText: "Internal<br /> Calls?", width: "9%" },
                        //{ field: "DecisionCount", headerText: "MCC", width: "6%" },
                        { field: "View", headerText: "Action", width: "32%", textAlign: ej.TextAlign.Center },
                        { field: "Disable", headerText: "Disable", width: "6%", textAlign: ej.TextAlign.Center },
                        { field: "IsDeleted", headerText: "IsDeleted", width: "0%" }
                    ],
                    rowSelected: function(args) {
                        var value = args.target[0].innerHTML;
                        var actionWorkFlowId = args.data.ActionWorkflows.ActionWorkflowId;
                        if (value === "Rename") {
                            document.getElementById("hdnActionWkId").value = actionWorkFlowId;
                            var workflowName = args.data.WorkflowName;
                            // $('#txtCurrentWorkflowName').text(workflowName);
                            //$("#dvWorkflowRename").modal("show");
                            funWorkflowRename(workflowName, actionWorkFlowId);
                        }
                    },

                    queryCellInfo: function(args) {
                        var value = args.text.replace(",", "");
                        switch (args.column.headerText) {
                        case "IsDeleted":
                            if (parseFloat(value) <= 0) {
                                $($(args.cell).parent()).css("color", "#000000");
                            } else {

                                $($(args.cell).parent()).css("color", "#d0d0d0");
                            }
                            break;
                        }
                    }
                }
            });
        }
        var gridObj = $("#tblEntryPoints").data("ejGrid");
        gridObj.refreshContent(); // Refreshes the grid contents only
        gridObj.refreshContent(true); // Refreshes the template and grid contents
    } else if (typeof mainData !== 'undefined' && mainData !== null && mainData !== "null") {
        var mData = JSON.parse(mainData);
        var fTab = $("#tabTitle").val();
        $("#projectName")[0].innerHTML = fTab + " " + projectName;
        $("#tblEntryPoints").ejGrid({
            width: "80%",
            dataSource: mData,
            allowPaging: true,
            allowScrolling: true,
            allowSorting: true,
            scrollSettings: { height: 500, frozenRows: 0 },
            pageSettings: { pageSize: 20 },
            allowResizing: true,
            allowResizeToFit: true,
            columns: [
                { field: "SrNo", headerText: "Sr#", width: "3%" },
                {
                    field: "ProjectId",
                    headerText: "ProjectId",
                    visible: false,
                    template: "<span>{{:ProjectId}}</span>"
                },
                { field: "OriginObject", headerText: "Name", width: "36%" },
                // { field: "WorkflowName", headerText: "Technical Starting Point", width: "22%" },
                //{ dataField: "ObjectType", text: "Object Type", width: "9%" },
                //{ field: "ExtrernalCalls", headerText: "External<br /> Calls?", width: "6%" },
                //{ field: "InternalCalls", headerText: "Internal<br/> Calls?", width: "6%" },
                //{ field: "DecisionCount", headerText: "MCC", width: "4%" },
                { field: "View", headerText: "Action", width: "32%", textAlign: ej.TextAlign.Center },
                // { field: "Disable", headerText: "Disable", width: "8%", textAlign: ej.TextAlign.Center, visible: false,},
                { field: "IsDeleted", headerText: "IsDeleted", width: "0%" }
            ],
            rowSelected: function(args) {
                var value = args.target[0].innerHTML;
                var actionWflowId = args.data.ActionWorkflows.ActionWorkflowId;
                var wflowName = args.data.OriginObject;
                document.getElementById("hdnActionWkId").value = actionWflowId;
                document.getElementById("hdnOriginObject").value = wflowName;
                if (value === "Rename") {
                    document.getElementById("hdnActionWkId").value = args.data.ActionWorkflows.ActionWorkflowId;
                    var workflowName = args.data.OriginObject;
                    //$("#dvWorkflowRename").modal("show");
                    funWorkflowRename(workflowName, actionWflowId);
                } else if (args.target[0].className === "btn btn-mint btn-icon icon-lg fa fa-upload") {
                    uploadFilePopupShow(wflowName, actionWflowId);
                } else if (args.target[0].className === "btn btn-primary btn-icon icon-lg fa fa-download") {
                    downloadRequirementDoc(actionWflowId);
                }
            },
            queryCellInfo: function(args) {
                var value = args.text.replace(",", "");
                switch (args.column.headerText) {
                case "IsDeleted":
                    if (parseFloat(value) <= 0) {
                        $($(args.cell).parent()).css("color", "#000000");
                    } else {
                        $($(args.cell).parent()).css("color", "#d0d0d0");
                    }
                    break;
                }
            }
        });
    } else {
        var projectId = getParameterByName("pid");
        loadDataWithProjectIds(projectId);
    }
};

function loadDataWithProjectIds(projectId) {
    var searchKeyWord = $("#txtSearchGrid").val();
    window.localStorage.setItem("searchKeyWord", searchKeyWord);
    if (languageId === 5) {
        $("#li_4").css("display", "inline");
        $("#li_1").css("display", "none");
        $("#tblSecondTab").css("display", "none");
        $("#revisedTreeMenu").css('display', "block");
        $("#demo-tabs2-box-1").addClass("tab-pane fade in");
        $("#treeTab").addClass("tab-pane fade in active");
    } else {
        $("#li_4").css("display", "none");
        $("#li_1").css("display", "inline");
        $("#tblSecondTab").css("display", "inline");
        $("#revisedTreeMenu").css('display', "none");
        $("#li_1").addClass("active");
        $("#li_4").removeClass("active");
        $("#demo-tabs2-box-1").addClass("tab-pane fade in active");
        $("#treeTab").addClass("tab-pane fade in");
    }
}


$(document).ready(function () {
    $("#searchMenuItems").click(async function () {
        var searchKey = $("#txtSearchMenu").val();
        initializeMenuGrid(searchKey);
    });

    initializeMenuGrid("");
});




function loadDataForGraph(projectId) {
    // Get all ticker counts for selected project...
    $body.addClass("loading");
    jQuery.ajax({
        type: "GET",
        url: baseAddress + "WorkspaceWorkflow/GetProjectTickersCount?projectId=" + projectId,
        success: function (tickerCount) {
            if (tickerCount !== null) {
                var t = tickerCount;
                $("#pClassesScreens")[0].innerHTML = t.NoOfClsses;
                $("#pNoOfPackgesLines")[0].innerHTML = t.NoOfLines;
                $("#pNoOfActionWorkflows")[0].innerHTML = t.NoOfWorkflows;  
                $("#pNoOfEntities")[0].innerHTML = t.NoOfEntities + " / " + t.NoOfAttributes;
                $("#cntBusinessFunctions")[0].innerHTML = t.NoOfBusinessFuns === 0 ? "0" : t.NoOfBusinessFuns;
                $("#pNoOfTags")[0].innerHTML = t.NoOfTags === 0 ? "0" : t.NoOfTags;
                $("#pNoOfAnnotation")[0].innerHTML = t.NoOfAnnotation === 0 ? "0" : t.NoOfAnnotation;
                $("#pNoOfDeactivated")[0].innerHTML = t.NoOfDeavtivate === 0 ? "0" : t.NoOfDeavtivate;

                $body.removeClass("loading");
            }
        }
    });

    // file chart
    $.get(baseAddress + "ProjectMaster/GetApplicationPieChart?projectId=" + projectId + "&opt=opt", function (data) {
     // ReSharper disable once QualifiedExpressionMaybeNull
        if (data !== null && data.Charts !== null) {
            $.plot($("#demo-flot-donutProject"), data.Charts, {
                series: {
                    pie: {
                        show: true
                    }
                },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 0,
                        y: 0
                    },
                    defaultTheme: true
                }
            });
            var dtTable = data.Charts;
            window.Morris.Bar({
                element: 'demo-morris-barProject',
                data: dtTable,
                xkey: 'label',
                ykeys: ['data'],
                labels: ["Count "],
                gridEnabled: false,
                gridLineColor: 'transparent',
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable.length; i++) {
                        if (dtTable[i].label !== row.label) {
                            continue;
                        } else {
                            clr = dtTable[i].color;
                        }
                    }
                    return clr;
                },
                resize: true,
                hideHover: 'auto'
            });
        }
    });
    
    $.get(baseAddress + "ProjectMaster/GetApplicationLOCChart?projectId=" + projectId + "&opt=opt", function (data2) {
        if (data2 !== null && data2.Charts !== null) {
            var dtTable1 = data2.Charts;
            window.Morris.Bar({
                element: 'demo-morris-barLocProject',
                data: dtTable1,
                xkey: 'label',
                ykeys: ['data'],
                labels: ['Lines of Code (LoC)'],
                gridEnabled: false,
                gridLineColor: 'transparent',
                barColors: function (row) {
                    var clr = "";
                    for (var i = 0; i < dtTable1.length; i++) {
                        if (dtTable1[i].label !== row.label) {
                            continue;
                        } else {
                            clr = dtTable1[i].color;
                        }
                    }
                    return clr;
                },
                resize: true,
                hideHover: 'auto'
            });
            // funLocPerByPackage(data);
            $.plot($("#demo-flot-donutProjectLoc"), data2.Charts, {
                series: {
                    pie: {
                        show: true
                    }
                },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                    shifts: {
                        x: 0,
                        y: 0
                    },
                    defaultTheme: true
                }
            });
        }
    });

    $.get(baseAddress + "ProjectMaster/GetAllDashBoardCoverage?projectId=" + projectId + "", function (data) {
        if (data !== null) {
            var sampleData = [];
            if (data.Charts.length === 0) return false;
            var workflows = data.Charts[0].data;
            for (var i = 1; i < data.Charts.length; i++) {
                sampleData.push(data.Charts[i]);
            }
            var settings = {
                title: "Workflow(s) summary",
                description: "Total Workflows: " + workflows,
                showLegend: true,
                enableAnimations: true,
                padding: { left: 1, top: 1, right: 1, bottom: 1 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: sampleData,
                xAxis:
                {
                    unitInterval: 1,
                    dataField: 'label',
                    gridLines: { visible: true },
                    flip: false
                },
                valueAxis:
                {
                    unitInterval: workflows / 10,
                    minValue: 0,
                    maxValue: workflows,
                    flip: true,
                    labels: {
                        visible: false
                    }
                },
                colorScheme: 'scheme01',
                seriesGroups:
                [
                    {
                        type: 'column',
                        orientation: 'horizontal',
                        columnsGapPercent: 50,
                        toolTipFormatSettings: { thousandsSeparator: ',' },
                        series: [
                            { dataField: 'data', displayText: 'Percentage(%)' }
                        ]
                    }
                ]
            };
            // setup the chart
            $('#barAppCoverage').jqxChart(settings);
        }
    });
}


// -------------------------------------- Revised Menu Starts -----------------------------------

var downloadRevisedInventory = async function (fileMenuId, menu) {
    var revisedMenu = new RevisedMenu();
    await revisedMenu.invertoryMenu(fileMenuId, menu);
};

var downloadReqDoc = function (aId) {
    var revisedMenu = new RevisedMenu();
    revisedMenu.downloadReqDoc(aId);
}

var displayWizard = function (actionExecuted) {
    var revisedMenu = new RevisedMenu();
    revisedMenu.customImpact(actionExecuted);
};

var RevisedMenu = function () {
    this.id = 0;
    this.ajax = window.axios.create({
        baseURL: $.fn.baseAddress()
    });
    this.bootBox = window.bootbox;

    this.setId = function (data) {
        data.forEach((menu) => {
            menu.Id = `${++this.id}`;
        });
    };

    this.prepareParentChild = function (data) {
        data.forEach((menu) => {
            // menu.Id = `${++this.id}`;
            menu.Html = this.createHtml(menu);
            menu.ParentId = "-1";
        });
        var mainData = data;
        return mainData;
    };

    this.createHtml = function (m) {
        var objectType = this.getObjectType(m);
        m.MenuId = m.MenuId ? m.MenuId.trim() : "None";
        m.MenuTitle = m.MenuTitle ? m.MenuTitle.trim() : "None";
        var html = "";
        if (m.MenuId) html += m.MenuId;
        if (m.MenuTitle) html += ` | ${objectType} | ${m.MenuTitle}`;
        return html;
    };
};

RevisedMenu.prototype = {
    getBaseMenuData: async function (searchKey) {
        var key = searchKey || "";
        var endPoint = "WorkspaceWorkflow/GetMenuFile?projectId=" + projectId + "&keyword=" + key;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach(function (n) {
                var action = n.ActionExecuted ? n.ActionExecuted.trim().split(" ")[0] : "123$123";
                if (action === "") action = "123$123";
                var inventoryUrl = "downloadRevisedInventory('" + n.FileMenuId + "',true)";
                n.FileMenuId = loopCnt + n.FileMenuId;
                n.ObjectType = 'Menu';
                var pUrl = "displayWizard('" + action + "')";
                n.Actions = "<a data-action=" + action + " onclick=" + pUrl + " style='cursor: pointer;' title='Download impacts document'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>Download</button> </a>";
                n.Actions += "&nbsp; <a data-action=" + action + " onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                if (n.ActionExecuted === "FileObject")
                    n.dataObject = "data-Object";
                else
                    n.dataObject = "menu-Object";
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuFileById: async function (expandedRecord) {
        var fileMenuId = expandedRecord.FileMenuId.split("_")[1];
        var endPoint = `WorkspaceWorkflow/GetMenuFileById?projectId=${projectId}&fileMenuId=${parseInt(fileMenuId)}`;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach(function (n) {
                var menuId = n.MenuLevel;
                n.FileMenuId = loopCnt + n.FileMenuId;
                n.ObjectType = n.LevelNumber === 9998
                    ? "JCL"
                    : n.LevelNumber === 9999
                    ? "Missing"
                    : n.LevelNumber === 0
                    ? " - "
                    : "Menu";
                if (n.ActionExecuted === "FileObject")
                    n.dataObject = "data-Object";
                else
                    n.dataObject = "action-Object";

                if (n.ObjectType === "JCL" || n.ObjectType === "jcl") {
                    var pUrl = `openWin('customview.html?prjId=${n.ProjectId}&fileId=${menuId}');`;
                    var inventoryUrl = "downloadRevisedInventory('" + menuId + "',false)";
                    n.Actions = "<a onclick=" + pUrl +
                        " style='cursor: pointer;' title='Object explorer view'><button  style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                    n.Actions += "&nbsp; <a  href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    n.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        n.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                }
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuByActionExecuted: async function (menuObject) {
        var actionExecuted = menuObject.ActionExecuted;
        var fileMenuId = menuObject.FileMenuId.split("_")[1];
        var endPoint =
            `WorkspaceWorkflow/GetMenuByActionExecuted?projectId=${projectId}&actionExecuted=${actionExecuted
                }&fileMenuId=${parseInt(fileMenuId)}`;
        return await this.ajax.get(endPoint).then((actions) => {
            var actData = actions.data;
            this.setId(actData);
            var loopCnt = "fileMenuId_";
            actData.forEach((m) => {
                var menuId = m.FileMenuId;
                if (m.ActionExecuted === "FileObject") {
                    m.dataObject = "data-Object";
                    var pUrl = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${m.FileMenuId}');`;
                    var inventoryUrl = "downloadRevisedInventory('" + m.FileMenuId + "',false)";
                    m.Actions = "<a onclick=" +
                        pUrl + " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";

                    m.Actions += "&nbsp; <a  &nbsp; href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        m.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                } else
                    m.dataObject = "action-Object";
                m.FileMenuId = loopCnt + m.FileMenuId;
                m.ObjectType = this.getObjectType(m);
                if (m.ObjectType === "JCL" || m.ObjectType === "jcl") {
                    var inventoryUrl12 = "downloadRevisedInventory('" + menuId + "',false)";
                    var pUrl12 = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${menuId}');`;
                    m.Actions = "<a onclick=" +
                        pUrl12 +
                        " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                    m.Actions += "&nbsp; <a  &nbsp; href='#' onclick=" + inventoryUrl12 + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                    m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                        m.Id +
                        ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                }
                m.MenuId = m.MenuId.replace(/.pgm|.sbr|.jcl|.icd|.JCL/g, "");
            });
            var mainData = this.prepareParentChild(actData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getMenuForObject: async function (expRecord) {
        var fileId = expRecord.FileMenuId.split("_")[1];
        var endPoint = "WorkspaceWorkflow/GetMenuForObject?projectId=" + projectId + "&objectId=" + fileId;
        return await this.ajax.get(endPoint).then((d) => {
            var menuData = d.data;
            this.setId(menuData);
            var loopCnt = "fileMenuId_";
            menuData.forEach((m) => {
                var pUrl = `openWin('customview.html?prjId=${m.ProjectId}&fileId=${m.FileMenuId}');`;
                var inventoryUrl = "downloadRevisedInventory('" + m.FileMenuId + "',false)";
                m.Actions = "<a onclick=" +
                    pUrl +
                    " style='cursor: pointer;' title='Object explorer view'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-mint'>View</button> </a>";
                m.Actions += "&nbsp; <a href='#' onclick=" + inventoryUrl + " style='cursor: pointer;' title='Download Inventory'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-success'>Inventory</button> </a>";
                m.Actions += "&nbsp;<a href='#' onclick='showObjConnectivity(" +
                    m.Id +
                    ");' title='Download object connectivity'><button style='padding: 5px 12px; font-size: 12px;' class='btn btn-primary'>Connectivity</button></a>";
                m.MenuTitle = m.MenuLevel;
                m.FileMenuId = loopCnt + m.FileMenuId;
                m.ObjectType = this.getObjectType(m);
                m.MenuId = m.MenuId.replace(/.pgm|.sbr|.jcl|.icd|.JCL/g, "");
                if (m.LevelNumber === 9999) m.Actions = "";
            });
            var mainData = this.prepareParentChild(menuData);
            return mainData;
        }).catch(() => {
            return [];
        });
    },

    getObjectType: function (m) {
        var objectType = "";
        if (m.MenuId.endsWith(".pgm")) objectType = "Program";
        if (m.MenuId.endsWith(".sbr")) objectType = "Subroutine";
        if (m.MenuId.endsWith(".jcl")) objectType = "JCL";
        if (m.MenuId.endsWith(".icd")) objectType = "Include";
        if (objectType === "")
            objectType = m.LevelNumber === 9997
                ? "Menu"
                : m.LevelNumber === 9998
                ? "JCL"
                : m.LevelNumber === 9999
                ? "Missing"
                : "-";
        return objectType;
    },

    downloadReqDoc: function (aId) {
        console.log(aId);
    },

    downloadFile: (path) => {
        if (typeof path === "undefined") {
            return false;
        }
        var element = document.createElement("a");
        element.href = path;
        element.target = "_blank";
        element.click();
        document.removeElement(element);
        return true;
    },

    getNodeColor: function (m) {
        var nodeColor = { color: "#ffcc00", shape: "Ellipse" }
        if (m.ObjectType === "Program") nodeColor = { color: "#FFF78C", shape: "RoundRect" }
        if (m.ObjectType === "Subroutine") nodeColor = { color: "#66ab8c", shape: "RoundRect" }
        if (m.ObjectType === "JCL") nodeColor = { color: "#6ec4db", shape: "RoundRect" }
        if (m.ObjectType === "Include") nodeColor = { color: "#7d5ba6", shape: "RoundRect" }
        return nodeColor;
    },

    prepareNodes: function (menuId, nodes) {
        var row = $("#revisedTreeMenu").jqxTreeGrid('getRow', menuId);
        var node = this.getNodeColor(row);
        nodes.push({
            Id: row.Id,
            Width: "150px",
            Name: row.MenuTitle,
            ShapeId: node.shape,
            Color: node.color
        });
        var parent = row.parent;
        if (parent) return this.prepareNodes(parent.Id, nodes);
        else return nodes;
    },

    prepareLinks: function (nodes, links) {
        for (var i = 1; i < nodes.length; i++) {
            links.push({
                Origin: nodes[i - 1].Id,
                Target: nodes[i].Id,
                LinkText: ""
            });
        }
        return links;
    },

    invertoryMenu: async function (fileMenuId, menu) {
       
        $body.addClass("loading");
        var endPoint = baseAddress + "WorkspaceWorkflow/GetFileIdsForMenuInventory?projectId=" + projectId + "&fileMenuId=" + fileMenuId + "&menuType=" + menu;
        await this.ajax.get(endPoint).then((res) => {
            var path = res.data;
            this.downloadFile(path);
            $body.removeClass("loading");
        }).catch((e) => {
            $body.removeClass("loading");
        });
    },
    customImpact: function (actionExecuted) {
        actionExecuted = actionExecuted || "";
        var jclAction = actionExecuted.trim();
        if (jclAction === "") return;
        var jclName = jclAction.split(" ")[0];
        var endPoint = "CustomRequirment/GetJclObjects?projectId=" + projectId + "&jclName=" + jclName;
        this.ajax.get(endPoint).then((jclData) => {
            this.fillJclObjects(jclData.data);
            var options = {
                contentWidth: 850,
                contentHeight: 450,
                showCancel: false,
                progressBarCurrent: true
            };
            var wizard = $("#revised-menu-wizard").wizard(options);
            wizard.show();
            var _self = this;
            wizard.on('incrementCard', function () {
                var currentCard = this.getActiveCard();
                if (currentCard.alreadyVisited()) return;

                var cardName = currentCard.name;
                // console.log(cardName);
                _self.fillObjects(cardName);
            });
            wizard.on('decrementCard', function () {
                // console.log(this.getActiveCard());
            });
            wizard.on('submit', function (w) {
                w.submitSuccess();
                w.hideButtons();
                w.updateProgressBar(0);
            });
        }).catch((err) => {
            this.bootBox.alert("There is no JCL file associated with this Menu!");
            console.log(err);
        });
    },

    fillObjects: function (cardName) {
        if (cardName === "Programs") {
            var items = $("#listSelectedJclObject").jqxListBox('getItems');
            var jclFile = [];
            items.forEach(function (item) {
                jclFile.push(item.value);
            });
            var fileIds = jclFile.join(",");
            var endPoint = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + fileIds;
            this.ajax.get(endPoint).then((res) => {
                var fileMaster = res.data;
                this.fillProgramObjects(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillProgramObjects(empty);
            });
        } else if (cardName === "Subroutines" /* || cardName === "Includes" */) {
            var pItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
            var pFile = [];
            pItems.forEach(function (item) {
                pFile.push(item.value);
            });
            var pFileIds = pFile.join(",");
            var endPoint1 = "CustomRequirment/GetProgramObjects?projectId=" + projectId + "&fileIds=" + pFileIds;
            this.ajax.get(endPoint1).then((res) => {
                var fileMaster = res.data;
                this.fillSubroutinesAndIncludes(fileMaster);
            }).catch((err) => {
                var empty = [];
                this.fillSubroutinesAndIncludes(empty);
            });
        } else if (cardName === "Summary") {
            this.generateSummary();
        } else if (cardName === "Download") {
            this.generateImpactDocument();
        }
    },

    fillJclObjects: function (jcls) {
        $("#listJclObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: jcls,
            checkboxes: true,
            height: 200
        });

        $("#listSelectedJclObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    fillProgramObjects: function (programs) {
        $("#listProgramsObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: programs,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedProgramsObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    fillSubroutinesAndIncludes: function (result) {
        var subRoutines = result.filter(function (element) {
            return element.FileTypeExtensionId === 17;
        });
        $("#listSubroutinesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: subRoutines,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedSubroutinesObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });

        var includes = result.filter(function (element) {
            return element.FileTypeExtensionId === 12;
        });
        $("#listIncludesObjects").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: includes,
            checkboxes: true,
            height: 200
        });
        $("#listSelectedIncludesObject").jqxListBox({
            displayMember: 'FileName',
            valueMember: 'FileId',
            width: 200,
            source: [],
            checkboxes: true,
            height: 200
        });
    },

    generateSummary: function () {
        $("#tblSummary").html('');
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();
        /* Jcl Object */
        var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
        var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
        var chkJclSource = document.getElementById("chkSourceJCL").checked;
        var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
        var jFileName = [];
        $.each(jclItems, function (i, item) {
            jFileName.push(item.label);
        });
        var jclOjbectDet = {
            "Object Name": jFileName,
            "Entity Schema": chkJclDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkJclPseudo === true ? "Yes" : "No",
            "Source Code": chkJclSource === true ? "Yes" : "No"
        };
        /* Program Object */
        var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
        var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
        var chkPrgSource = document.getElementById("chkSourceProg").checked;
        var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
        var pFileName = [];
        $.each(programItems, function (i, item) {
            pFileName.push(item.label);
        });
        var programOjbectDet = {
            "Object Name": pFileName,
            "Entity Schema": chkPrgDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkPrgPseudo === true ? "Yes" : "No",
            "Source Code": chkPrgSource === true ? "Yes" : "No"
        };
        /* SubRoutine Object */
        var chkSubDbAct = document.getElementById("chkDBActSub").checked;
        var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
        var chkSubSource = document.getElementById("chkSourceSub").checked;
        var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
        var sFileName = [];
        $.each(subRoutineItems, function (i, item) {
            sFileName.push(item.label);
        });
        var subRoutineOjbectDet = {
            "Object Name": sFileName,
            "Entity Schema": chkSubDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkSubPseudo === true ? "Yes" : "No",
            "Source Code": chkSubSource === true ? "Yes" : "No"
        };
        /* Include Object */
        var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
        var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
        var chkIncludeSource = document.getElementById("chkSourceInc").checked;
        var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
        var iFileName = [];
        $.each(includeItems, function (i, item) {
            iFileName.push(item.label);
        });
        var includeOjbectDet = {
            "Object Name": iFileName,
            "Entity Schema": chkIncludeDbAct === true ? "Yes" : "No",
            "Pseudo Code": chkIncludePseudo === true ? "Yes" : "No",
            "Source Code": chkIncludeSource === true ? "Yes" : "No"
        };
        var customRequirmentDocDetails = {
            Title: title,
            Description: description,
            /*
                "Entity Objects": entityOjbectDet,
                "I-Descriptors": iDescptOjbectDet,
            */
            "JCL Objects": jclOjbectDet,
            "Program Objects": programOjbectDet,
            "Sub-Routine Objects": subRoutineOjbectDet,
            "Include Objects": includeOjbectDet
        };
        var html = "";
        html += "<tr><td>Title</td><td>" + customRequirmentDocDetails["Title"] + "</td></tr>";
        html += "<tr><td>Description</td><td>" + customRequirmentDocDetails["Description"] + "</td></tr>";
        $.each(customRequirmentDocDetails, function (i, item) {
            if (typeof item === "object")
                html += drawSummaryRow(i, item);
        });
        $("#tblSummary").append(html);
    },

    generateImpactDocument: function () {
        var title = $("#txtTitle").val();
        var description = $("#txtDescription").val();
        
        var entityOjbectDet = {
            ObjDetailsLst: [], 
            EntitySchema: false, 
            SourceCode: false
        };
        /* IDescriptor */
        var iDescriptorOjbectDet = {
            ObjDetailsLst: [], 
            EntitySchema: false,
            PseudoCode: false,
            SourceCode: false
        };

        /* Jcl Object */
        var jclObject = [];
        var chkJclDbAct = document.getElementById("chkDBActJCl").checked;
        var chkJclPseudo = document.getElementById("chkPseudoJcl").checked;
        var chkJclSource = document.getElementById("chkSourceJCL").checked;
        var jclItems = $("#listSelectedJclObject").jqxListBox('getItems');
        $.each(jclItems, function (i, item) {
            jclObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 10
            });
        });
        var jclOjbectDet = {
            ObjDetailsLst: jclObject,
            EntitySchema: chkJclDbAct,
            PseudoCode: chkJclPseudo,
            SourceCode: chkJclSource
        };
        /* Program Object */
        var programObject = [];
        var chkPrgDbAct = document.getElementById("chkDBActProg").checked;
        var chkPrgPseudo = document.getElementById("chkPseudoProg").checked;
        var chkPrgSource = document.getElementById("chkSourceProg").checked;
        var programItems = $("#listSelectedProgramsObject").jqxListBox('getItems');
        $.each(programItems, function (i, item) {
            programObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 9
            });
        });
        var programOjbectDet = {
            ObjDetailsLst: programObject,
            EntitySchema: chkPrgDbAct,
            PseudoCode: chkPrgPseudo,
            SourceCode: chkPrgSource
        };
        /* SubRoutine Object */
        var subRoutineObject = [];
        var chkSubDbAct = document.getElementById("chkDBActSub").checked;
        var chkSubPseudo = document.getElementById("chkPseudoSub").checked;
        var chkSubSource = document.getElementById("chkSourceSub").checked;
        var subRoutineItems = $("#listSelectedSubroutinesObject").jqxListBox('getItems');
        $.each(subRoutineItems, function (i, item) {
            subRoutineObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 17
            });
        });
        var subRoutineOjbectDet = {
            ObjDetailsLst: subRoutineObject,
            EntitySchema: chkSubDbAct,
            PseudoCode: chkSubPseudo,
            SourceCode: chkSubSource
        };
        /* Include Object */
        var includeObject = [];
        var chkIncludeDbAct = document.getElementById("chkDBActInc").checked;
        var chkIncludePseudo = document.getElementById("chkPseudoInc").checked;
        var chkIncludeSource = document.getElementById("chkSourceInc").checked;
        var includeItems = $("#listSelectedIncludesObject").jqxListBox('getItems');
        $.each(includeItems, function (i, item) {
            includeObject.push({
                FileName: item.label,
                FileId: item.value,
                FileTypeExtenstionId: 17
            });
        });
        var includeOjbectDet = {
            ObjDetailsLst: includeObject,
            EntitySchema: chkIncludeDbAct,
            PseudoCode: chkIncludePseudo,
            SourceCode: chkIncludeSource
        };
        var customRequirmentDocDetails = {
            ProjectId: projectId,
            Title: title,
            Description: description,
            EntityObject: entityOjbectDet,
            DescriptorObject: iDescriptorOjbectDet,
            JclObject: jclOjbectDet,
            ProgramObject: programOjbectDet,
            SubRoutineObject: subRoutineOjbectDet,
            IncludeObject: includeOjbectDet
        };
        document.getElementById("tdError123").innerHTML = "Please wait... Generating custom impacts document...";
        document.getElementById("tdError123").style.color = "green";
        var endPoint = "ExportWordDocument/GenerateCustomReqDocument";
        this.ajax.post(endPoint, customRequirmentDocDetails).then((res) => {
            document.getElementById("hdnDownloadPath").value = res.data;
            document.getElementById("tdError123").innerHTML = "Custom Impacts Complete. Click Download to view / save the document.";
            document.getElementById("tdError123").style.color = "green";
            document.getElementById("btnDownload").disabled = false;
        }).catch((e) => {
            document.getElementById("tdError123").innerHTML = "Something went wrong, please try again.";
            document.getElementById("tdError123").style.color = "red";
        });
    }
};

//-------------------------------Custom Impact --------------------------------------//
$(document).ready(function () {
    $("#btnIncludeJcl").click(function () {
        $('#listSelectedJclObject').jqxListBox('refresh');
        var items = $("#listJclObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('addItem',
                {
                    label: item.originalItem.FileName,
                    value: item.originalItem.FileId
                });
        }); return false;
    });

    $("#btnRemoveJcl").click(function () {
        var items = $("#listSelectedJclObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedJclObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludePrograms").click(function () {
        $('#listSelectedProgramsObject').jqxListBox('refresh');
        var items = $("#listProgramsObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedProgramsObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemovePrograms").click(function () {
        var items = $("#listSelectedProgramsObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedProgramsObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnIncludeSubroutines").click(function () {
        $('#listSelectedSubroutinesObject').jqxListBox('refresh');
        var items = $("#listSubroutinesObjects").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('addItem',
                    { label: item.originalItem.FileName, value: item.originalItem.FileId });
            }); return false;
    });

    $("#btnRemoveSubroutines").click(function () {
        var items = $("#listSelectedSubroutinesObject").jqxListBox('getCheckedItems');
        $.each(items,
            function (i, item) {
                $("#listSelectedSubroutinesObject").jqxListBox('removeItem', item);
            }); return false;
    });

    $("#btnIncludeIncludes").click(function () {
        $('#listSelectedIncludesObject').jqxListBox('refresh');
        var items = $("#listIncludesObjects").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('addItem', { label: item.originalItem.FileName, value: item.originalItem.FileId });
        }); return false;
    });

    $("#btnRemoveIncludes").click(function () {
        var items = $("#listSelectedIncludesObject").jqxListBox('getCheckedItems');
        $.each(items, function (i, item) {
            $("#listSelectedIncludesObject").jqxListBox('removeItem', item);
        }); return false;
    });

    $("#btnDownload").click(function () {
        var dPath = document.getElementById("hdnDownloadPath").value;
        window.open(dPath, "_self");
        setTimeout(function () {
            window.location.reload(true);
        }, 2500);
    });
});

var drawSummaryRow = function (enities, cObject) {
    var html = "";
    html += "<tr>";
    html += "<td>" + enities + "</td>";
    html += "<td><table style='width: 100%;' class='table-bordered table-striped table table-hover'>";
    html += "<tr>";
    var entString = "";
    for (var k = 0; k <= cObject["Object Name"].length - 1; k++) {
        entString += cObject["Object Name"][k] + ", ";
    }
    entString = entString.trim();
    var lastChar = entString.slice(-1);
    if (lastChar === ',') {
        entString = entString.slice(0, -1);
    };
    html += "<td style='width: 23%;'>Objects</td><td>" + entString + "</td></tr>";
    var entitySchema = cObject["Entity Schema"];
    if (entitySchema)
        html += "<tr><td>Entity Schema</td><td>" + entitySchema + "</td></tr> ";
    var pseudoCode = cObject["Pseudo Code"];
    if (pseudoCode)
        html += "<tr><td>Pseudo Code</td><td>" + pseudoCode + "</td></tr> ";
    var sourceCode = cObject["Source Code"];
    if (sourceCode)
        html += "<tr><td>Source Code</td><td>" + sourceCode + "</td></tr> ";

    html += "</td></table>";
    return html;
};

// ------------------------ Connectivity Diagram --------------------------//

var showObjConnectivity = function (menuId) {
    var revisedMenu = new RevisedMenu();
    var nodes = [];
    revisedMenu.prepareNodes(menuId, nodes);
    var reversedNodes = nodes.reverse();
    var links = [];
    revisedMenu.prepareLinks(reversedNodes, links);
    var diaLegends = [];

    diaLegends.push({});
    $("#div-revised-tree-dia").modal("show");
    $("#div-revised-tree-diagram").html("");
    var diagram = new DiagramUtility("#div-revised-tree-diagram", {
        width: 5000,
        height: 360,
        backBrush: "#FFFFFF",
        gridLines: true,
        nodes: nodes,
        links: links,
        legends: [{ title: "Starting Point", bgColor: "#ffcc00" }, { title: "JCL", bgColor: "#6ec4db" }, { title: "Program", bgColor: "#FFF78C" },
            { title: "Subroutine", bgColor: "#66ab8c" }, { title: "Include", bgColor: "#7d5ba6" }]
    });
    diagram.setTitle("Objects Connectivity");
};

// ---------------------------------- Tree Grid --------------------------------//
var initializeMenuGrid = function (searchKey) {
    var revisedMenu = new RevisedMenu();
    var key = searchKey || "";
    $("#revisedTreeMenu").jqxTreeGrid(
        {
            width: "100%",
            height: "700px",
            sortable: true,
            columnsResize: true,
            altRows: true,
            pageSize: 20,
            pageSizeOptions: ['15', '20', '30'],
            pageable: true,
            pagerPosition: 'both',
            pagerMode: "advanced",
            pageSizeMode: "root",
            virtualModeCreateRecords: async function (expandedRecord, done) {
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'ParentId' }, { name: "MenuTitle" }, { name: "Html" }, { name: "Id" }, { name: "ActionExecuted" }, { name: "FileMenuId" },
                        { name: "MenuId" }, { name: "MenuDescription" }, { name: "MenuLevel" }, { name: "LevelNumber" }, { name: "WorkflowMenuName" },
                        { name: "ProjectId" }, { name: "ObjectType" }, { name: "dataObject" }, { name: "Actions" }
                    ],
                    id: 'Id',
                    localData: await (async function (expRecord) {
                        if (expRecord === null) {
                            return await revisedMenu.getBaseMenuData(key);
                        } else if (expRecord && expRecord.dataObject === "menu-Object") {
                            return await revisedMenu.getMenuFileById(expRecord);
                        } else if (expRecord && expRecord.dataObject === "action-Object") {
                            return await revisedMenu.getMenuByActionExecuted(expRecord);
                        } else {
                            return await revisedMenu.getMenuForObject(expRecord);
                        }
                    })(expandedRecord)
                };
                var dataAdapter = new $.jqx.dataAdapter(source,
                    {
                        loadComplete: function () {
                            done(dataAdapter.records);
                        }
                    });
                dataAdapter.dataBind();
            },
            virtualModeRecordCreating: function (record) {
                record.rObject = record;
            },
            columns: [
                { text: 'Object Name', columnGroup: 'MenuId', dataField: 'MenuId', width: "25%" },
                { text: "Object Type", dataField: "ObjectType", width: "8%" },
                { text: 'Object Description', dataField: 'MenuTitle', width: "40%" },
                { text: "Actions", dataField: 'Actions', width: "27%" }
            ]
        });
};

// ----------------------------- Common function -------------------------- //
var openWin = function (link) {
    window.open(link, '', "width=" + screen.availWidth + ", height=" + screen.availHeight);
};
