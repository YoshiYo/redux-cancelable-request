# Redux Cancelable Requests

This package will help you to understand how to create a system in your redux application to handle a canceled request. This repository is open to contribution. Do not hesitate to contact me.

## Purpose

This package will help but it need to be implemented carrefully.
There is many ways to cancel or ignore a request. The purpose here is to ignore the requests dispatched with a specific state and process the action canceled differently. It's like a toolbox wich can be implemented differently depending of your project.

Now each time you will dispatch an action to canceled, the future action success or failed received, will be catched and will update the action with a new property `canceled`.

## How to use it ?

Each **SUCCESS** or **FAILURE** actions dispatched will now receive a new argument to add manually in the app. Each actions need now an id to identify here on your redux management. This identifier is used to cancel your request in the process. It can be a string, an id, or anything. The `generateId` tool is here to helps you to give you a speed hash of your id. You can use it with:

```
import { generateId } from 'redux-cancelable-requests';

const idRequest = generateId(typeInit);
dispatch({
  type: typeSuccess,
  payload: responseJson,
  idRequest,
});
```

After that, you need to configure your store to handle the reducer wich will permit to save the requests to cancel.

```
import { _canceledRequest } from 'redux-cancelable-requests';
// Then, add _canceledRequest to your combine reducers used by your store
```

Your reducer saved, you can dispatch manually the same id in another function to lauch your cancel request.

```
import { cancelRequestDispatch } from 'redux-cancelable-requests';

// Example:
const idToCancel = "FETCH_ALL_FORMS_INIT";
// The idToCancel need to be the same that the original id provided by
// your SUCCESS or FAILURE action.
cancelRequestDispatch(dispatch, idToCancel);
// After that dispatch, we save the idToCancel to the new reducer.
```

You can now add the middleware wich will evaluate the future requests and update the next idRequest with the same id launched.

```
import { cancelRequestMiddleware } from 'redux-cancelable-requests';

// Example with other middlewares
export const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(
    networkMiddleware,
    cancelRequestMiddleware,
    thunk
  )),
);
```

Now each time you will dispatch an action to canceled, the future action success or failed received, will be catched and will update the action with a new property `canceled`.

```
// FUTURE ACTION NOW CANCELED
{
  type: 'FETCH_ALL_FORMS_SUCCESS',
  payload: {...},
  canceled: true,
}

// Now in your reducer you can easily access to this property to
// handle correctly the state wanted.
case 'FETCH_ALL_FORMS_SUCCESS':
  if(action.canceled){
    // do something
  }
```

After the success or the failure of your action, the action is automatically removed in the stack of requests canceled.
