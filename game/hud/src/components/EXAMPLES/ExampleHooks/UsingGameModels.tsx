/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useCallback } from 'react';
import { useSelfPlayerState, useLoadingState, useEnemyTargetState } from './library';

const UsingGameModels = () => {
  // there are hooks to utilise game models like loadingState an selfPlayerState
  // these hooks are setup to watch game models for changes returning up to date
  // values

  // e.g. get entire game model
  const selfPlayerState = useSelfPlayerState();

  // you can pass a selector to these hooks which can help in a number of ways
  // the selector is a function which takes the model, and returns the desired value
  // this is used internally in the hook to only update/re-render when the selected value
  // has changed. it also allows you to keep components clean and tidy

  // e.g. select percent from loadingState
  const loadingPercent = useLoadingState(model => model.percent);

  // e.g. select name from selfPlayerState
  const name = useSelfPlayerState(model => model.name);

  // e.g. select multiple values from enemyTargetState
  const { enemyName, enemyFaction } = useEnemyTargetState(model => ({ enemyName: model.name, enemyFaction: model.faction }));

  // e.g. get respawn function from selfPlayerState
  const { isAlive, respawn } = useSelfPlayerState(model => ({ isAlive: model.isAlive, respawn: model.respawn }));

  // you can create memoized values which only update when values change
  // e.g. create a respawn click handler
  const respawnClickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAlive) {
      respawn();
    }
  }, [isAlive]);

  // you can also utilise hooks to perform side effects when values change
  // e.g. log message when loadingPercent changes
  useEffect(() => {
    console.log('ExampleHooks', 'loadingPercent changed', loadingPercent);
  }, [loadingPercent]);

  return (
    <div>
      <h3>Using Game Models</h3>
      <h5>Loading Percent {loadingPercent}</h5>
      <h5>Player Name: {name}</h5>
      <h5>Player ID: {selfPlayerState.characterID}</h5>
      <h5>Enemy Name: {enemyName}</h5>
      <h5>Enemy Name: {enemyFaction}</h5>
      <button disabled={isAlive} onClick={() => respawn()}>Respawn</button>
      <button onClick={respawnClickHandler}>Respawn</button>
    </div>
  );
};

export default UsingGameModels;
