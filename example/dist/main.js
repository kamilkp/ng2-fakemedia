webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	var platform_browser_dynamic_1 = __webpack_require__(10);
	var main_component_1 = __webpack_require__(345);
	__webpack_require__(347);
	platform_browser_dynamic_1.bootstrap(main_component_1.MainComponent);


/***/ },

/***/ 345:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(20);
	var fakemedia_directive_1 = __webpack_require__(346);
	var MainComponent = (function () {
	    function MainComponent(zone) {
	        this.zone = zone;
	    }
	    MainComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        window.addEventListener('resize', function () {
	            _this.zone.run(function () { });
	        });
	    };
	    MainComponent.prototype.getWidth = function (element) {
	        return element.offsetWidth;
	    };
	    MainComponent = __decorate([
	        core_1.Component({
	            selector: 'main-component',
	            directives: [fakemedia_directive_1.Fakemedia],
	            template: "\n    <div fakemedia #first>\n      div 1 width: {{ getWidth(first) }}\n    </div>\n    <div #second>\n      div 2 width: {{ getWidth(second) }}\n    </div>\n  "
	        }), 
	        __metadata('design:paramtypes', [core_1.NgZone])
	    ], MainComponent);
	    return MainComponent;
	}());
	exports.MainComponent = MainComponent;


/***/ },

