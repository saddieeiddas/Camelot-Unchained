/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect, useCallback } from 'react';
import fastDeepEqual from 'fast-deep-equal';
import { Updatable } from '@csegames/camelot-unchained';

const ExampleHooks = () => {
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
    <div style={{ width: '100%', height: '100%', background: 'white', position: 'absolute', zIndex: 99999999 }}>
      <h1>Example Hooks API</h1>
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

export default ExampleHooks;

// CONCEPT API

// a type for selectors
type Selector<T, R = any> = (state: T) => R;

// a reusable hook to work with game models
function useGameModel<M extends Updatable, T>(model: M, selector?: Selector<M, T>) {
  // tag used to force updates when no selector is provided
  const [forceUpdateTag, setForceUpdateTag] = useState(1);
  // keep selected state if a selector is provided
  const [selectedState, setSelectedState] = useState(selector ? selector(model) : null);
  // listen for loadingState updates
  useEffect(() => {
    const handler = model.onUpdated(() => {
      if (selector && !fastDeepEqual(selectedState, selector(model))) {
        // update the selected state
        setSelectedState(selector(model));
      } else if (!selector) {
        // update the tag
        setForceUpdateTag(forceUpdateTag + 1);
      }
    });
    return () => {
      handler.clear();
    };
  }, []);
  if (selector) {
    return selectedState;
  } else {
    return model;
  }
}

// a hook to use loadingState model
function useLoadingState<R = LoadingState>(selector?: Selector<LoadingState, R>) {
  // here we trick typescript to use the actual return type of the selector
  const mock = (false as true) && selector(game.loadingState);
  type T = typeof mock;
  return useGameModel(game.loadingState, selector) as T;
}

// a hook to use selfPlayerState model
function useSelfPlayerState<R = SelfPlayerState>(selector?: Selector<SelfPlayerState, R>) {
  // here we trick typescript to use the actual return type of the selector
  const mock = (false as true) && selector(game.selfPlayerState);
  type T = typeof mock;
  return useGameModel(game.selfPlayerState, selector) as T;
}

// a hook to use enemyTargetState model
function useEnemyTargetState<R = EnemyTargetState>(selector?: Selector<EnemyTargetState, R>) {
  // here we trick typescript to use the actual return type of the selector
  const mock = (false as true) && selector(game.enemyTargetState);
  type T = typeof mock;
  return useGameModel(game.enemyTargetState, selector) as T;
}
