import { MouseSensor, TouchSensor } from "@dnd-kit/core";

const IGNORE_TAGS = ["BUTTON"];

const customHandleEvent = (element) => {
  let cur = element;
  
  while (cur) {
    if (IGNORE_TAGS.includes(cur.tagName) || cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
};

MouseSensor.activators = [
  {
    eventName: "onMouseDown",
    handler: ({ nativeEvent: event }) => customHandleEvent(event.target),
  },
];

TouchSensor.activators = [
  {
    eventName: "onTouchStart",
    handler: ({ nativeEvent: event }) => customHandleEvent(event.target),
  },
];

export { TouchSensor, MouseSensor };