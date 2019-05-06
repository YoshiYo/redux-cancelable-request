import XXH from 'xxhashjs';
import produce from 'immer';
import _ from 'lodash';
export const CANCELED_REQUEST_ENABLED = 'CANCELED_REQUEST_ENABLED';
export const REMOVE_CANCELED_CURRENT_REQUEST_FROM_STORE = 'REMOVE_CANCELED_CURRENT_REQUEST_FROM_STORE';
/**
 * Generate an IdRequest based on xxhashjs
 */

export const generateId = futureId => XXH.h32(futureId, '0xABCD').toString(16);
/**
 * Dispatch a cancelable dispatch
 */

export const cancelRequestDispatch = (dispatch, idToCancel) => dispatch({
  type: CANCELED_REQUEST_ENABLED,
  idRequestToCancel: generateId(idToCancel)
});
/**
 * Cancelable is a specific function to allow a method cancel in
 * a component.
 */

export const cancelable = (dispatch, myFunction, id) => {
  myFunction.cancel = () => {
    cancelRequestDispatch(dispatch, id);
  };

  return myFunction;
};
/**
 * Redux middleware to handle canceledRequestInReducer
 */

export const cancelRequestMiddleware = ({
  getState
}) => next => action => {
  const state = getState();

  const canceledRequestsState = _.get(state, '_canceledRequest.requests');

  if (canceledRequestsState) {
    if (action.idRequest) {
      const foundTheRequest = canceledRequestsState.find(requestRegistered => requestRegistered === action.idRequest);

      if (foundTheRequest) {
        action.canceled = true;
        next(action);
        next({
          type: REMOVE_CANCELED_CURRENT_REQUEST_FROM_STORE,
          payload: action.idRequest
        });
        return next;
      }
    }
  }

  const returnValue = next(action);
  return returnValue;
};
/**
 * Export a reducer wich can be include
 * in a redux store
 */
// eslint-disable-next-line

export const _canceledRequest = (state = {
  requests: []
}, action) => produce(state, draft => {
  switch (action.type) {
    case REMOVE_CANCELED_CURRENT_REQUEST_FROM_STORE:
      {
        const findIndex = draft.requests.findIndex(aRequest => aRequest === action.payload);
        draft.requests.splice(findIndex, 1);
        break;
      }

    case CANCELED_REQUEST_ENABLED:
      draft.requests.push(action.idRequestToCancel);
      break;

    default:
      break;
  }

  return draft;
});
