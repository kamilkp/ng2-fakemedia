import {
  Directive,
  ElementRef,
  NgZone,
  Renderer,
} from '@angular/core';

@Directive({
  selector: '[fakemedia]'
})

export class Fakemedia {
  attrname: string;
  onStableUnsubscriber: any;
  parsedRules: any;
  resizeHandler: any;
  prevWidth: number = -1;
  prevHeight: number = -1;
  stylesheet: any;
  constructor(private element: ElementRef, private zone: NgZone, private renderer: Renderer) {

  }
  ngOnInit() {
    this.attrname = _getRandomAttr(this.element.nativeElement);
    this.element.nativeElement.setAttribute(this.attrname, '');

    const rules = _getRelevantMediaRules();
    const parsedRules = _parseRules(rules);

    this.parsedRules = parsedRules;
    this.onStableUnsubscriber = this.zone.onStable.subscribe(this.refresh.bind(this));

    this.resizeHandler = () => void this.zone.run(() => {});
    window.addEventListener('resize', this.resizeHandler);
    this.refresh();
  }
  ngOnDestroy() {
    this.onStableUnsubscriber.unsubscribe();
    window.removeEventListener('resize', this.resizeHandler);

    if (this.stylesheet) {
      this.stylesheet.parentNode.removeChild(this.stylesheet);
    }
  }
  refresh() {
    if (this.prevHeight !== this.element.nativeElement.offsetHeight || this.prevWidth !== this.element.nativeElement.offsetWidth) {
      const old = this.stylesheet;
      const style = document.createElement('style');
      let cssText = '';

      this.parsedRules.forEach(rule => {
        if (rule.matches(this.element.nativeElement)) {
          const cssRules = Array.prototype.slice.call(rule.rule.cssRules || rule.rule.rules);
          cssRules.forEach(cssRule => {
            let [selectors, values] = cssRule.cssText.split('{');
            selectors = selectors.trim() + `[${this.attrname}] `;
            cssText += `\n${selectors}{${values}`;
          });
        }
      });

      style.innerHTML = cssText;
      this.stylesheet = style;

      if (old) {
        document.head.replaceChild(this.stylesheet, old);
      } else {
        document.head.appendChild(this.stylesheet);
      }

      this.prevHeight = this.element.nativeElement.offsetHeight;
      this.prevWidth = this.element.nativeElement.offsetWidth;
    }

    const children = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('*'));
    children.forEach(child => {
      this.renderer.setElementAttribute(child, this.attrname, '');
    });
  }
}

function _getRandomAttr(element) {
  return 'fakemedia-' + Math.floor(Date.now() / (Math.random()*1000));
}

function _getRelevantMediaRules() {
  const mediaRules = [];
  const stylesheets = Array.prototype.slice.call(document.styleSheets);
  stylesheets.forEach((ss, styleSheetIndex) => {
    try {
      if (ss.cssRules || ss.rules) {
        const rules = Array.prototype.slice.call(ss.cssRules || ss.rules); // ie
        rules.forEach((rule, ruleIndex) => {
          if ('media' in rule) {
            if (/fakemedia/.test(rule.media.mediaText) || /unknown/.test(rule.media.mediaText)) {
              mediaRules.push(rule);
            }
          }
        });
      }
    } catch (exception) {
      // swallow SecurityError exceptions on firefox when accessing
      // a cross-domain stylesheet e.g. google fonts
    }
  });

  return mediaRules;
}

function _parseRules(rules) {
  return rules.map(rule => {
    const className = rule.media.mediaText.replace(/[^\w\d_]/g, '_')
    return {
      rule,
      className,
      matches(element) {
        // const mediaArray = Array.prototype.slice.call(rule.media);

        const mediaArray = [];
        for (let i = 0; i < rule.media.length; i++) {
          mediaArray.push(rule.media.item(i));
        }

        return mediaArray.some(mediaRule => {
          if (mediaRule === 'fakemedia' || mediaRule === 'unknown') {
            return false; // false is neutral for the .some call (OR operator)
          }

          const parts = mediaRule.split('and').map(c => c.trim());
          return parts.every(condition => {
            if (condition === 'fakemedia' || condition === 'unknown') {
              return true; // true is neutral for the .every call (AND operator)
            }

            condition = condition.replace(/^\(/, '').replace(/\)$/, '');
            const matchArray = condition.match(/^(\w+)-(\w+)\s*:\s*(\d+)px$/);
            const [matchedText, modifier, _layoutProperty, _threshold] = matchArray;

            const threshold = Number(_threshold);
            const layoutProperty = _layoutProperty === 'width' ? 'Width' : _layoutProperty === 'height' ? 'Height' : null;
            if (layoutProperty === null) {
              throw new Error('[fakemedia] layout property should be either "width" or "height". Was ' + _layoutProperty);
            }

            if (modifier === 'max') {
              return element[`offset${layoutProperty}`] <= threshold;
            } else if (modifier === 'min') {
              return element[`offset${layoutProperty}`] >= threshold;
            } else {
              throw new Error('[fakemedia] modifier should be either "max" or "min". Was ' + modifier);
            }
          });
        });
      }
    }
  });
}

function _getStylesheet(attr, rules) {
  let newCssText = ''
  rules.forEach(rule => {
    const cssRules = Array.prototype.slice.call(rule.rule.cssRules || rule.rule.rules);
    cssRules.forEach(cssRule => {
      newCssText += `\n.${rule.className}[${attr}] ${cssRule.cssText}`;
    });
  });

  const style = document.createElement('style');
  style.innerHTML = newCssText;

  return style;
}