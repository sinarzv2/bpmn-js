import {
  assign
} from 'min-dash';

import { getDi } from '../../util/ModelUtil';

/**
 * @typedef {import('diagram-js/lib/features/palette/Palette').default} Palette
 * @typedef {import('diagram-js/lib/features/create/Create').default} Create
 * @typedef {import('diagram-js/lib/core/ElementFactory').default} ElementFactory
 * @typedef {import('../space-tool/BpmnSpaceTool').default} SpaceTool
 * @typedef {import('diagram-js/lib/features/lasso-tool/LassoTool').default} LassoTool
 * @typedef {import('diagram-js/lib/features/hand-tool/HandTool').default} HandTool
 * @typedef {import('diagram-js/lib/features/global-connect/GlobalConnect').default} GlobalConnect
 * @typedef {import('diagram-js/lib/i18n/translate/translate').default} Translate
 *
 * @typedef {import('diagram-js/lib/features/palette/Palette').PaletteEntries} PaletteEntries
 */

/**
 * A palette provider for BPMN 2.0 elements.
 *
 * @param {Palette} palette
 * @param {Create} create
 * @param {ElementFactory} elementFactory
 * @param {SpaceTool} spaceTool
 * @param {LassoTool} lassoTool
 * @param {HandTool} handTool
 * @param {GlobalConnect} globalConnect
 * @param {Translate} translate
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool,
    globalConnect, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];

/**
 * @return {PaletteEntries}
 */
PaletteProvider.prototype.getPaletteEntries = function() {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      globalConnect = this._globalConnect,
      translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        var di = getDi(shape);
        di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createSubprocess(event) {
    var subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true
    });

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess
    });

    create.start(event, [ subProcess, startEvent ], {
      hints: {
        autoSelect: [ subProcess ]
      }
    });
  }

  function createParticipant(event) {
    create.start(event, elementFactory.createParticipantShape());
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      html: `<div class="entry">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" transform="translate(0.948242)" fill="transparent" style="mix-blend-mode:multiply"/>
          <path d="M19.6982 8.25L18.6407 9.3075L20.5757 11.25H13.6982V4.3725L15.6407 6.3075L16.6982 5.25L12.9482 1.5L9.19824 5.25L10.2557 6.3075L12.1982 4.3725V11.25H5.32074L7.25574 9.3075L6.19824 8.25L2.44824 12L6.19824 15.75L7.25574 14.6925L5.32074 12.75H12.1982V19.6275L10.2557 17.6925L9.19824 18.75L12.9482 22.5L16.6982 18.75L15.6407 17.6925L13.6982 19.6275V12.75H20.5757L18.6407 14.6925L19.6982 15.75L23.4482 12L19.6982 8.25Z" fill="currentColor"/>
        </svg>
      </div>`,
      title: translate('Move canvas'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      html: `<div class="entry">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" transform="translate(0.948242)" fill="transparent" style="mix-blend-mode:multiply"/>
          <path d="M9.94824 4.5H6.94824V1.5H5.44824V4.5H2.44824V6H5.44824V9H6.94824V6H9.94824V4.5Z" fill="currentColor"/>
          <path d="M15.9482 4.5H12.9482V6H15.9482V4.5Z" fill="currentColor"/>
          <path d="M18.9482 4.5V6H21.9482V9H23.4482V6C23.4482 5.60218 23.2902 5.22064 23.0089 4.93934C22.7276 4.65804 22.3461 4.5 21.9482 4.5H18.9482Z" fill="currentColor"/>
          <path d="M6.94824 12H5.44824V15H6.94824V12Z" fill="currentColor"/>
          <path d="M6.94824 21V18H5.44824V21C5.44824 21.3978 5.60628 21.7794 5.88758 22.0607C6.16889 22.342 6.55042 22.5 6.94824 22.5H9.94824V21H6.94824Z" fill="currentColor"/>
          <path d="M23.4482 12H21.9482V15H23.4482V12Z" fill="currentColor"/>
          <path d="M15.9482 21H12.9482V22.5H15.9482V21Z" fill="currentColor"/>
          <path d="M21.9482 18V21H18.9482V22.5H21.9482C22.3461 22.5 22.7276 22.342 23.0089 22.0607C23.2902 21.7794 23.4482 21.3978 23.4482 21V18H21.9482Z" fill="currentColor"/>
        </svg>
      </div>`,
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      html: `<div class="entry">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" transform="translate(0.948242)" fill="transparent" style="mix-blend-mode:multiply"/>
          <path d="M23.4482 21H15.9482C15.5506 20.9995 15.1693 20.8414 14.8881 20.5602C14.6069 20.2789 14.4487 19.8977 14.4482 19.5V4.5C14.4487 4.10232 14.6069 3.72105 14.8881 3.43984C15.1693 3.15864 15.5506 3.00046 15.9482 3H23.4482V4.5H15.9482V19.5H23.4482V21Z" fill="currentColor"/>
          <path d="M9.94824 21H2.44824V19.5H9.94824V4.5H2.44824V3H9.94824C10.3459 3.00046 10.7272 3.15864 11.0084 3.43984C11.2896 3.72105 11.4478 4.10232 11.4482 4.5V19.5C11.4478 19.8977 11.2896 20.2789 11.0084 20.5602C10.7272 20.8414 10.3459 20.9995 9.94824 21Z" fill="currentColor"/>
          <path d="M19.6982 15.75L18.6377 14.6895L20.5772 12.75L15.9482 12.75L15.9482 11.25L20.5772 11.25L18.6377 9.3105L19.6982 8.25L23.4482 12L19.6982 15.75Z" fill="currentColor"/>
          <path d="M6.19824 15.75L7.25874 14.6895L5.31924 12.75L9.94824 12.75L9.94824 11.25L5.31924 11.25L7.25874 9.3105L6.19824 8.25L2.44824 12L6.19824 15.75Z" fill="currentColor"/>
        </svg>
      </div>`,
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      html: `<div class="entry">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" transform="translate(0.948242)" fill="transparent" style="mix-blend-mode:multiply"/>
          <path d="M8.44824 4.5V6H17.8907L5.44824 18.4425L6.50574 19.5L18.9482 7.0575V16.5H20.4482V4.5H8.44824Z" fill="currentColor"/>
        </svg>
      </div>`,
      title: translate('Activate the global connect tool'),
      action: {
        click: function(event) {
          globalConnect.start(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
      translate('Create StartEvent')
    ),
    'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
      translate('Create Intermediate/Boundary Event')
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('Create EndEvent')
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
      translate('Create Gateway')
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task',
      translate('Create Task')
    ),
    'create.data-object': createAction(
      'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
      translate('Create DataObjectReference')
    ),
    'create.data-store': createAction(
      'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
      translate('Create DataStoreReference')
    ),
    'create.subprocess-expanded': {
      group: 'activity',
      className: 'bpmn-icon-subprocess-expanded',
      title: translate('Create expanded SubProcess'),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess
      }
    },
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: translate('Create Pool/Participant'),
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    },
    'create.group': createAction(
      'bpmn:Group', 'artifact', 'bpmn-icon-group',
      translate('Create Group')
    ),
  });

  return actions;
};
