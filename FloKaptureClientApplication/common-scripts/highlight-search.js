// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
function HighlightSearch(id, tag) {
    var targetNodeId = id;
    var targetNode = document.getElementById(id) || document.body;
    var hiliteTag = tag || "EM";
    var matchRegex = "";

    this.setMatchType = function (type) {
        switch (type) {
        case "left":
            this.openLeft = false;
            this.openRight = true;
            break;
        case "right":
            this.openLeft = true;
            this.openRight = false;
            break;
        case "open":
            this.openLeft = this.openRight = true;
            break;
        default:
            this.openLeft = this.openRight = false;
        }
    };

    this.setRegex = function (input) {
        input = input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        if (input) {
            var re = "(" + input + ")";
            if (!this.openLeft) re = "\\b" + re;
            if (!this.openRight) re = re + "\\b";
            matchRegex = new RegExp(re, "i");
            return true;
        }
        return false;
    };

    this.getRegex = function () {
        var retval = matchRegex.toString();
        retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
        retval = retval.replace(/\|/g, " ");
        return retval;
    };

    this.hiliteWords = function (node) {
        if (node === undefined || !node) return;
        if (node.nodeName === "EM") return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i]);
        }
        if (node.nodeType === 3) { // NODE_TEXT
            var nv, regs;
            if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
                var match = document.createElement(hiliteTag);
                match.appendChild(document.createTextNode(regs[0]));
                match.style.backgroundColor = "#ff6";
                match.style.fontStyle = "inherit";
                match.style.color = "#000";

                var after = node.splitText(regs.index);
                after.nodeValue = after.nodeValue.substring(regs[0].length);
                node.parentNode.insertBefore(match, after);
                this.hitCount++;
            }
        };
    };

    this.remove = function () {
        var arr = document.getElementsByTagName(hiliteTag);
        var el;
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            if (el.firstChild !== null) {
                parent.replaceChild(el.firstChild, el);
                parent.normalize();
            }
        }
    };

    this.apply = function (input) {
        this.hitCount = 0;
        this.currHitIdx = 0;
        this.remove();
        if (input === undefined || !input) return;
        this.setMatchType("open");
        if (this.setRegex(input)) {
            this.hiliteWords(targetNode);
            this.hits = $("#" + targetNodeId + " em");
            if (this.hits.length > 0) {
                this.hits[0].style.backgroundColor = "#a0ffff";
            }
        }
    };

    this.hiliteComments = function (codeType) {
        this.remove();
        switch (codeType) {
        case "9": //cobol
            matchRegex = new RegExp('^.{6}[*/].*\n', "im");
            break;
        case "4": //cobol JCL
            matchRegex = new RegExp('^.{2}[*/].*\n', "im");
            break;
        case "31": //adbas
        case "26":
        case "30":
            matchRegex = new RegExp('^.{4}[*/].*\n|/\\*.*\n|^.{4}[0-9]{4}[*].*\n', "im");
            break;
        default:
            return;
        }
        this.hiliteWords(targetNode);
    }

    this.hiliteExpandedSource = function (codeType) {
        this.remove();
        switch (codeType) {
        case "9":
            var re1 = '(#)'; // Any Single Character 1
            var re2 = '(\\$)'; // Any Single Character 2
            var re3 = '(#)'; // Any Single Character 3
            var re4 = '(\\$)'; // Any Single Character 4
            var re5 = '(#)'; // Any Single Character 5
            var re6 = '(\\$)'; // Any Single Character 6
            var re7 = '(START)'; // Word 1
            var re8 = '(#)'; // Any Single Character 7
            var re9 = '(\\$)'; // Any Single Character 8
            var re10 = '(#)'; // Any Single Character 9
            var re11 = '(\\$)'; // Any Single Character 10
            var re12 = '(#)'; // Any Single Character 11
            matchRegex = new RegExp(re1 + re2 + re3 + re4 + re5 + re6 + re7 + re8 + re9 + re10 + re11 + re12, ["i"]);
            break;
        default:
            return;
        }
        this.hiliteWords(targetNode);
    }

    this.nextHit = function () {
        if (this.currHitIdx < this.hits.length - 1) {
            this.currHitIdx++;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx - 1].style.backgroundColor = "#ff6";
            // currHit.scrollIntoView();
        }
    };

    this.prevHit = function () {
        if (this.currHitIdx !== 0) {
            this.currHitIdx--;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx + 1].style.backgroundColor = "#ff6";
            // currHit.scrollIntoView();
        }
    }
}

$(document).ready(function () {

});
