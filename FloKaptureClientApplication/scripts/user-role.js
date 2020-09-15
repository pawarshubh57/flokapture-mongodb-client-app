// Please prefere this way of defining the module...
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["userRole"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require(jQuery));
    } else {
        root.userRole = factory(jQuery);
    }
}(typeof window !== "undefined" ? window : this, function ($) {
    "use strict";
    var baseAddress = $.fn.baseAddress();
    var UserRole = function () {

    };

    UserRole.prototype.getAll = async function () {
        var url = baseAddress + "RoleMaster/Get";
        return await this._ajaxRequest("GET", null, url).then(function (d) { return d; }).catch(function (e) { console.log(e); });
    };

    UserRole.prototype.getRoleDetails = function (roleId) {
        var url = `${baseAddress}RoleMaster/GetRoleDetails?roleId=${roleId}`;
        return new Promise((resolve, reject) => {
            this._ajaxRequest("GET", null, url).then(function (role) {
                resolve(role);
            }).catch(function (e) { reject(e); });
        });
    };

    UserRole.prototype.getMenuHierarchy = async function () {
        var url = baseAddress + "RoleMaster/GetMenuHierarchy";
        var menuHierarchy = await this._ajaxRequest("GET", null, url);
        return menuHierarchy;
    };

    UserRole.prototype.getRoleMenuHierarchy = async function (roleId) {
        var url = baseAddress + "RoleMaster/GetRoleMenuHierarchy?roleId=" + roleId;
        var menuHierarchy = await this._ajaxRequest("GET", null, url);
        return menuHierarchy;
    };

    UserRole.prototype.addRole = async function addRole(roleDetails) {
        var url = baseAddress + "RoleMaster/AddNewRoleAndRoleWiseMenu";
        var response = await this._ajaxRequest("POST", roleDetails, url);
        return response;
    };

    UserRole.prototype.updateRoleDetails = async function (roleDetails, roleId) {
        var url = baseAddress + "RoleMaster/UpdateRoleDetails?roleId=" + roleId;
        var response = await this._ajaxRequest("POST", roleDetails, url);
        return response;
    };

    UserRole.prototype._ajaxRequest = async function (type, data, url) {
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

    UserRole.prototype.getTabMenu = async function() {
        var url = baseAddress + "TabMaster/GetAllTab";
        var response = await this._ajaxRequest("GET", "", url);
        return response;
    };

    UserRole.prototype.getTabDetails = function(roleId) {
        var url = `${baseAddress}TabMaster/GetTabDetails?roleId=${roleId}`;
        return new Promise((resolve, reject) => {
            this._ajaxRequest("GET", null, url).then(function(role) {
                resolve(role);
            }).catch(function (e) { $("#tdAssociatedTabs").html(""); reject(e); });
        });
    };
    UserRole.prototype.getTabMenuHierarchy = async function (roleId) {
        var url = baseAddress + "TabMaster/EditTabs?roleId=" + roleId;
        var menuHierarchy = await this._ajaxRequest("GET", null, url);
        return menuHierarchy;
    };
    return new UserRole();
}));