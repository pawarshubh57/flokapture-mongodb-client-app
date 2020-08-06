(function ($) {
    this.getGraphHeader = function () {
        var header = "<?xml version='1.0' encoding='UTF-8' standalone='no'?><graphml xmlns='http://graphml.graphdrawing.org/xmlns' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:y='http://www.yworks.com/xml/graphml' xmlns:yed='http://www.yworks.com/xml/yed/3' xsi:schemaLocation='http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd'><key for='graphml' id='d0' yfiles.type='resources'/><key for='port' id='d1' yfiles.type='portgraphics'/><key for='port' id='d2' yfiles.type='portgeometry'/><key for='port' id='d3' yfiles.type='portuserdata'/><key attr.name='url' attr.type='string' for='node' id='d4'/><key attr.name='description' attr.type='string' for='node' id='d5'/><key for='node' id='d6' yfiles.type='nodegraphics'/><key attr.name='Description' attr.type='string' for='graph' id='d7'/><key attr.name='url' attr.type='string' for='edge' id='d8'/><key attr.name='description' attr.type='string' for='edge' id='d9'/><key for='edge' id='d10' yfiles.type='edgegraphics'/><graph edgedefault='directed' id='G'><data key='d7'/>";
        return header;
    };

    this.formatText = function (inputString) {
        if (typeof inputString === "undefined" || inputString === null)
            return "";
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
        if (node.ShapeId === "ellipse")
            shape = "ellipse";
        var sNodeIdText = formatText(node.Name);
        sNodeIdText = shape === "roundrectangle" ? splitString(sNodeIdText) : splitString(sNodeIdText, shape);
        var colorOfNode = node.Color;
        var widthCalculation = shape === "roundrectangle" ? nodeWidth(sNodeIdText) :
            shape === "ellipse" ? nodeWidth(sNodeIdText) : calculateNodeWidth(shape);
        // widthCalculation = shape === "ellipse" ? nodeWidth(sNodeIdText) : calculateNodeWidth(shape);
        var width = widthCalculation;
        var heightCalculation = shape === "roundrectangle"
            ? calculateNodeHeightRoundRect(sNodeIdText)
            : calculateNodeHeight(sNodeIdText);
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
        var linkText = formatText(nodeLink.LinkText); // .replace(/&apos;/g, "'").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
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
    this.closeGraphNodes = function () {
        var closeGraph = "</graph>";
        return closeGraph;
    };
    this.closeGraphComplete = function () {
        var closeGraph = "<data key='d0'><y:Resources/></data></graphml>";
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

    this.nodeWidth = function (text) {
        var width = text.length * 10 + 100;
        return width;
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

    this.getGroupNode = function (nodeDetails) {
        var shape = "circle";
        if (nodeDetails.ShapeId == "Decision2")
            shape = "hexagon";
        if (nodeDetails.ShapeId == "Decision")
            shape = "diamond";
        if (nodeDetails.ShapeId == "RoundRect")
            shape = "roundrectangle";
        var sNodeIdText = nodeDetails.Name.replace("'", "&apos;").replace(">", "&gt;").replace("<", "&lt;")
            .replace("\"", "&quot;");
        var mySplit = sNodeIdText.split(' ');
        sNodeIdText = mySplit.join('');
        // sNodeIdText = string.Join(" ", sNodeIdText.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));

        sNodeIdText = shape == "roundrectangle"
            ? splitString(sNodeIdText)
            : splitString(sNodeIdText, shape);

        var colorOfNode = nodeDetails.Color;
        var widthCalculation = calculateNodeWidth(shape);
        var width = widthCalculation;
        var heightCalculation = shape == "roundrectangle"
            ? calculateNodeHeightRoundRect(sNodeIdText)
            : calculateNodeHeight(sNodeIdText);
        var height = heightCalculation;
        var newLine = "\n";
        var node = "<node id='" + nodeDetails.Id + "'>" + newLine +
            "<data key='d6'>" + newLine +
            "<y:ShapeNode>" + newLine +
            "<y:Geometry height=\"" + height + "\" width=\"" + width +
            "\" x=\"224.7186538938492\" y=\"117.37646484375\"/>" +
            newLine +
            "<y:Fill color=\"" + colorOfNode + "\" transparent=\"false\"/>" + newLine +
            " <y:BorderStyle color=\"" + colorOfNode + "\" type=\"line\" width=\"1.0\"/>" +
            newLine +
            "<y:NodeLabel alignment=\"center\" autoSizePolicy=\"content\" fontFamily=\"Times New Roman\" fontSize=\"10\" fontStyle=\"plain\"  " +
            " hasBackgroundColor=\"false\" hasLineColor=\"false\" height=\"" + height +
            "\" modelName=\"custom\" " +
            " textColor=\"#000000\" visible=\"true\" width=\"" + width + "\" x=\"5.0\" " +
            " y=\"5.6494140625\">" + sNodeIdText + "<y:LabelModel>" +
            newLine +
            "    <y:SmartNodeLabelModel distance=\"2.0\"/>" + newLine +
            "  </y:LabelModel>" + newLine +
            "  <y:ModelParameter>" + newLine +
            "    <y:SmartNodeLabelModelParameter labelRatioX=\"0.0\" labelRatioY=\"0.0\" nodeRatioX=\"0.0\" nodeRatioY=\"0.0\" offsetX=\"0.0\" offsetY=\"0.0\" upX=\"0.0\" upY=\"-1.0\"/>" +
            newLine +
            "  </y:ModelParameter>" + newLine +
            "</y:NodeLabel>" + newLine +
            " <y:Shape type=\"" + shape + "\"/>" + newLine +
            " </y:ShapeNode>" + newLine +
            "</data></node>" + newLine;
        return node;
    };

})(jQuery);
(function () {
    var MindFusionDiagram = function () { };
    MindFusionDiagram.prototype.buildAndDownload = function (nodes, links) {
        var graphString = "";
        graphString += getGraphHeader();
        /*
        $.each(nodes, function (i, node) {
            graphString += createNode(node);
        });
        $.each(links, function (i, link) {
            var linkId = "edge_" + (i + 1);
            graphString += createLink(linkId, link);
        });
        */

        graphString += getGraphHeader();
        var groupName = nodes[0].GroupName;
        var nGroup = generateNewGroup(groupName);

        var innerGrp = "";
        $.each(nodes, function (i, node) {
            innerGrp += getGroupNode(node);
        });
        var innerGraph = getGroupGraphNodes(innerGrp, groupName);
        var gId = 0;
        var newGrpId = groupName + "_" + gId;
        var innerGroupNode = "<node id='" + newGrpId + "' yfiles.foldertype='group'>" +
            nGroup + innerGraph + "</node>";
        graphString += innerGroupNode;
        $.each(nodes, function (i, node) {
            graphString += createNode(node);
        });
        $.each(links, function (i, link) {
            var linkId = "edge_" + (i + 1);
            graphString += createLink(linkId, link);
        });
        graphString += closeGraph();
        graphString = graphString.replace(/ /g, "%20");
        var fileName = nodes[0].Name;
        fileName = fileName + ".graphml";
        this.download(fileName, graphString);

    };

    MindFusionDiagram.prototype.download = function (fileName, graphString) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/graphml;charset=utf-8,' + graphString);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    this.MindFusionDiagram = new MindFusionDiagram();

}).call();