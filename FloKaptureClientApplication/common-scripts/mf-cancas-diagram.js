// Please prefere this way of defining the module...
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.DiagramUtility = factory(jQuery);
    }
}(typeof window !== "undefined" ? window : this, function ($) {
    "use strict";
    var Diagram = window.MindFusion.Diagramming.Diagram;
    var Rect = window.MindFusion.Drawing.Rect;
    var LayeredLayout = window.MindFusion.Graphs.LayeredLayout;
    var Reassign = window.MindFusion.Graphs.Anchoring.Reassign;
    var LayoutDirection = window.MindFusion.Graphs.LayoutDirection;
    var TreeLayout = window.MindFusion.Graphs.TreeLayout;
    var TreeLayoutLinkType = window.MindFusion.Graphs.TreeLayoutLinkType;
    var FractalLayout = window.MindFusion.Graphs.FractalLayout;

    var GraphUtility = function () {

        this.getGraphHeader = function () {
            var header = "<?xml version='1.0' encoding='UTF-8' standalone='no'?><graphml xmlns='http://graphml.graphdrawing.org/xmlns' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:y='http://www.yworks.com/xml/graphml' xmlns:yed='http://www.yworks.com/xml/yed/3' xsi:schemaLocation='http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd'><key for='graphml' id='d0' yfiles.type='resources'/><key for='port' id='d1' yfiles.type='portgraphics'/><key for='port' id='d2' yfiles.type='portgeometry'/><key for='port' id='d3' yfiles.type='portuserdata'/><key attr.name='url' attr.type='string' for='node' id='d4'/><key attr.name='description' attr.type='string' for='node' id='d5'/><key for='node' id='d6' yfiles.type='nodegraphics'/><key attr.name='Description' attr.type='string' for='graph' id='d7'/><key attr.name='url' attr.type='string' for='edge' id='d8'/><key attr.name='description' attr.type='string' for='edge' id='d9'/><key for='edge' id='d10' yfiles.type='edgegraphics'/><graph edgedefault='directed' id='G'><data key='d7'/>";
            return header;
        };

        this.formatText = function (inputString) {
            if (typeof inputString === "undefined" || inputString === null) return "";
            var s = inputString;
            s = s.replace(new RegExp("&", "g"), "&amp;");
            s = s.replace(new RegExp("\\n", "g"), "&#xA;");
            s = s.replace(new RegExp("&apos;", "g"), "'");
            s = s.replace(new RegExp(">", "g"), "&gt;");
            s = s.replace(new RegExp("<", "g"), "&lt;");
            s = s.replace(new RegExp("&quot;", "g"), '""');
            return s;
        };

        this.createNode = function (node) {
            var shape = "circle";
            if (node.ShapeId === "Decision2")
                shape = "diamond";
            if (node.ShapeId === "Decision")
                shape = "diamond";
            if (node.ShapeId === "RoundRect")
                shape = "roundrectangle";
            var sNodeIdText = this.formatText(node.Name);
            sNodeIdText = shape === "roundrectangle" ? this.splitString(sNodeIdText) : this.splitString(sNodeIdText, shape);
            var colorOfNode = node.Color;
            var widthCalculation = this.calculateNodeWidth(shape);
            var width = widthCalculation;
            var heightCalculation = shape === "roundrectangle"
                ? this.calculateNodeHeightRoundRect(sNodeIdText)
                : this.calculateNodeHeight(sNodeIdText);
            var height = heightCalculation;
            var gNode = "<node id='" + node.Id + "'><data key='d5'/><data key='d6'><y:ShapeNode><y:Geometry height='" + height + "'" +
                " width='" + width + "'/><y:Fill color='" + colorOfNode + "' transparent='false'/>" +
                "<y:BorderStyle color='" + colorOfNode + "' type='line' width='1.0'/>" +
                "<y:NodeLabel alignment='center' autoSizePolicy='content' fontFamily='Arial' fontSize='13' fontStyle='plain' " +
                "hasBackgroundColor='false' hasLineColor='false' height='" + height + "' modelName='custom' textColor='#000000' " +
                "visible='true' width='" + width + "'>" + sNodeIdText + "<y:LabelModel><y:SmartNodeLabelModel distance='4.0'/></y:LabelModel>" +
                "<y:ModelParameter><y:SmartNodeLabelModelParameter labelRatioX='0.0' labelRatioY='0.0' nodeRatioX='0.0' " +
                "nodeRatioY='0.0' offsetX='0.0' offsetY='0.0' upX='0.0' upY='-1.0'/></y:ModelParameter></y:NodeLabel>" +
                "<y:Shape type='" + shape + "'/></y:ShapeNode></data></node>";
            return gNode;
        };

        this.createLink = function (linkId, nodeLink) {
            var linkText = this.formatText(nodeLink.LinkText);
            var link =
                "<edge id='" + linkId + "' source='" + nodeLink.Origin + "' target='" + nodeLink.Target + "'><data key='d9'/><data key='d10'><y:PolyLineEdge><y:Path sx='0.0'" +
                    " sy='0.0' tx='79.51567087688028' ty='-20.66199250788975'/>" +
                    "<y:LineStyle color='" + nodeLink.LineColor + "' type='" + nodeLink.LineType + "' width='1.0'/>" +
                    "<y:Arrows source='none' target='standard'/><y:EdgeLabel alignment='center' configuration='AutoFlippingLabel' " +
                    "distance='2.0' fontFamily='Arial' fontSize='12' fontStyle='plain' hasBackgroundColor='false' hasLineColor='false'" +
                    " height='18.701171875' modelName='custom' preferredPlacement='anywhere' ratio='0.5' textColor='#000000' " +
                    "visible='true' width='53.3359375'>" + linkText + "<y:LabelModel>" +
                    "<y:SmartEdgeLabelModel autoRotationEnabled='false' defaultAngle='0.0' defaultDistance='10.0'/>" +
                    "</y:LabelModel><y:ModelParameter><y:SmartEdgeLabelModelParameter angle='0.0' distance='30.0'" +
                    " distanceToCenter='true' position='right' ratio='0.5' segment='0'/></y:ModelParameter>" +
                    "<y:PreferredPlacementDescriptor angle='0.0' angleReference='absolute' angleRotationOnRightSide='co' distance='-1.0' frozen='true' placement='anywhere' side='anywhere' sideReference='relative_to_edge_flow' /></y:EdgeLabel><y:BendStyle smoothed='false'/>" +
                    "</y:PolyLineEdge></data></edge>";
            return link;
        };

        this.closeGraph = function () {
            var closeGraph = "</graph><data key='d0'><y:Resources/></data></graphml>";
            return closeGraph;
        };

        this.getGroupGraphNodes = function (nodeString, groupName) {
            var groupGraph = "<graph edgedefault='directed' id='" +
                groupName.trim() + "'>" + nodeString + "</graph>" + "\n";
            return groupGraph;
        };

        this.innerGroupNode = function () { };

        this.splitString = function (input) {
            input = input.trim();
            if (input.length <= 80)
                return input;
            var splittedStrings = input.Split(/\r?\n/);
            var newInputString = "";
            for (var i = 0; i < splittedStrings.length; i++) {
                var str = splittedStrings[i];
                var thisString = str.replace(/\r?\n/, "");
                if (thisString.length <= 80) {
                    newInputString += thisString + "\n";
                    continue;
                }
                var part = thisString.substring(0, 80);
                var charCounts = 0;
                for (var s = 80; s < thisString.length; s++) {
                    part += thisString[s];
                    if (thisString[s] !== " " && charCounts === 0) continue;
                    if (thisString[s] === " " && charCounts === 0) {
                        part += "\n";
                        charCounts++;
                        continue;
                    }
                    charCounts++;
                    if (thisString[s] !== " ") continue;
                    if (thisString[s] !== " " || charCounts <= 80) continue;
                    part += "\n";
                    charCounts = 1;
                }
                newInputString += part + "\n";
            }
            return newInputString;
        };

        this.splitString = function (input, shape) {
            input = input.trim();
            if (input.length <= 25)
                return input;
            if (shape !== "diamond") return input;
            var allSpaceIndexes = input.split(" ");
            if (allSpaceIndexes.length === 0)
                return input;
            var newInputString = input.substring(0, 25);
            var charCounts = 0;
            for (var s = 25; s < input.length; s++) {
                newInputString += input[s];
                if (input[s] !== " " && charCounts === 0) continue;
                if (input[s] === " " && charCounts === 0) {
                    newInputString += "\n";;
                    charCounts++; continue;
                }
                charCounts++;
                if (input[s] !== " ") continue;
                if (input[s] !== " " || charCounts <= 25) continue;
                newInputString += "\n";
                charCounts = 1;
            }
            return newInputString;
        };

        this.calculateNodeWidth = function (shape) {
            return shape === "diamond" ? 325 : 650;
        };

        this.calculateNodeHeightRoundRect = function (input) {
            var newLineChars = input.split("\n"); //+ input.split("&#xA;");
            var count = (input.match(/&#xA;/g) || []).length;
            newLineChars = $.grep(newLineChars, function (n) { return n === 0 || n });
            var height = (newLineChars.length + count) * 20 + 10;
            return height;
        };

        this.calculateNodeHeight = function (input) {
            var newLineChars = input.split(/\r?\n/);
            var count = (input.match(/&#xA;/g) || []).length;
            var height = (newLineChars.length + count) * 20;
            return height;
        };

        this.generateNewGroup = function (newGrpName) {
            var groupName = "<data key='d6'>" + "\n" +
                "<y:ProxyAutoBoundsNode>" + "\n" +
                "<y:Realizers active='0'>" + "\n" +
                "<y:GroupNode>" + "\n" +
                "<y:Geometry height='60.0' width='450.0' x='183.70396825396824' y='80.0'/>" +
                "\n" +
                "<y:Fill color='#F5F5F5' transparent='false'/>" + "\n" +
                "<y:BorderStyle color='#000000' type='dashed' width='1.0'/>" + "\n" +
                "<y:NodeLabel alignment='right' autoSizePolicy='node_width' backgroundColor='#EBEBEB' borderDistance='0.0' fontFamily='Dialog' fontSize='15' fontStyle='plain' hasLineColor='false' height='22.37646484375' modelName='internal' modelPosition='t' textColor='#000000' visible='true' width='141.04007936507935' x='0.0' y='0.0'>" +
                "\n" +
                " " + newGrpName + "</y:NodeLabel>" + "\n" +
                "<y:Shape type='roundrectangle'/>" + "\n" +
                "<y:State closed='false' closedHeight='60.0' closedWidth='450.0' innerGraphDisplayEnabled='false'/>" +
                "\n" +
                "<y:Insets bottom='15' bottomF='15.0' left='15' leftF='15.0' right='15' rightF='15.0' top='15' topF='15.0'/>" +
                "\n" +
                "<y:BorderInsets bottom='0' bottomF='0.0' left='1' leftF='1.000350322420644' right='1' rightF='1.0000031001983984' top='0' topF='0.0'/>" +
                "\n" +
                "</y:GroupNode>" + "\n" +
                "<y:GroupNode>" + "\n" +
                "<y:Geometry height='60.0' width='450.0' x='0.0' y='60.0'/>" + "\n" +
                "<y:Fill color='#F5F5F5' transparent='false'/>" + "\n" +
                "<y:BorderStyle color='#000000' type='dashed' width='1.0'/>" + "\n" +
                "<y:NodeLabel alignment='right' autoSizePolicy='node_width' backgroundColor='#EBEBEB' borderDistance='0.0' fontFamily='Dialog' fontSize='15' fontStyle='plain' hasLineColor='false' height='22.37646484375' modelName='internal' modelPosition='t' textColor='#000000' visible='true' width='59.02685546875' x='-4.513427734375' y='0.0'>" +
                "\n" +
                "" + newGrpName + "</y:NodeLabel>" + "\n" +
                "<y:Shape type='roundrectangle'/>" + "\n" +
                "<y:State closed='true' closedHeight='60.0' closedWidth='450.0' innerGraphDisplayEnabled='false'/>" +
                "\n" +
                "<y:Insets bottom='5' bottomF='5.0' left='5' leftF='5.0' right='5' rightF='5.0' top='5' topF='5.0'/>" +
                "\n" +
                "<y:BorderInsets bottom='0' bottomF='0.0' left='0' leftF='0.0' right='0' rightF='0.0' top='0' topF='0.0'/>" +
                "\n" +
                "</y:GroupNode>" + "\n" +
                "</y:Realizers>" + "\n" +
                "</y:ProxyAutoBoundsNode>" + "\n" +
                "</data>" + "\n";
            return groupName;
        };

        this.downloadDiagram = function (diaObj) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:application/graphml;charset=utf-8,' + diaObj.graphString);
            element.setAttribute('download', diaObj.fileName);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
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
            if (typeof path === "undefined" || path === "") {
                displayMessage("Error occurred please try again!", "medium");
                return;
            }
            var element = document.createElement('a');
            element.href = path;
            element.target = "_blank";
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        };
    };

    var DiagramUtility = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.defaults(), options);
        this.fileName = this.options.fileName;
        this.structure = $.extend({}, this._wrapper());
        this._events = this._addEvents(this.defaults());
        this._bindEvents();
        this.buildDiagram(this.options.nodes, this.options.links);
        this.legends = this._addLegends(this.options.legends);
        // this.msgObj = new Message("tdError");
    };

    DiagramUtility.prototype._addLegends = function (legends) {
        var legendDiv = this.$element.find(".legend");
        $.each(legends, function (i, legend) {
            legendDiv.append($("<li />").append($("<span />").html(legend.title)
                .css({ "background-color": legend.bgColor, "padding": "6px", "color": "black" })));
        });
        if (!legends) legendDiv.hide();
        return legends || [];
    };

    DiagramUtility.prototype._addEvents = function (d) {
        var events = {};
        $.each(d, function (i, e) {
            $.each(e, function (r, t) {
                events[r] = t;
            });
        });
        return events;
    };

    DiagramUtility.prototype.setTitle = function (title) {
        $(this.$element).find("h4").html(title);
    };

    DiagramUtility.prototype.defaults = function () {
        return {
            zooming: {
                zoomIn: function () {
                    if (this.Diagram.zoomFactor > 200) return;
                    this.Diagram.setZoomFactor(this.Diagram.zoomFactor + 10);
                },
                zoomOut: function () {
                    if (this.Diagram.zoomFactor < 19) return;
                    this.Diagram.setZoomFactor(this.Diagram.zoomFactor - 10);
                },
                reset: function () {
                    this.Diagram.setZoomFactor(100);
                }
            },
            layouts: {
                treeLayout: function () {
                    var treeLayout = new TreeLayout();
                    treeLayout.linkType = TreeLayoutLinkType.Straight;
                    treeLayout.nodeDistance = 6;
                    treeLayout.levelDistance = 12;
                    this.Diagram.arrange(treeLayout);
                },
                leftToRight: function () {
                    var layout = new LayeredLayout();
                    layout.direction = LayoutDirection.LeftToRight;
                    layout.siftingRounds = 0;
                    layout.nodeDistance = 6;
                    layout.layerDistance = 12;
                    this.Diagram.arrange(layout);
                    this.Diagram.resizeToFitItems();
                    this.Diagram.routeAllLinks();
                    layout.anchoring = Reassign;
                },
                topToBottom: function () {
                    var layout = new LayeredLayout();
                    layout.direction = LayoutDirection.TopToBottom;
                    layout.siftingRounds = 0;
                    layout.nodeDistance = 6;
                    layout.layerDistance = 12;
                    this.Diagram.arrange(layout);
                    this.Diagram.resizeToFitItems();
                    this.Diagram.routeAllLinks();
                    layout.anchoring = Reassign;
                },
                layeredLayout: function () {
                    var layout = new LayeredLayout();
                    layout.direction = LayoutDirection.TopToBottom;
                    layout.siftingRounds = 0;
                    layout.nodeDistance = 6;
                    layout.layerDistance = 12;
                    this.Diagram.arrange(layout);
                    this.Diagram.resizeToFitItems();
                },
                fractalLayout: function () {
                    var layout = new FractalLayout();
                    layout.root = this.Diagram.nodes[0];
                    this.Diagram.arrange(layout);
                    (function (diagram) {
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
                    })(this.Diagram);
                }
            },
            routing: {
                directRouting: function () {
                    var layout = new LayeredLayout();
                    layout.direction = LayoutDirection.TopToBottom;
                    layout.siftingRounds = 0;
                    layout.nodeDistance = 6;
                    layout.layerDistance = 12;
                    this.Diagram.arrange(layout);
                    this.Diagram.resizeToFitItems();
                },
                orthogonalRouting: function () {
                    var layout = new LayeredLayout();
                    layout.direction = LayoutDirection.TopToBottom;
                    layout.siftingRounds = 0;
                    layout.nodeDistance = 6;
                    layout.layerDistance = 12;
                    this.Diagram.arrange(layout);
                    this.Diagram.resizeToFitItems();
                    this.Diagram.routeAllLinks();
                    this.options.layouts.topToBottom.apply(this);
                }
            },
            download: {
                download: function () {
                    var gData = DiagramUtility._prepareNodesAndLinks(this.Diagram);
                    DiagramUtility._download(gData, this.fileName);
                }
            },
            directDownload: {
                directDownload: function (nodes, links) {
                    var diagram = { nodes: nodes, links: links };
                    var gData = DiagramUtility._prepareNodesAndLinks(diagram);
                    DiagramUtility._download(gData, this.fileName);
                }
            }
        };
    };

    DiagramUtility._downloadFromApi = function (workFlowData) {
        var graphUtility = new GraphUtility();
        jQuery.ajax({
            url: baseAddress + "FileObjectMethodReference/DownloadPlainGraphDiagram?fileName=" + workFlowData.fileName,
            type: 'POST',
            data: JSON.stringify(workFlowData),
            contentType: "application/json;charset=utf-8",
            success: function (tData) {
                graphUtility.downloadFile(tData);
            }
        });
    };

    DiagramUtility._download = function (gData, fileName) {
        /*
        var graphUtility = new GraphUtility();
        var graphString = "";
        graphString += graphUtility.getGraphHeader();
        $.each(gData.gNodes, function (i, node) {
            graphString += graphUtility.createNode(node);
        });
        $.each(gData.gLinks, function (i, link) {
            var linkId = "edge_" + (i + 1);
            graphString += graphUtility.createLink(linkId, link);
        });
        graphString += graphUtility.closeGraph();
        graphString = graphString.replace(/ /g, "%20");
        var diaObj = { fileName: fileName, Nodes: gData.gNodes, Links: gData.gLinks };
        graphUtility.downloadDiagram(diaObj);
        */
        fileName = fileName || "GraphDiagram.graphml";
        var diaObj = { fileName: fileName, Nodes: gData.gNodes, Links: gData.gLinks };
        this._downloadFromApi(diaObj);
    };

    DiagramUtility.prototype._bindEvents = function () {
        var self = this;
        this.$element.find("i, button").each(function () {
            $(this).click(self, DiagramUtility._handleEvent);
        });
        /*
        this.zoomInButton = $(this.$element.find(".fa-search-plus"));
        this.zoomInButton.click(this, DiagramUtility._handleClick);
        this.zoomOutButton = $(this.$element.find(".fa-search-minus"));
        this.zoomOutButton.click(this, DiagramUtility._handleClick);
        this.resetZoom = $(this.$element.find(".fa-search"));
        this.resetZoom.click(this, DiagramUtility._handleClick);
        this.directLayout = $(this.$element.find(".direct"));
        this.directLayout.click(this, DiagramUtility._handleClick);
        this.orthogonalRouting = $(this.$element.find(".orthogonal"));
        this.orthogonalRouting.click(this, DiagramUtility._handleClick);
        this.treeLayout = $(this.$element.find(".tree"));
        this.treeLayout.attr({ name: "treeLayout", lang: "treeLayout" });
        this.treeLayout.click(this, DiagramUtility._handleEvent);
        */
    };

    DiagramUtility._prepareNodesAndLinks = function (diagram) {
        var gNodes = [];
        var gLinks = [];
        $.each(diagram.nodes, function (i, node) {
            gNodes.push({
                Id: node.id,
                Name: node.nodeName,
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

        $.each(diagram.links, function (i, link) {
            var lineTp = "";
            var lineCl = "";
            if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
                lineTp = link.lineType;
                lineCl = link.lineColor;
            }
            gLinks.push({
                LinkText: link.linkText,
                StatementId: link.statementId,
                ProgramId: link.programId,
                Origin: link.originId,
                Target: link.targetId,
                ActionWorkflowId: link.actionWorkflowId,
                LineType: lineTp,
                LineColor: lineCl
            });
        });
        return { gNodes, gLinks };
    };

    DiagramUtility._handleEvent = function (event) {
        var target = event.target;
        var data = event.data;
        var funData = data._events[target.lang].call(data, event);
        return funData;
    };

    DiagramUtility._handleClick = function (event) {
        var data = event.data;
        switch (this.title) {
        case "Zoom In":
            data.options.zooming.zoomIn.call(data, event);
            break;
        case "Zoom Out":
            data.options.zooming.zoomOut.call(data, event);
            break;
        case "Reset":
            data.options.zooming.reset.call(data, event);
            break;
        case "Routing: Direct":
            data.options.routing.directRouting.call(data, event);
            break;
        case "Routing: Orthogonal":
            data.options.routing.orthogonalRouting.call(data, event);
            break;
        default:
        }
    };

    DiagramUtility.prototype.trigger = function () {
        var args = [].slice.call(arguments);
        var fun = this[arguments[0]];
        var funData = fun.call(this, args[1]);
        return funData;
    };

    DiagramUtility.prototype._wrapper = function () {
        var root = $("<div />").attr("class", "col-md-12").attr("style", "padding: 0;");
        var row = $("<ul />").attr({ "class": "dia-breadcrumb" });
        row.append($("<li />").append($("<a><i name='zoomIn' lang='zoomIn' class='fa fa-search-plus fa-2x' title='Zoom In'></i>")));
        row.append($("<li />").append($("<a><i name='zoomOut' lang='zoomOut' class='fa fa-search-minus fa-2x' title='Zoom Out'></i></a>")));
        row.append($("<li />").append($("<a><i name='reset' lang='reset' class='fa fa-search fa-2x' title='Reset'></i></a>")));
        row.append($("<li />").append($("<a><i name='leftToRight' lang='leftToRight' class='fa fa-arrow-right fa-2x' title='Left to Right'></i></a>")));
        row.append($("<li />").append($("<a><i name='topToBottom' lang='topToBottom' class='fa fa-arrow-down fa-2x' title='Top to Bottom'></i></a>")));
        row.append($("<li />").append($("<a><i name='download' lang='download' class='fa fa-download fa-2x' title='Download Diagram (.graphml file)'></i></a>")));
        row.append($("<li />").append($("<button title='Routing: Direct' name='directRouting' lang='directRouting' class='btn btn-primary direct'>Direct</button>")));
        row.append($("<li />").append($("<button " +
            "title='Routing: Orthogonal' name='orthogonalRouting' lang='orthogonalRouting' class='btn btn-primary orthogonal'>Orthogonal</button>")));
        row.append($("<li />").append($("<button " +
            "title='Layout: Tree Layout' name='treeLayout', lang='treeLayout' class='btn btn-primary tree'>Tree Layout </button>")));
        row.append($("<li />").append($("<button " +
            "title='Layout: Layered Layout' name='layeredLayout' lang='layeredLayout' class='btn btn-primary layered'>Layered Layout</button>")));
        row.append($("<li />").append($("<button " +
            "title='Layout: Fractal Layout' name='fractalLayout' lang='fractalLayout' class='btn btn-primary fractal'>Fractal Layout</button>")));
        var legendRow = $("<ul />").attr({ "class": "dia-breadcrumb legend" });
        root.append(row);
        root.append(legendRow);

        var canvasId = $(this.$element).attr("id") + "-dia";
        var canvas = $("<canvas />").attr({ id: canvasId, style: "cursor: default; margin-top: 0px;" }).html("This page requires a browser that supports HTML 5 Canvas element.");
        var diaWrapper = $("<div />").attr({ "class": "col-md-12", "style": "padding-right: 15px;" })
            .append($("<div />").attr({ "class": "row", style: "overflow: scroll; border-top: 1px solid #F2F2F2; padding-left: 4px;" }).append(canvas));

        $(this.$element).append(root);
        $(this.$element).append($("<div />").attr({ "class": "col-md-12", style: "height: 4px; z-index: 100; text-align: center;" }).append("<h4 />"));
        $(this.$element).append(diaWrapper);
        var diagram = Diagram.create($(`#${canvasId}`)[0]);
        diagram.setShowGrid(this.options.gridLines);
        diagram.setLinkHeadShapeSize(2);
        diagram.setBackBrush(this.options.backBrush);
        diagram.imageSmoothingEnabled = false;
        diagram.setZoomFactor(100);
        this.Diagram = diagram;
        this.canvasId = canvasId;
    };

    DiagramUtility.prototype.buildDiagram = function (lstNodes, lstLinks) {
        var diagram = this.Diagram;
        diagram.clearAll();
        var nodeMap = [];
        var nodes = lstNodes || [];
        var links = lstLinks || [];
        if (nodes.length >= 201 && links.length >= 200) {
            this.options.directDownload.directDownload.call(this, nodes, links);
            return;
        }
        Array.forEach(nodes, function (node) {
            node.Width = node.Width === null ? 55 : node.Width.replace("px", "");
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

        this.options.layouts.topToBottom.apply(this);
    };

    DiagramUtility.prototype.getJSON = function () {
        var gDiagram = this.Diagram;
        var gNodes = [];
        var gLinks = [];
        $.each(gDiagram.nodes, function (i, node) {
            gNodes.push({
                Id: node.id,
                Name: node.nodeName,
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
            var lineTp = "";
            var lineCl = "";
            if (link.lineType !== null && typeof link.lineType !== 'undefined' && link.lineType !== "") {
                lineTp = link.lineType;
                lineCl = link.lineColor;
            }
            gLinks.push({
                LinkText: link.linkText,
                StatementId: link.statementId,
                ProgramId: link.programId,
                Origin: link.originId,
                Target: link.targetId,
                ActionWorkflowId: link.actionWorkflowId,
                LineType: lineTp,
                LineColor: lineCl
            });
        });

        var jsonData = JSON.stringify({ Nodes: gNodes, Links: gLinks });
        return jsonData;
    };

    var Utility = function (options) {
        if (typeof options === "object") {
            var $this = $(this);
            var dData = new DiagramUtility(this, options);
            $this.data("DiagramUtility", dData);
            return $this;
        } else if (typeof options === "string") {
            var $element = $(this).data("DiagramUtility");
            var args = [].slice.call(arguments);
            var funData = $element.trigger.apply($element, args);
            return funData;

            /* // Working...
            var fun = $element[options];
            var funData = fun.call($element, arguments[1]);
            return funData;
            */
        }
        return true;
    };

    $.fn.canvasDiagram = Utility;

    var canvasDiagram = DiagramUtility;
    return canvasDiagram;
}));