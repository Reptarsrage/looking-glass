import { ITEM_CLICK, ITEM_FULL_SCREEN } from './types';

export const itemClick = (itemId) => ({
  type: ITEM_CLICK,
  payload: itemId,
});

export const itemFullScreen = (itemId) => ({
  type: ITEM_FULL_SCREEN,
  payload: itemId,
});
