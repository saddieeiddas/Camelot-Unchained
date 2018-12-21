/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState, useCallback } from 'react';

// this example shows how react hooks can be used to work with events
// e.g. game.on('foobar', (data) => {});
// we use a mock event called 'foobar' which is triggered and listened to
// through the game.on method.
// we also allow the 'foobar' event to be triggered via a form field and button

const UsingGameEvents = () => {

  // state for 'foobar' event data
  const [foobar, setFoobar] = useState(null);

  // state for storing log of 'foobar' event data
  const [foobarLog, setFoobarLog] = useState([]);

  // example using useEffect to listen to game events.
  useEffect(() => {
    console.log('ExampleHooks-UsingGameEvents', 'registered foobar listener');
    const handle = game.on('foobar', (data: any) => {
      console.log('ExampleHooks-UsingGameEvents', 'received foobar event', data);
      // set foobar state value to one received here
      setFoobar(data);
      setFoobarLog([...foobarLog, data]);
    });
    return () => {
      console.log('ExampleHooks-UsingGameEvents', 'removed foobar listener');
      handle.clear();
    };
  }, [foobarLog]); // ensure this effect is only updated when foobarLog changes

  // the above example can be simplified a bit by returning the clear function directly e.g.
  useEffect(() => game.on('foobar2', (data: any) => {
    setFoobar(data);
    setFoobarLog([...foobarLog, data]);
  }).clear, [foobarLog]);

  // state for 'foobarField' form field data
  const [foobarField, setFoobarField] = useState('');

  // callback to handle foobar form field on change
  const onFoobarFieldChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    setFoobarField(event.target.value);
  }, []); // ensure this callback is only registered once via empty array here

  // callback to trigger foobar game event with foobarField value
  const triggerFoobar = useCallback(() => {
    game.trigger('foobar', foobarField); // send foobar event
    setFoobarField(''); // clear the foobar field
  }, [foobarField]); // ensure this callback is updated when foobarField changes

  return (
    <div>
      <h3>Using Game Events</h3>
      <h5>Latest 'foobar' event data {foobar}</h5>
      <input type='text' value={foobarField} onChange={onFoobarFieldChange} onBlur={onFoobarFieldChange} />
      <button onClick={triggerFoobar}>Send Foobar Event</button>
      <h4>Log (Scroll)</h4>
      <ul>
        {foobarLog.map((foobarLogItem, index) => (
          <li key={index}>{foobarLogItem}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsingGameEvents;
