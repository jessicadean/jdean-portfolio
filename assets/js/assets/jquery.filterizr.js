﻿	! function(t, i) {
    "use strict";
    if (!i) throw new Error("Filterizr requires jQuery to work.");
    var r = function(t) {
        this.init(t)
    };
    r.prototype = {
        init: function(t) {
            this.root = {
                x: 0,
                y: 0,
                w: t
            }
        },
        fit: function(t) {
            var i, r, e, n = t.length,
                o = n > 0 ? t[0].h : 0;
            for (this.root.h = o, i = 0; n > i; i++) e = t[i], (r = this.findNode(this.root, e.w, e.h)) ? e.fit = this.splitNode(r, e.w, e.h) : e.fit = this.growDown(e.w, e.h)
        },
        findNode: function(t, i, r) {
            return t.used ? this.findNode(t.right, i, r) || this.findNode(t.down, i, r) : i <= t.w && r <= t.h ? t : null
        },
        splitNode: function(t, i, r) {
            return t.used = !0, t.down = {
                x: t.x,
                y: t.y + r,
                w: t.w,
                h: t.h - r
            }, t.right = {
                x: t.x + i,
                y: t.y,
                w: t.w - i,
                h: r
            }, t
        },
        growDown: function(t, i) {
            var r;
            return this.root = {
                used: !0,
                x: 0,
                y: 0,
                w: this.root.w,
                h: this.root.h + i,
                down: {
                    x: 0,
                    y: this.root.h,
                    w: this.root.w,
                    h: i
                },
                right: this.root
            }, (r = this.findNode(this.root, t, i)) ? this.splitNode(r, t, i) : null
        }
    }, i.fn.filterizr = function() {
        var t = this,
            r = arguments;
        if (t._fltr || (t._fltr = i.fn.filterizr.prototype.init(t.selector, "object" == typeof r[0] ? r[0] : void 0)), "string" == typeof r[0]) {
            if (r[0].lastIndexOf("_") > -1) throw new Error("Filterizr error: You cannot call private methods");
            if ("function" != typeof t._fltr[r[0]]) throw new Error("Filterizr error: There is no such function");
            t._fltr[r[0]](r[1], r[2])
        }
        return t
    }, i.fn.filterizr.prototype = {
        init: function(t, r) {
            var e = i(t).extend(i.fn.filterizr.prototype);
            return e.options = {
                animationDuration: .5,
                callbacks: {
                    onFilteringStart: function() {},
                    onFilteringEnd: function() {},
                    onShufflingStart: function() {},
                    onShufflingEnd: function() {},
                    onSortingStart: function() {},
                    onSortingEnd: function() {}
                },
                delay: 0,
                delayMode: "progressive",
                easing: "ease-out",
                filter: "all",
                filterOutCss: {
                    opacity: 0,
                    transform: "scale(0.5)"
                },
                filterInCss: {
                    opacity: 1,
                    transform: "scale(1)"
                },
                layout: "sameSize",
                selector: "string" == typeof t ? t : ".filtr-container",
                setupControls: !0
            }, 0 === arguments.length && (t = e.options.selector, r = e.options), 1 === arguments.length && "object" == typeof arguments[0] && (r = arguments[0]), r && e.setOptions(r), e.css({
                padding: 0,
                position: "relative"
            }), e._lastCategory = 0, e._isAnimating = !1, e._isShuffling = !1, e._isSorting = !1, e._mainArray = e._getFiltrItems(), e._subArrays = e._makeSubarrays(), e._activeArray = e._getCollectionByFilter(e.options.filter), e._toggledCategories = {}, e._typedText = i("input[data-search]").val() || "", e._uID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                var i = 16 * Math.random() | 0,
                    r = "x" == t ? i : 3 & i | 8;
                return r.toString(16)
            }), e._setupEvents(), e.options.setupControls && e._setupControls(), e.filter(e.options.filter), e
        },
        filter: function(t) {
            var i = this,
                r = i._getCollectionByFilter(t);
            i.options.filter = t, i.trigger("filteringStart"), i._handleFiltering(r), i._isSearchActivated() && i.search(i._typedText)
        },
        toggleFilter: function(t) {
            var i = this,
                r = [];
            i.trigger("filteringStart"), t && (i._toggledCategories[t] ? delete i._toggledCategories[t] : i._toggledCategories[t] = !0), i._multifilterModeOn() ? (r = i._makeMultifilterArray(), i._handleFiltering(r), i._isSearchActivated() && i.search(i._typedText)) : (i.filter("all"), i._isSearchActivated() && i.search(i._typedText))
        },
        search: function(t) {
            var i = this,
                r = i._multifilterModeOn() ? i._makeMultifilterArray() : i._getCollectionByFilter(i.options.filter),
                e = [],
                n = 0;
            if (i._isSearchActivated())
                for (n = 0; n < r.length; n++) {
                    var o = r[n].text().toLowerCase().indexOf(t.toLowerCase()) > -1;
                    o && e.push(r[n])
                }
            if (e.length > 0) i._handleFiltering(e);
            else if (i._isSearchActivated())
                for (n = 0; n < i._activeArray.length; n++) i._activeArray[n]._filterOut();
            else i._handleFiltering(r)
        },
        shuffle: function() {
            var t = this;
            t._isAnimating = !0, t._isShuffling = !0, t.trigger("shufflingStart"), t._mainArray = t._fisherYatesShuffle(t._mainArray), t._subArrays = t._makeSubarrays();
            var i = t._multifilterModeOn() ? t._makeMultifilterArray() : t._getCollectionByFilter(t.options.filter);
            t._isSearchActivated() ? t.search(t._typedText) : t._placeItems(i)
        },
        sort: function(t, i) {
            var r = this;
            t = t || "domIndex", i = i || "asc", r._isAnimating = !0, r._isSorting = !0, r.trigger("sortingStart");
            var e = "domIndex" !== t && "sortData" !== t && "w" !== t && "h" !== t;
            if (e)
                for (var n = 0; n < r._mainArray.length; n++) r._mainArray[n][t] = r._mainArray[n].data(t);
            r._mainArray.sort(r._comparator(t, i)), r._subArrays = r._makeSubarrays();
            var o = r._multifilterModeOn() ? r._makeMultifilterArray() : r._getCollectionByFilter(r.options.filter);
            r._isSearchActivated() ? r.search(r._typedText) : r._placeItems(o)
        },
        setOptions: function(t) {
            var i = this,
                r = 0;
            for (var e in t) i.options[e] = t[e];
            if (i._mainArray && (t.animationDuration || t.delay || t.easing || t.delayMode))
                for (r = 0; r < i._mainArray.length; r++) i._mainArray[r].css("transition", "all " + i.options.animationDuration + "s " + i.options.easing + " " + i._mainArray[r]._calcDelay() + "ms");
            t.callbacks && (t.callbacks.onFilteringStart || (i.options.callbacks.onFilteringStart = function() {}), t.callbacks.onFilteringEnd || (i.options.callbacks.onFilteringEnd = function() {}), t.callbacks.onShufflingStart || (i.options.callbacks.onShufflingStart = function() {}), t.callbacks.onShufflingEnd || (i.options.callbacks.onShufflingEnd = function() {}), t.callbacks.onSortingStart || (i.options.callbacks.onSortingStart = function() {}), t.callbacks.onSortingEnd || (i.options.callbacks.onSortingEnd = function() {})), i.options.filterInCss.transform || (i.options.filterInCss.transform = "translate3d(0,0,0)"), i.options.filterOutCss.transform || (i.options.filterOutCss.transform = "translate3d(0,0,0)")
        },
        _getFiltrItems: function() {
            var t = this,
                r = i(t.find(".filtr-item")),
                n = [];
            return i.each(r, function(r, o) {
                var a = i(o).extend(e)._init(r, t);
                n.push(a)
            }), n
        },
        _makeSubarrays: function() {
            for (var t = this, i = [], r = 0; r < t._lastCategory; r++) i.push([]);
            for (r = 0; r < t._mainArray.length; r++)
                if ("object" == typeof t._mainArray[r]._category)
                    for (var e = t._mainArray[r]._category.length, n = 0; e > n; n++) i[t._mainArray[r]._category[n] - 1].push(t._mainArray[r]);
                else i[t._mainArray[r]._category - 1].push(t._mainArray[r]);
            return i
        },
        _makeMultifilterArray: function() {
            for (var t = this, i = [], r = {}, e = 0; e < t._mainArray.length; e++) {
                var n = t._mainArray[e],
                    o = !1,
                    a = n.domIndex in r == !1;
                if (Array.isArray(n._category)) {
                    for (var s = 0; s < n._category.length; s++)
                        if (n._category[s] in t._toggledCategories) {
                            o = !0;
                            break
                        }
                } else n._category in t._toggledCategories && (o = !0);
                a && o && (r[n.domIndex] = !0, i.push(n))
            }
            return i
        },
        _setupControls: function() {
            var t = this;
            i("*[data-filter]").click(function() {
                var r = i(this).data("filter");
                t.options.filter !== r && t.filter(r)
            }), i("*[data-multifilter]").click(function() {
                var r = i(this).data("multifilter");
                "all" === r ? (t._toggledCategories = {}, t.filter("all")) : t.toggleFilter(r)
            }), i("*[data-shuffle]").click(function() {
                t.shuffle()
            }), i("*[data-sortAsc]").click(function() {
                var r = i("*[data-sortOrder]").val();
                t.sort(r, "asc")
            }), i("*[data-sortDesc]").click(function() {
                var r = i("*[data-sortOrder]").val();
                t.sort(r, "desc")
            }), i("input[data-search]").keyup(function() {
                t._typedText = i(this).val(), t._delayEvent(function() {
                    t.search(t._typedText)
                }, 250, t._uID)
            })
        },
        _setupEvents: function() {
            var r = this;
            i(t).resize(function() {
                r._delayEvent(function() {
                    r.trigger("resizeFiltrContainer")
                }, 250, r._uID)
            }), r.on("resizeFiltrContainer", function() {
                r._multifilterModeOn() ? r.toggleFilter() : r.filter(r.options.filter)
            }).on("filteringStart", function() {
                r.options.callbacks.onFilteringStart()
            }).on("filteringEnd", function() {
                r.options.callbacks.onFilteringEnd()
            }).on("shufflingStart", function() {
                r._isShuffling = !0, r.options.callbacks.onShufflingStart()
            }).on("shufflingEnd", function() {
                r.options.callbacks.onShufflingEnd(), r._isShuffling = !1
            }).on("sortingStart", function() {
                r._isSorting = !0, r.options.callbacks.onSortingStart()
            }).on("sortingEnd", function() {
                r.options.callbacks.onSortingEnd(), r._isSorting = !1
            })
        },
        _calcItemPositions: function() {
            var t = this,
                e = t._activeArray,
                n = 0,
                o = Math.round(t.width() / t.find(".filtr-item").outerWidth()),
                a = 0,
                s = e[0].outerWidth(),
                l = 0,
                f = 0,
                u = 0,
                c = 0,
                g = 0,
                _ = [];
            if ("packed" === t.options.layout) {
                i.each(t._activeArray, function(t, i) {
                    i._updateDimensions()
                });
                var h = new r(t.outerWidth());
                for (h.fit(t._activeArray), c = 0; c < e.length; c++) _.push({
                    left: e[c].fit.x,
                    top: e[c].fit.y
                });
                n = h.root.h
            }
            if ("horizontal" === t.options.layout)
                for (a = 1, c = 1; c <= e.length; c++) s = e[c - 1].outerWidth(), l = e[c - 1].outerHeight(), _.push({
                    left: f,
                    top: u
                }), f += s, l > n && (n = l);
            else if ("vertical" === t.options.layout) {
                for (c = 1; c <= e.length; c++) l = e[c - 1].outerHeight(), _.push({
                    left: f,
                    top: u
                }), u += l;
                n = u
            } else if ("sameHeight" === t.options.layout) {
                a = 1;
                var d = t.outerWidth();
                for (c = 1; c <= e.length; c++) {
                    s = e[c - 1].width();
                    var p = e[c - 1].outerWidth(),
                        y = 0;
                    e[c] && (y = e[c].width()), _.push({
                        left: f,
                        top: u
                    }), g = f + s + y, g > d ? (g = 0, f = 0, u += e[0].outerHeight(), a++) : f += p
                }
                n = a * e[0].outerHeight()
            } else if ("sameWidth" === t.options.layout) {
                for (c = 1; c <= e.length; c++) {
                    if (_.push({
                            left: f,
                            top: u
                        }), c % o === 0 && a++, f += s, u = 0, a > 0)
                        for (g = a; g > 0;) u += e[c - o * g].outerHeight(), g--;
                    c % o === 0 && (f = 0)
                }
                for (c = 0; o > c; c++) {
                    for (var m = 0, v = c; e[v];) m += e[v].outerHeight(), v += o;
                    m > n ? (n = m, m = 0) : m = 0
                }
            } else if ("sameSize" === t.options.layout) {
                for (c = 1; c <= e.length; c++) _.push({
                    left: f,
                    top: u
                }), f += s, c % o === 0 && (u += e[0].outerHeight(), f = 0);
                a = Math.ceil(e.length / o), n = a * e[0].outerHeight()
            }
            return t.css("height", n), _
        },
        _handleFiltering: function(t) {
            for (var i = this, r = i._getArrayOfUniqueItems(i._activeArray, t), e = 0; e < r.length; e++) r[e]._filterOut();
            i._activeArray = t, i._placeItems(t)
        },
        _multifilterModeOn: function() {
            var t = this;
            return Object.keys(t._toggledCategories).length > 0
        },
        _isSearchActivated: function() {
            var t = this;
            return t._typedText.length > 0
        },
        _placeItems: function(t) {
            var i = this;
            i._isAnimating = !0, i._itemPositions = i._calcItemPositions();
            for (var r = 0; r < t.length; r++) t[r]._filterIn(i._itemPositions[r])
        },
        _getCollectionByFilter: function(t) {
            var i = this;
            return "all" === t ? i._mainArray : i._subArrays[t - 1]
        },
        _makeDeepCopy: function(t) {
            var i = {};
            for (var r in t) i[r] = t[r];
            return i
        },
        _comparator: function(t, i) {
            return function(r, e) {
                return "asc" === i ? r[t] < e[t] ? -1 : r[t] > e[t] ? 1 : 0 : "desc" === i ? e[t] < r[t] ? -1 : e[t] > r[t] ? 1 : 0 : void 0
            }
        },
        _getArrayOfUniqueItems: function(t, i) {
            var r, e, n = [],
                o = {},
                a = i.length;
            for (r = 0; a > r; r++) o[i[r].domIndex] = !0;
            for (a = t.length, r = 0; a > r; r++) e = t[r], e.domIndex in o || n.push(e);
            return n
        },
        _delayEvent: function() {
            var t = {};
            return function(i, r, e) {
                if (null === e) throw Error("UniqueID needed");
                t[e] && clearTimeout(t[e]), t[e] = setTimeout(i, r)
            }
        }(),
        _fisherYatesShuffle: function(t) {
            for (var i, r, e = t.length; e;) r = Math.floor(Math.random() * e--), i = t[e], t[e] = t[r], t[r] = i;
            return t
        }
    };
    var e = {
        _init: function(t, i) {
            var r = this;
            return r._parent = i, r._category = r._getCategory(), r._lastPos = {}, r.domIndex = t, r.sortData = r.data("sort"), r.w = 0, r.h = 0, r._isFilteredOut = !0, r._filteringOut = !1, r._filteringIn = !1, r.css(i.options.filterOutCss).css({
                "-webkit-backface-visibility": "hidden",
                perspective: "1000px",
                "-webkit-perspective": "1000px",
                "-webkit-transform-style": "preserve-3d",
                position: "absolute",
                transition: "all " + i.options.animationDuration + "s " + i.options.easing + " " + r._calcDelay() + "ms"
            }), r.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                r._onTransitionEnd()
            }), r
        },
        _updateDimensions: function() {
            var t = this;
            t.w = t.outerWidth(), t.h = t.outerHeight()
        },
        _calcDelay: function() {
            var t = this,
                i = 0;
            return "progressive" === t._parent.options.delayMode ? i = t._parent.options.delay * t.domIndex : t.domIndex % 2 === 0 && (i = t._parent.options.delay), i
        },
        _getCategory: function() {
            var t = this,
                i = t.data("category");
            if ("string" == typeof i) {
                i = i.split(", ");
                for (var r = 0; r < i.length; r++) {
                    if (isNaN(parseInt(i[r]))) throw new Error("Filterizr: the value of data-category must be a number, starting from value 1 and increasing.");
                    parseInt(i[r]) > t._parent._lastCategory && (t._parent._lastCategory = parseInt(i[r]))
                }
            } else i > t._parent._lastCategory && (t._parent._lastCategory = i);
            return i
        },
        _onTransitionEnd: function() {
            var t = this;
            t._filteringOut ? (i(t).addClass("filteredOut"), t._isFilteredOut = !0, t._filteringOut = !1) : t._filteringIn && (t._isFilteredOut = !1, t._filteringIn = !1), t._parent._isAnimating && (t._parent._isShuffling ? t._parent.trigger("shufflingEnd") : t._parent._isSorting ? t._parent.trigger("sortingEnd") : t._parent.trigger("filteringEnd"), t._parent._isAnimating = !1)
        },
        _filterOut: function() {
            var t = this,
                i = t._parent._makeDeepCopy(t._parent.options.filterOutCss);
            i.transform += " translate3d(" + t._lastPos.left + "px," + t._lastPos.top + "px, 0)", t.css(i), t.css("pointer-events", "none"), t._filteringOut = !0
        },
        _filterIn: function(t) {
            var r = this,
                e = r._parent._makeDeepCopy(r._parent.options.filterInCss);
            i(r).removeClass("filteredOut"), r._filteringIn = !0, r._lastPos = t, r.css("pointer-events", "auto"), e.transform += " translate3d(" + t.left + "px," + t.top + "px, 0)", r.css(e)
        }
    }
}(this, jQuery);