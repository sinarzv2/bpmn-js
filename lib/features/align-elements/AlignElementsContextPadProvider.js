import {
  assign
} from 'min-dash';

import ICONS from './AlignElementsIcons';

/**
 * @typedef {import('diagram-js/lib/core/Canvas').default} Canvas
 * @typedef {import('diagram-js/lib/features/context-pad/ContextPad').default} ContextPad
 * @typedef {import('diagram-js/lib/features/popup-menu/PopupMenu').default} PopupMenu
 * @typedef {import('diagram-js/lib/i18n/translate/translate').default} Translate
 *
 * @typedef {import('../../model/Types').Element} Element
 * @typedef {import('diagram-js/lib/features/context-pad/ContextPad').ContextPadEntries} ContextPadEntries
 * @typedef {import('diagram-js/lib/features/context-pad/ContextPadProvider').default} ContextPadProvider
 */

var LOW_PRIORITY = 900;

/**
 * A provider for the `Align elements` context pad entry.
 *
 * @implements {ContextPadProvider}
 *
 * @param {ContextPad} contextPad
 * @param {PopupMenu} popupMenu
 * @param {Translate} translate
 * @param {Canvas} canvas
 */
export default function AlignElementsContextPadProvider(contextPad, popupMenu, translate, canvas) {

  contextPad.registerProvider(LOW_PRIORITY, this);

  this._contextPad = contextPad;
  this._popupMenu = popupMenu;
  this._translate = translate;
  this._canvas = canvas;
}

AlignElementsContextPadProvider.$inject = [
  'contextPad',
  'popupMenu',
  'translate',
  'canvas'
];

/**
 * @param {Element[]} elements
 *
 * @return {ContextPadEntries}
 */
AlignElementsContextPadProvider.prototype.getMultiElementContextPadEntries = function(elements) {
  var actions = {};

  if (this._isAllowed(elements)) {
    assign(actions, this._getEntries(elements));
  }

  return actions;
};

AlignElementsContextPadProvider.prototype._isAllowed = function(elements) {
  return !this._popupMenu.isEmpty(elements, 'align-elements');
};

AlignElementsContextPadProvider.prototype._getEntries = function() {
  var self = this;

  return {
    'more': {
      group: 'more',
      title: self._translate('More'),
      html: `<div class="entry">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="16" height="16" transform="translate(0.948242 0.5)" fill="transparent" style="mix-blend-mode:multiply"/>
          <path d="M8.94824 5.5C9.50053 5.5 9.94824 5.05228 9.94824 4.5C9.94824 3.94772 9.50053 3.5 8.94824 3.5C8.39596 3.5 7.94824 3.94772 7.94824 4.5C7.94824 5.05228 8.39596 5.5 8.94824 5.5Z" fill="white"/>
          <path d="M8.94824 9.5C9.50053 9.5 9.94824 9.05228 9.94824 8.5C9.94824 7.94772 9.50053 7.5 8.94824 7.5C8.39596 7.5 7.94824 7.94772 7.94824 8.5C7.94824 9.05228 8.39596 9.5 8.94824 9.5Z" fill="white"/>
          <path d="M8.94824 13.5C9.50053 13.5 9.94824 13.0523 9.94824 12.5C9.94824 11.9477 9.50053 11.5 8.94824 11.5C8.39596 11.5 7.94824 11.9477 7.94824 12.5C7.94824 13.0523 8.39596 13.5 8.94824 13.5Z" fill="white"/>
        </svg>
      </div>`,
      action: {
        click: function(event, target) {
          var position = self._getMenuPosition(target);

          assign(position, {
            cursor: {
              x: event.x,
              y: event.y
            }
          });

          self._popupMenu.open(target, 'align-elements', position, {
            orientation: 'horizontal'
          });
        }
      }
    }
  };

  return {
    'align-elements': {
      group: 'align-elements',
      title: self._translate('Align elements'),
      html: `<div class="entry">${ICONS['align']}</div>`,
      action: {
        click: function(event, target) {
          var position = self._getMenuPosition(target);

          assign(position, {
            cursor: {
              x: event.x,
              y: event.y
            }
          });

          self._popupMenu.open(target, 'align-elements', position);
        }
      }
    }
  };
};

AlignElementsContextPadProvider.prototype._getMenuPosition = function(elements) {
  var Y_OFFSET = 5;

  var pad = this._contextPad.getPad(elements).html;

  var padRect = pad.getBoundingClientRect();

  var pos = {
    x: padRect.left,
    y: padRect.top - 50
  };

  return pos;
};
