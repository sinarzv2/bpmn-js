import { assign } from 'min-dash';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import { is, isAny } from '../../util/ModelUtil';

export default function BpmnOutline(eventBus, styles) {
  const OUTLINE_STYLE = styles.cls('djs-outline', [ 'no-fill' ]);

  eventBus.on('outline.create', ({ element, gfx }) => {
    if (isLabel(element)) {
      const outline = svgCreate('rect');

      svgAttr(outline, assign({
        x: -5,
        y: -5,
        rx: 4,
        width: element.width + 10,
        height: element.height + 10
      }, OUTLINE_STYLE));

      svgAppend(gfx, outline);

      return outline;
    }

    if (isAny(element, [ 'bpmn:Task', 'bpmn:SubProcess', 'bpmn:Group' ])) {
      const outline = svgCreate('rect');

      svgAttr(outline, assign({
        x: -5,
        y: -5,
        rx: 14,
        width: element.width + 10,
        height: element.height + 10
      }, OUTLINE_STYLE));

      svgAppend(gfx, outline);

      return outline;
    } else if (is(element, 'bpmn:Event')) {
      const outline = svgCreate('circle');

      svgAttr(outline, assign({
        cx: element.width / 2,
        cy: element.height / 2,
        r: 23
      }, OUTLINE_STYLE));

      svgAppend(gfx, outline);

      return outline;
    } else if (is(element, 'bpmn:Gateway')) {
      const outline = svgCreate('rect');

      svgAttr(outline, assign({
        x: 2,
        y: 2,
        rx: 4,
        width: 46,
        height: 46,
      }, OUTLINE_STYLE));

      assign(outline.style, {
        'transform-box': 'fill-box',
        'transform': 'rotate(45deg)',
        'transform-origin': 'center'
      });

      svgAppend(gfx, outline);

      return outline;
    } else {
      const outline = svgCreate('rect');

      svgAttr(outline, assign({
        x: -5,
        y: -5,
        rx: 4,
        width: element.width + 10,
        height: element.height + 10
      }, OUTLINE_STYLE));

      svgAppend(gfx, outline);

      return outline;
    }
  });

  eventBus.on('outline.update', ({ element, outline }) => {
    if (isAny(element, [ 'bpmn:SubProcess', 'bpmn:Participant', 'bpmn:Lane', 'bpmn:TextAnnotation' ])) {
      svgAttr(outline, assign({
        width: element.width + 10,
        height: element.height + 10
      }, OUTLINE_STYLE));
    }

    return true;
  });
}

BpmnOutline.$inject = [
  'eventBus',
  'styles'
];

function isLabel(element) {
  return element.labelTarget;
}