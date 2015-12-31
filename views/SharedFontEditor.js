function SharedFontEditor() {
    BaseTemplatedWidget.call(this);
    Pencil.registerSharedEditor(this);
}
__extend(BaseTemplatedWidget, SharedFontEditor);
SharedFontEditor.PROPERTY_NAME = "textFont";

SharedFontEditor.prototype.setup = function () {
    //grab control references
    /*this.underlineButton = document.getElementById("edUnderlineButton");
    this.strikeButton = document.getElementById("edStrikeButton");*/
    this.fontCombo.setDisabled(true);
    this.pixelFontSize.disabled = true;
    this.boldButton.disabled = true;
    this.italicButton.disabled = true;
    this.formatPainterButton.disabled = true;
    this.disabledEditor = true;

    this.fontCombo.renderer = function (font) {
        return font;
    };
    this.fontCombo.decorator = function (node, font) {
        node.style.fontFamily = "'" + font + "'";
    };

    var localFonts = Local.getInstalledFonts();
    var items = localFonts;
    this.fontCombo.setItems(items);

    var thiz = this;
    this.fontCombo.addEventListener("p:ItemSelected", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.family = thiz.fontCombo.getSelectedItem();
        thiz._applyValue();
    }, false);

    this.pixelFontSize.addEventListener("click", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.size = thiz.pixelFontSize.value + "px";
        thiz._applyValue();
    }, false);
    this.pixelFontSize.addEventListener("keyup", function(event) {
        if (event.keyCode == 13 || event.keyCode == 10) {
            if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
            thiz.font.size = thiz.pixelFontSize.value + "px";
            thiz._applyValue();
        }
    }, false);

    this.boldButton.addEventListener("click", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        var checked = false;
        if (thiz.boldButton.hasAttribute("checked") && thiz.boldButton.getAttribute("checked") == "true") {
            thiz.boldButton.removeAttribute("checked");
        } else {
            thiz.boldButton.setAttribute("checked", "true");
            checked = true;
        }
        thiz.font.weight = checked ? "bold" : "normal";
        thiz._applyValue();
    }, false);

    this.italicButton.addEventListener("click", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        var checked = false;
        if (thiz.italicButton.hasAttribute("checked") && thiz.italicButton.getAttribute("checked") == "true") {
            thiz.italicButton.removeAttribute("checked");
        } else {
            thiz.italicButton.setAttribute("checked", "true");
            checked = true;
        }

        thiz.font.style = checked ? "italic" : "normal";
        thiz._applyValue();
    }, false);

    this.formatPainterButton.addEventListener("click", function (event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        if (thiz.formatPainterButton.setAttribute) {
            thiz.formatPainterButton.setAttribute("checked", "true");
        }
        Pencil.activeCanvas.beginFormatPainter();
    }, false);

    /*
    this.underlineButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.decor = thiz.underlineButton.checked ? "underline" : "none";
        thiz._applyValue();
    }, false);

    this.strikeButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.strike = thiz.strikeButton.checked ? "strikethrough" : "none";
        thiz._applyValue();
    }, false);*/

};

SharedFontEditor.prototype.isDisabled = function () {
    return this.disabledEditor;
};

SharedFontEditor.prototype._applyValue = function () {
    var thiz = this;
    Pencil.activeCanvas.run(function() {
        this.setProperty(SharedFontEditor.PROPERTY_NAME, thiz.font);
    }, this.target, Util.getMessage("action.apply.properties.value"))
};
SharedFontEditor.prototype.attach = function (target) {
    this.target = target;
    this.font = target.getProperty(SharedFontEditor.PROPERTY_NAME, "any");
    if (!this.font)  {
        this.detach();
        return;
    }
    //
    this.fontCombo.setDisabled(false);
    this.pixelFontSize.disabled = false;
    this.boldButton.disabled = false;
    this.italicButton.disabled = false;
    var formatPainter = Pencil.activeCanvas && Pencil.activeCanvas.beginFormatPainter && target && (target.constructor == Group || target.constructor == Shape);
    this.formatPainterButton.disabled = !formatPainter;
    this.disabledEditor = false;
    // /*this.underlineButton.disabled = false;
    // this.strikeButton.disabled = false;*/
    //
    // //set the value
    if (Local.isFontExisting(this.font.family)) {
        this.fontCombo.selectItem(this.font.family);
    } else {
        var families = this.font.getFamilies();
        for (var i = 0; i < families.length; i ++) {
            var f = families[i];
            if (Local.isFontExisting(f)) {
                this.fontCombo.selectItem(f);
                break;
            }
        }
    }
    //
    if (this.font.size.match(/^([0-9]+)[^0-9]*$/)) {
        this.pixelFontSize.value = RegExp.$1;
    }

    if (this.font.weight == "bold") {
        this.boldButton.setAttribute("checked", "true");
    } else {
        this.boldButton.removeAttribute("checked");
    }

    if (this.font.style == "italic") {
        this.italicButton.setAttribute("checked", "true");
    } else {
        this.italicButton.removeAttribute("checked");
    }

    /*this.underlineButton.checked = (this.font.decor == "underline");
    this.strikeButton.checked = (this.font.decor == "strikethrough");*/
};
SharedFontEditor.prototype.detach = function () {
    this.fontCombo.setDisabled(true);
    this.pixelFontSize.disabled = true;
    this.boldButton.disabled = true;
    this.italicButton.disabled = true;
    this.formatPainterButton.disabled = true;
    this.disabledEditor = true;
    /*this.underlineButton.disabled = true;
    this.strikeButton.disabled = true;*/

    this.target = null;
    this.font = null;
};
SharedFontEditor.prototype.invalidate = function () {
    if (!this.target) {
        this.detach();
    } else {
        this.attach(this.target);
    }
}
