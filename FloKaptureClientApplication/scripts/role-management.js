$(document).ready(function () {
    userRole.getAll().then(function (d) {
        var roleDetails = $("#roleDetails");
        roleDetails.html("");
        d.forEach(function (role) {
            var status = role.Status === true ? "Active" : "InActive";
            var headerRow = $("<tr />");
            headerRow.append($("<td />").append($("<label />").attr({ "class": "form-checkbox form-icon" })
                .append($("<input />").attr({ "type": "checkbox" }))));
            var roleType = $("<td />").attr({ "style": "cursor: pointer;", id: role.RoleId }).html(role.RoleType);
            roleType.on("click", function () {
                $("#divAdd").hide();
                $("#divView").show();
                $("#divEdit").hide(); 
                var id = $(this).attr("id");
                var roleId = parseInt(id);
                $("#hdnCurrentUserId").val(roleId);
                var roleName = $(this).html();
                $("#tdRoleName").html(roleName);
                $("#tdSelectedRoleName").html(roleName);
                userRole.getRoleDetails(roleId).then(function (roleData) {
                    $("#tdAssociatedMenu").html("");
                    $("#tdAssociatedMenu").html(roleData);
                }).catch(function (e) { console.log(e); });
                userRole.getTabDetails(roleId).then(function(tabData) {
                    $("#tdAssociatedTabs").html("");
                    $("#tdAssociatedTabs").html(tabData);
                }).catch(function(e) { console.log(e);  });
            });
            headerRow.append(roleType);
            headerRow.append($("<td />").append($("<span />").attr({ "class": "label label-table label-success" }).html(status)));
            roleDetails.append(headerRow);
        });

    }).catch(function (e) { console.log(e); });

    $("#btnCreateNewRole").click(function () {
        $("#divAdd").show();
        $("#divView").hide();
        $("#divEdit").hide(); 
        userRole.getMenuHierarchy().then(function (d) {
            var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" },
                        { name: "NodeId", type: "integer" },
                        { name: "MainMenuId", type: "integer" },
                        { name: "SubMenuId", type: "integer" },
                        { name: "MainMenuMaster", type: {} },
                        { name: "SubMenuMaster", type: {} }
                    ],
                    hierarchy:
                        {
                            keyDataField: { name: "GraphId" },
                            parentDataField: { name: "ParentId" }
                        },
                    id: "GraphId",
                    localdata: d
                };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#leftMenuItems").jqxTreeGrid(
                {
                    width: "100%",
                    checkboxes: true,
                    source: dataAdapter,
                    hierarchicalCheckboxes: true,
                    showHeader: false,
                    sortable: true,
                    columns: [
                        { text: "GraphName", dataField: "GraphName" }
                    ]
                });
        }).catch(function (e) { console.log(e); });

        userRole.getTabMenu().then(function (d) {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: "GraphId", type: "string" },
                    { name: "ParentId", type: "string" },
                    { name: "GraphName", type: "string" },
                    { name: "NodeId", type: "integer" },
                    { name: "TabId", type: "integer" }
                ],
                hierarchy:
                {
                    keyDataField: { name: "GraphId" },
                    parentDataField: { name: "ParentId" }
                },
                id: "GraphId",
                localdata: d
            };
            var dataAdapter1 = new $.jqx.dataAdapter(source);
            $("#tabMenuItems").jqxTreeGrid(
                {
                    width: "100%",
                    checkboxes: true,
                    source: dataAdapter1,
                    hierarchicalCheckboxes: true,
                    showHeader: false,
                    sortable: true,
                    columns: [
                        { text: "GraphName", dataField: "GraphName" }
                    ]
                });
        }).catch(function (e) { console.log(e); });
    });

    $("#btnSaveRole").click(function () {
        var checkedRows = $("#leftMenuItems").jqxTreeGrid("getCheckedRows");
        var allCheckTabs = $("#tabMenuItems").jqxTreeGrid("getCheckedRows");
        var menuMaster = {};
        var tabs = [];
        allCheckTabs.forEach(function(row) {
            tabs.push(row.TabId);
        });
        menuMaster.LstRoleWiseMenuMaster = [];
        menuMaster.RoleName = $("#txtRoleName").val();
        menuMaster.Tabs = tabs;
        checkedRows.forEach(function (row) {
            if (row.MainMenuId === -1 && row.SubMenuId === -1) return;
            menuMaster.LstRoleWiseMenuMaster.push({
                RoleId: 0,
                MainMenuId: row.MainMenuId,
                SubMenuId: row.SubMenuId
            });
        });
        userRole.addRole(menuMaster).then(function () {
            window.location.href = "roles_admin.html";
        }).catch(function (e) { console.log(e); });
        return false;
    });

    $("#btnEditRoleDetails").click(function (e) {
        e.preventDefault();
        var id = $("#hdnCurrentUserId").val();
        var roleId = parseInt(id);
        $("#divEdit").show(); $("#divView").hide(); $("#divAdd").hide();
        userRole.getRoleMenuHierarchy(roleId).then(function (d) {
            var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: "GraphId", type: "string" },
                        { name: "ParentId", type: "string" },
                        { name: "GraphName", type: "string" },
                        { name: "NodeId", type: "integer" },
                        { name: "MainMenuId", type: "integer" },
                        { name: "SubMenuId", type: "integer" },
                        { name: "MainMenuMaster", type: {} },
                        { name: "SubMenuMaster", type: {} }
                    ],
                    hierarchy:
                        {
                            keyDataField: { name: "GraphId" },
                            parentDataField: { name: "ParentId" }
                        },
                    id: "GraphId",
                    localdata: d
                };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#DvEditRoleDetails").jqxTreeGrid(
                {
                    width: "100%",
                    checkboxes: true,
                    source: dataAdapter,
                    hierarchicalCheckboxes: true,
                    showHeader: false,
                    sortable: true,
                    columns: [
                        { text: "GraphName", dataField: "GraphName" }
                    ]
                });
            d.forEach(function (rData) {
                if (!rData.IsChecked) return;
                var graphId = rData.GraphId;
                if (graphId.indexOf("mainMenu-") > -1) return;
                $("#DvEditRoleDetails").jqxTreeGrid("checkRow", graphId);
            });
        }).catch(function (err) { console.log(err); });
        userRole.getTabMenuHierarchy(roleId).then(function (d) {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: "GraphId", type: "string" },
                    { name: "ParentId", type: "string" },
                    { name: "GraphName", type: "string" },
                    { name: "NodeId", type: "integer" },
                    { name: "TabId", type: "integer" }
                ],
                hierarchy:
                {
                    keyDataField: { name: "GraphId" },
                    parentDataField: { name: "ParentId" }
                },
                id: "GraphId",
                localdata: d
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#DvEditTabDetails").jqxTreeGrid(
                {
                    width: "100%",
                    checkboxes: true,
                    source: dataAdapter,
                    hierarchicalCheckboxes: true,
                    showHeader: false,
                    sortable: true,
                    columns: [
                        { text: "GraphName", dataField: "GraphName" }
                    ]
                });
            d.forEach(function (rData) {
                if (!rData.IsChecked) return;
                var graphId = rData.GraphId;
                if (graphId.indexOf("mainMenu-") > -1) return;
                $("#DvEditTabDetails").jqxTreeGrid("checkRow", graphId);
            });
        }).catch(function (err) { console.log(err); });
    });

    $("#btnUpdateRoleDetails").click(function () {
        var checkedRows = $("#DvEditRoleDetails").jqxTreeGrid("getCheckedRows");
        var allCheckTabs = $("#DvEditTabDetails").jqxTreeGrid("getCheckedRows");
        var tabs = [];
        allCheckTabs.forEach(function (row) {
            tabs.push(row.TabId);
        });
        var id = $("#hdnCurrentUserId").val();
        var roleId = parseInt(id);
        var menuMaster = {};
        menuMaster.LstRoleWiseMenuMaster = [];
        menuMaster.RoleName = $("#tdSelectedRoleName").val();
        menuMaster.Tabs = tabs;
        checkedRows.forEach(function (row) {
            if (row.MainMenuId === -1 && row.SubMenuId === -1) return;
            menuMaster.LstRoleWiseMenuMaster.push({
                RoleId: 0,
                MainMenuId: row.MainMenuId,
                SubMenuId: row.SubMenuId
            });
        });
        userRole.updateRoleDetails(menuMaster, roleId).then(function () {
            window.location.href = "roles_admin.html";
        }).catch(function (e) { console.log(e); });
        return false;
    });
});