/***/ 346:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(20);
	var fakemediaStyleElement = null;
	var parsedRules = null;
	var Fakemedia = (function () {
	    function Fakemedia(element, zone, renderer) {
	        this.element = element;
	        this.zone = zone;
	        this.renderer = renderer;
	        this.prevWidth = -1;
	        this.prevHeight = -1;
	    }
	    Fakemedia.prototype.ngOnInit = function () {
	        // this.attrname = _getRandomAttr(this.element.nativeElement);
	        // this.element.nativeElement.setAttribute(this.attrname, '');
	        var _this = this;
	        if (!fakemediaStyleElement) {
	            _init();
	        }
	        this.onStableUnsubscriber = this.zone.onStable.subscribe(this.refresh.bind(this));
	        this.resizeHandler = function () { return void _this.zone.run(function () { }); };
	        window.addEventListener('resize', this.resizeHandler);
	        this.refresh();
	    };
	    Fakemedia.prototype.ngOnDestroy = function () {
	        this.onStableUnsubscriber.unsubscribe();
	        window.removeEventListener('resize', this.resizeHandler);
	        if (this.stylesheet) {
	            this.stylesheet.parentNode.removeChild(this.stylesheet);
	        }
	    };
	    Fakemedia.prototype.refresh = function () {
	        var _this = this;
	        if (!parsedRules) {
	            return;
	        }
	        if (this.prevHeight !== this.element.nativeElement.offsetHeight || this.prevWidth !== this.element.nativeElement.offsetWidth) {
	            var attrsDict_1 = {};
	            parsedRules.forEach(function (rule) {
	                attrsDict_1[rule.attrName] = rule.matches(_this.element.nativeElement);
	            });
	            this.prevHeight = this.element.nativeElement.offsetHeight;
	            this.prevWidth = this.element.nativeElement.offsetWidth;
	            var elements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('*'));
	            elements.unshift(this.element.nativeElement);
	            elements.forEach(function (element) {
	                Object.keys(attrsDict_1).forEach(function (attrName) {
	                    if (attrsDict_1[attrName]) {
	                        element.setAttribute(attrName, '');
	                    }
	                    else {
	                        element.removeAttribute(attrName);
	                    }
	                });
	            });
	        }
	    };
	    Fakemedia = __decorate([
	        core_1.Directive({
	            selector: '[fakemedia]'
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, core_1.Renderer])
	    ], Fakemedia);
	    return Fakemedia;
	}());
	exports.Fakemedia = Fakemedia;
	function _init() {
	    var rules = _getRelevantMediaRules();
	    parsedRules = _parseRules(rules);
	    var style = document.createElement('style');
	    var cssText = '';
	    parsedRules.forEach(function (parsedRule) {
	        var cssRules = Array.prototype.slice.call(parsedRule.rule.cssRules || parsedRule.rule.rules);
	        cssRules.forEach(function (cssRule) {
	            var _a = cssRule.cssText.split('{'), selectors = _a[0], values = _a[1];
	            selectors = selectors.trim() + ("[" + parsedRule.attrName + "] ");
	            cssText += "\n" + selectors + "{" + values;
	        });
	    });
	    style.innerHTML = cssText;
	    document.head.appendChild(style);
	    fakemediaStyleElement = style;
	}
	function _getRandomAttr(element) {
	    return 'fakemedia-' + Math.floor(Date.now() / (Math.random() * 1000));
	}
	function _getRelevantMediaRules() {
	    var mediaRules = [];
	    var stylesheets = Array.prototype.slice.call(document.styleSheets);
	    stylesheets.forEach(function (ss, styleSheetIndex) {
	        try {
	            if (ss.cssRules || ss.rules) {
	                var rules = Array.prototype.slice.call(ss.cssRules || ss.rules); // ie
	                rules.forEach(function (rule, ruleIndex) {
	                    if ('media' in rule) {
	                        if (/fakemedia/.test(rule.media.mediaText) || /unknown/.test(rule.media.mediaText)) {
	                            mediaRules.push(rule);
	                        }
	                    }
	                });
	            }
	        }
	        catch (exception) {
	        }
	    });
	    return mediaRules;
	}
	function _parseRules(rules) {
	    return rules.map(function (rule) {
	        var attrName = rule.media.mediaText.replace(/[^\w\d_]/g, '_');
	        return {
	            rule: rule,
	            attrName: attrName,
	            matches: function (element) {
	                // const mediaArray = Array.prototype.slice.call(rule.media);
	                var mediaArray = [];
	                for (var i = 0; i < rule.media.length; i++) {
	                    mediaArray.push(rule.media.item(i));
	                }
	                return mediaArray.some(function (mediaRule) {
	                    if (mediaRule === 'fakemedia' || mediaRule === 'unknown') {
	                        return false; // false is neutral for the .some call (OR operator)
	                    }
	                    var parts = mediaRule.split('and').map(function (c) { return c.trim(); });
	                    return parts.every(function (condition) {
	                        if (condition === 'fakemedia' || condition === 'unknown') {
	                            return true; // true is neutral for the .every call (AND operator)
	                        }
	                        condition = condition.replace(/^\(/, '').replace(/\)$/, '');
	                        var matchArray = condition.match(/^(\w+)-(\w+)\s*:\s*(\d+)px$/);
	                        var matchedText = matchArray[0], modifier = matchArray[1], _layoutProperty = matchArray[2], _threshold = matchArray[3];
	                        var threshold = Number(_threshold);
	                        var layoutProperty = _layoutProperty === 'width' ? 'Width' : _layoutProperty === 'height' ? 'Height' : null;
	                        if (layoutProperty === null) {
	                            throw new Error('[fakemedia] layout property should be either "width" or "height". Was ' + _layoutProperty);
	                        }
	                        if (modifier === 'max') {
	                            return element[("offset" + layoutProperty)] <= threshold;
	                        }
	                        else if (modifier === 'min') {
	                            return element[("offset" + layoutProperty)] >= threshold;
	                        }
	                        else {
	                            throw new Error('[fakemedia] modifier should be either "max" or "min". Was ' + modifier);
	                        }
	                    });
	                });
	            }
	        };
	    });
	}
	function _getStylesheet(attr, rules) {
	    var newCssText = '';
	    rules.forEach(function (rule) {
	        var cssRules = Array.prototype.slice.call(rule.rule.cssRules || rule.rule.rules);
	        cssRules.forEach(function (cssRule) {
	            newCssText += "\n." + rule.attrName + "[" + attr + "] " + cssRule.cssText;
	        });
	    });
	    var style = document.createElement('style');
	    style.innerHTML = newCssText;
	    return style;
	}


/***/ },

/***/ 347:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

});