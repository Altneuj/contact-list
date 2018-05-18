import _ from 'lodash';

// A plain JavaScript object that contains our current state. We update this
// over time to reflect the current state of the application. When we first
// load, it represents the initial state of our application.
const STATE = {
  "currentContact": null,
  "ID": 2,
  "contacts": [
    {
      "id": 1,
      "name": "Albert Einstein",
      "image_url": "https://en.wikipedia.org/wiki/Albert_Einstein#/media/File:Einstein_1921_by_F_Schmutzer_-_restoration.jpg",
      "email": "aeinstein@example.com",
      "phone_number": "15555555555"
    }
  ]
};

let ON_UPDATE_CALLBACK = null;

// Register a callback to be called with the new state whenever the state
// changes.
const onUpdate = (callback) => {
  ON_UPDATE_CALLBACK = callback;
};

// Calls the currently-registered callback with the current state of the
// application. If no callback is registered, does nothing.
const forceUpdate = () => {
  if (ON_UPDATE_CALLBACK) {
    ON_UPDATE_CALLBACK(STATE);
  }
};

// Sends an event to be handled by our event handler function. The event always
// has a name, and _may_ have some data.
const sendEvent = (name, data, identity) => {
  // Make a copy of the existing state as a sort of "checkpoint" so we can
  // compare it to the potentially-changed state that comes out of
  // `handleEvent`.
  const oldState = _.cloneDeep(STATE);

  // This is just "naming" the variable for clarity since we'll be passing this
  // value to `handleEvent` for in-place modification.
  const newState = STATE;

  // This modifies the state however it likes, or maybe even not at all!
  handleEvent({
    name,
    data: data,
    identity
  }, newState);

  // If the state was changed between the time we made the copy and after we
  // passed it to `handleEvent`, we know we need to notify any listener that
  // there was a change!
  if (!_.isEqual(newState, oldState)) {
    forceUpdate()
  }
};

// Requests a piece of state from the model using event names similar to sendEvent.
// each request _may_ have some data that will help narrow down the scope of the
// state requested (e.g the id of the value desired)
const queryState = (name,data) => {
  if (name === 'getName') {
    return STATE.name;
  } else {
    // If we don't know what kind of event this is, alert the developer!
    throw new Error(`Unrecognized event: ${name}`);
  }
}

// Given an event name and the current state of the application, should mutate
// the state in-place as it sees fit.
//
// NOTE: This is where you should add support for any new events you want to
// handle!
const handleEvent = ({ name, data, identity }, state) => {
  if (name === 'changeName') {
    state.name = data;
  }
  else if (name === 'nameChange') {
   let num =  _.findIndex(state.contacts, ['id', identity])
   state.contacts[num].name = data;
  }
  else if (name === 'emailChange') {
   let num =  _.findIndex(state.contacts, ['id', identity])
   state.contacts[num].email = data;
  }
  else if (name === 'numChange') {
   let num =  _.findIndex(state.contacts, ['id', identity])
   state.contacts[num].phone_number = data;
  }
  else if (name === 'urlChange') {
   let num =  _.findIndex(state.contacts, ['id', identity])
   state.contacts[num].image_url = data;
  }
  else {
    // If we don't know what kind of event this is, alert the developer!
    throw new Error(`Unrecognized event: ${name}`);
  }
};

export {
  // This is a shortcut to force the `onUpdate` callbacks to be called. It's
  // useful mostly on the very first render of the application, which otherwise
  // would have no way to get the state if it's unable to change its values!
  forceUpdate,

  onUpdate,

  sendEvent,

  queryState
};
