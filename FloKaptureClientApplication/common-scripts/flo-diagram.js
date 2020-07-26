var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var Shape = MindFusion.Diagramming.Shape;
var Rect = MindFusion.Drawing.Rect;
var LayeredLayout = MindFusion.Graphs.LayeredLayout;
var TreeLayout = MindFusion.Graphs.TreeLayout;
var TreeLayoutLinkType = MindFusion.Graphs.TreeLayoutLinkType;
var LayoutDirection = MindFusion.Graphs.LayoutDirection;
var FractalLayout = MindFusion.Graphs.FractalLayout;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var Reassign = MindFusion.Graphs.Anchoring.Reassign;
var treeviewObj;
var decision1In3Out, apat2;
var strWorkflowFor = "";
var clickedDefineFunction = "";
var diagram = null; // $.fn.floKaptureDiagram("diagram-workflow", false, "#FFFFFF");

(function ($) {

    $.fn.floKaptureDiagram = function (id, gridLines, backBrush) {
        var diagramCustom = $create(Diagram, null, null, null, $get(id)); // Diagram.find("diagram");
        diagramCustom.setShowGrid(gridLines);
        diagramCustom.setLinkHeadShapeSize(2);
        diagramCustom.setBackBrush(backBrush);
        diagramCustom.imageSmoothingEnabled = false;
        diagram = diagramCustom;
        return diagramCustom;
    };

    /*
    $.fn.floKaptureDiagram = function (id, gridLines, backBrush) {
        var diagram = $create(Diagram, null, null, null, $get(id)); // Diagram.find("diagram");
        diagram.setShowGrid(gridLines);
        diagram.setLinkHeadShapeSize(2);
        diagram.setBackBrush(backBrush);
        diagram.imageSmoothingEnabled = false;
        return diagram;
    }
    */

    this.zoomIn = function () {
        if (diagram.zoomFactor > 200) return;
        diagram.setZoomFactor(diagram.zoomFactor + 10);
    };

    this.zoomOut = function () {
        if (diagram.zoomFactor < 19) return;
        diagram.setZoomFactor(diagram.zoomFactor - 10);
    };

    this.resetZoom = function () {
        diagram.setZoomFactor(100);
    };

    this.treeLayout = function () {
        var treeLayout = new TreeLayout();
        treeLayout.linkType = TreeLayoutLinkType.Straight;
        treeLayout.nodeDistance = 6;
        treeLayout.levelDistance = 12;
        diagram.arrange(treeLayout);
    };

    this.leftToRight = function () {
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.LeftToRight;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        layout.anchoring = Reassign;
    };

    this.topToBottom = function () {
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        layout.anchoring = Reassign;
    };

    this.layeredLayout = function () {
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
    };

    this.fractalLayout = function () {
        var layout = new FractalLayout();
        layout.root = diagram.nodes[0];
        diagram.arrange(layout);
        fitFractalItems(diagram);
    };

    this.directRouting = function () {
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
    };

    this.orthogonalRouting = function () {
        var layout = new LayeredLayout();
        layout.direction = LayoutDirection.TopToBottom;
        layout.siftingRounds = 0;
        layout.nodeDistance = 6;
        layout.layerDistance = 12;
        diagram.arrange(layout);
        diagram.resizeToFitItems();
        diagram.routeAllLinks();
        this.topToBottom();
    };

    this.buildDiagram = function (lstNodes, lstLinks) {
        diagram.clearAll();
        var nodeMap = [];
        var nodes = lstNodes;
        Array.forEach(nodes,
            function (node) {
                var nodewidth = node.Width === null ? 55 : parseInt(node.Width / 2.2);
                var diagramNode = diagram.getFactory().createShapeNode(new Rect(10, 15, parseInt(nodewidth), 15));
                diagramNode.shadowOffsetX = 0;
                diagramNode.shadowOffsetY = 0;
                diagramNode.setStroke("Transparent");
                nodeMap[node.Id] = diagramNode;
                diagramNode.id = node.Id;
                diagramNode.width = node.Width;
                diagramNode.jsonId = node.Id;
                diagramNode.setText(node.Name);
                diagramNode.setShape(node.ShapeId);
                diagramNode.setBrush(node.Color);
                if (typeof node.ActionWorkflowId !== 'undefined' && node.ActionWorkflowId !== null)
                    diagramNode.actionWorkflowId = node.ActionWorkflowId;
                if (typeof node.ProgramId !== 'undefined' && node.ProgramId !== null)
                    diagramNode.programId = node.ProgramId;
                if (typeof node.GroupId !== 'undefined' && node.GroupId !== null)
                    diagramNode.groupId = node.GroupId;
                if (typeof node.GroupName !== 'undefined' && node.GroupName !== null)
                    diagramNode.groupName = node.GroupName;
                if (typeof node.StatementId !== 'undefined' && node.StatementId !== null)
                    diagramNode.statementId = node.StatementId;
                if (typeof node.ShapeId !== 'undefined' && node.ShapeId !== null)
                    diagramNode.shapeId = node.ShapeId;
                if (typeof node.Name !== 'undefined' && node.Name !== null)
                    diagramNode.nodeName = node.Name;
                if (typeof node.Color !== 'undefined' && node.Color !== null)
                    diagramNode.nodeColor = node.Color;
            });

        var links = lstLinks;
        Array.forEach(links, function (link) {
            var link1 = diagram.getFactory().createDiagramLink(nodeMap[link.Origin], nodeMap[link.Target]);
            if (typeof link.Origin !== 'undefined' && link.Origin !== null)
                link1.originId = link.Origin;
            if (typeof link.Target !== 'undefined' && link.Target !== null)
                link1.targetId = link.Target;
            if (typeof link.LinkText !== 'undefined' && link.LinkText !== null)
                link1.linkText = link.LinkText;
            if (typeof link.ProgramId !== 'undefined' && link.ProgramId !== null)
                link1.programId = link.ProgramId;
            if (typeof link.StatementId !== 'undefined' && link.StatementId !== null)
                link1.statementId = link.StatementId;
            if (typeof link.ActionWorkflowId !== 'undefined' && link.ActionWorkflowId !== null)
                link1.actionWorkflowId = link.ActionWorkflowId;
            if (typeof link.LineType !== 'undefined' && link.LineType !== null) {
                link1.setHeadBrush(link.LineColor);
                link1.setHeadShape('Triangle');
                link1.lineColor = link.LineColor;
                link1.lineType = link.LineType;
            } else {
                link1.lineColor = "";
                link1.lineType = "";
            }
            link1.text = link.LinkText;
            link1.route();
        });

        this.topToBottom();
    };

    this.buildDiagramCustom = function (lstNodes, lstLinks) {
        diagram.clearAll();
        var nodeMap = [];
        var nodes = lstNodes;
        Array.forEach(nodes, function (node) {
            var nodewidth = node.Width === null ? 55 : parseInt(node.Width / 2.2);
            var diagramNode = diagram.getFactory().createShapeNode(new Rect(10, 15, parseInt(nodewidth), 15));
            diagramNode.shadowOffsetX = 0;
            diagramNode.shadowOffsetY = 0;
            diagramNode.setStroke("Transparent");
            nodeMap[node.Id] = diagramNode;
            diagramNode.id = node.Id;
            diagramNode.width = node.Width;
            diagramNode.jsonId = node.Id;
            diagramNode.setText(node.Name);
            diagramNode.setShape(node.ShapeId);
            diagramNode.setBrush(node.Color);
            if (typeof node.ActionWorkflowId !== 'undefined' && node.ActionWorkflowId !== null)
                diagramNode.actionWorkflowId = node.ActionWorkflowId;
            if (typeof node.ProgramId !== 'undefined' && node.ProgramId !== null)
                diagramNode.programId = node.ProgramId;
            if (typeof node.GroupId !== 'undefined' && node.GroupId !== null)
                diagramNode.groupId = node.GroupId;
            if (typeof node.GroupName !== 'undefined' && node.GroupName !== null)
                diagramNode.groupName = node.GroupName;
            if (typeof node.StatementId !== 'undefined' && node.StatementId !== null)
                diagramNode.statementId = node.StatementId;
            if (typeof node.ShapeId !== 'undefined' && node.ShapeId !== null)
                diagramNode.shapeId = node.ShapeId;
            if (typeof node.Name !== 'undefined' && node.Name !== null)
                diagramNode.nodeName = node.Name;
            if (typeof node.Color !== 'undefined' && node.Color !== null)
                diagramNode.nodeColor = node.Color;
        });

        var links = lstLinks;
        Array.forEach(links, function (link) {
            var link1 = diagram.getFactory().createDiagramLink(nodeMap[link.Origin], nodeMap[link.Target]);
            if (typeof link.Origin !== 'undefined' && link.Origin !== null)
                link1.originId = link.Origin;
            if (typeof link.Target !== 'undefined' && link.Target !== null)
                link1.targetId = link.Target;
            if (typeof link.LinkText !== 'undefined' && link.LinkText !== null)
                link1.linkText = link.LinkText;
            if (typeof link.ProgramId !== 'undefined' && link.ProgramId !== null)
                link1.programId = link.ProgramId;
            if (typeof link.StatementId !== 'undefined' && link.StatementId !== null)
                link1.statementId = link.StatementId;
            if (typeof link.ActionWorkflowId !== 'undefined' && link.ActionWorkflowId !== null)
                link1.actionWorkflowId = link.ActionWorkflowId;
            if (typeof link.LineType !== 'undefined' && link.LineType !== null) {
                link1.setHeadBrush(link.LineColor);
                link1.setHeadShape('Triangle');
                link1.lineColor = link.LineColor;
                link1.lineType = link.LineType;
            } else {
                link1.lineColor = "";
                link1.lineType = "";
            }
            link1.text = link.LinkText;
            link1.route();
        });

        this.topToBottom();
    };

    this.downloadDiagram = function () {
        var gDiagram = Diagram.find("diagram") || Diagram.find("diagram-workflow");
        var gNodes = [];
        var gLinks = [];
        $.each(gDiagram.nodes, function (i, node) {
            var nodeName = node.nodeName;
            nodeName = nodeName.replace("&apos;", "'").replace("&gt;", ">").replace("&lt;", "<").replace("&quot;", "\"").replace("&amp;", "&");
            gNodes.push({
                Id: node.id,
                Name: nodeName,
                ProgramId: node.programId,
                ActionWorkflowId: node.actionWorkflowId,
                GroupId: node.groupId,
                GroupName: node.groupName,
                StatementId: node.statementId,
                ShapeId: node.shapeId,
                Color: node.nodeColor,
                JsonId: node.id
            });
        });

        $.each(gDiagram.links, function (i, link) {
            var linkText = link.linkText;
            linkText = linkText.replace("&apos;", "'").replace("&gt;", ">").replace("&lt;", "<").replace("&quot;", "\"").replace("&amp;", "&");
            var lineTp = "";
            var lineCl = "";
            if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
                lineTp = link.lineType;
                lineCl = link.lineColor;
            }
            gLinks.push({
                LinkText: linkText,
                StatementId: link.statementId,
                ProgramId: link.programId,
                Origin: link.originId,
                Target: link.targetId,
                ActionWorkflowId: link.actionWorkflowId,
                LineType: lineTp,
                LineColor: lineCl
            });
        });

        var workFlowData = { Nodes: gNodes, Links: gLinks };

        var prjId = getParameterByName("prjId");
        jQuery.ajax({
            url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
            type: 'POST',
            data: JSON.stringify(workFlowData),
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                downloadFile(tData);
            }
        });
        /*
        var graphString = "";
        graphString += getGraphHeader();
        $.each(gNodes, function (i, node) {
            graphString += createNode(node);
        });
        $.each(gLinks, function (i, link) {
            var linkId = "edge_" + (i + 1);
            graphString += createLink(linkId, link);
        });
        graphString += closeGraph();
        graphString = graphString.replace(/ /g, "%20");
        var fileName = gNodes[0].Name;
        fileName = fileName + ".graphml";
        this.download(fileName, graphString);
        */
    };

    this.download = function (fileName, graphString) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/graphml;charset=utf-8,' + graphString);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    this.downloadFile = function (path) {
        if (typeof path === "undefined") {
            displayMessage("Error occurred please try again!", "medium");
            return false;
        }
        var element = document.getElementById("a123456");
        element.href = path;
        element.target = "_blank";
        // window.open(path, "_self");
        element.click();
        return true;
    };

    function fitFractalItems(diagram) {
        var rect = Rect.empty;
        diagram.nodes.forEach(function (node) {
            if (rect === Rect.empty)
                rect = node.bounds;
            else
                rect = rect.union(node.bounds);
        });
        if (rect) {
            diagram.setBounds(new Rect(0, 0, rect.right() + 10, rect.bottom() + 10));
        }
    };

    this.buildAndDownloadDiagram = function (nodes, links) {
        var gNodes = [];
        var gLinks = [];
        $.each(nodes, function (i, node) {
            gNodes.push({
                Id: node.Id,
                Name: node.Name,
                ProgramId: node.ProgramId,
                ActionWorkflowId: node.ActionWorkflowId,
                GroupId: node.GroupId,
                GroupName: node.GroupName,
                StatementId: node.StatementId,
                ShapeId: node.ShapeId,
                Color: node.Color,
                JsonId: node.Id
            });
        });
        $.each(links, function (i, link) {
            var lineTp = "";
            var lineCl = "";
            if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
                lineTp = link.lineType;
                lineCl = link.lineColor;
            }
            gLinks.push({
                LinkText: link.LinkText,
                StatementId: link.StatementId,
                ProgramId: link.ProgramId,
                Origin: link.Origin,
                Target: link.Target,
                ActionWorkflowId: link.ActionWorkflowId,
                LineType: lineTp,
                LineColor: lineCl
            });
        });
        var workFlowData = { Nodes: gNodes, Links: gLinks };

        var prjId = getParameterByName("prjId");
        jQuery.ajax({
            url: baseAddress + "FileObjectMethodReference/DownloadFlowChartFromGraph?projectId=" + prjId,
            type: 'POST',
            data: JSON.stringify(workFlowData),
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                downloadFile(tData);
            }
        });
    };

})(jQuery);
