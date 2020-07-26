function Hilitor(id, tag) {
    var targetNode = document.getElementById(id) || document.body;
    var hiliteTag = tag || "EM";
    var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
    var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
    var wordColor = [];
    var colorIdx = 0;
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
        if (!matchRegex) return;
        if (skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.hiliteWords(node.childNodes[i]);
        }
        if (node.nodeType === 3 || node.nodeType === 1) { // NODE_TEXT
            var nv; var regs;
            if ((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
                if (!wordColor[regs[0].toLowerCase()]) {
                    wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
                }
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
            if (el.firstChild === null || typeof el.firstChild === 'undefined') break;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };

    this.apply = function (input) {
        this.hitCount = 0;
        this.currHitIdx = 0;
        // this.remove();
        if (input === undefined || !input) return;
        if (this.setRegex(input)) {
            this.hiliteWords(targetNode);
            this.hits = $("#" + id + " em");
            if (this.hits.length > 0) {
                this.hits[0].scrollIntoView();
                this.hits[0].style.backgroundColor = "#a0ffff";
            }
        }
        /*
        var lines = input.split(',');
        for (var i = 0; i < lines.length; i++) {
            if (this.setRegex(lines[i])) {
                this.hiliteWords(targetNode);
                this.hits = $("#" + id + " em");
                if (this.hits.length > 0) {
                    this.hits[0].scrollIntoView();
                    this.hits[0].style.backgroundColor = "#a0ffff";
                }
            }
        }
        */
    };

    this.nextHit = function () {
        if (this.currHitIdx < this.hits.length - 1) {
            this.currHitIdx++;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx - 1].style.backgroundColor = "#ff6";
            currHit.scrollIntoView();
        }
    };

    this.prevHit = function () {
        if (this.currHitIdx !== 0) {
            this.currHitIdx--;
            var currHit = this.hits[this.currHitIdx];
            currHit.style.backgroundColor = "#a0ffff";
            this.hits[this.currHitIdx + 1].style.backgroundColor = "#ff6";
            currHit.scrollIntoView();
        }
    }
}


