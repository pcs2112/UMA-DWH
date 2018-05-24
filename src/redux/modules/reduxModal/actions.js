import { createAction } from 'helpers/redux';

export const SHOW_MODAL = 'reduxModal/SHOW_MODAL';
export const HIDE_MODAL = 'reduxModal/HIDE_MODAL';

export const showModal = createAction(SHOW_MODAL, 'modalName');
export const hideModal = createAction(HIDE_MODAL);
