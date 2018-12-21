/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState, useEffect } from 'react';
import fastDeepEqual from 'fast-deep-equal';
import { Updatable } from '@csegames/camelot-unchained';

// a type for selectors
export type Selector<T, R = any> = (state: T) => R;

// a reusable hook to work with game models
export function useGameModel<M extends Updatable, T>(model: M, selector?: Selector<M, T>) {
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
export function useLoadingState<R = LoadingState>(selector?: Selector<LoadingState, R>) {
  // here we trick typescript to use the actual return type of the selector
  const mock = (false as true) && selector(game.loadingState);
  type T = typeof mock;
  return useGameModel(game.loadingState, selector) as T;
}

// a hook to use selfPlayerState model
export function useSelfPlayerState<R = SelfPlayerState>(selector?: Selector<SelfPlayerState, R>) {
  // here we trick typescript to use the actual return type of the selector
  const mock = (false as true) && selector(game.selfPlayerState);
  type T = typeof mock;
  return useGameModel(game.selfPlayerState, selector) as T;
}

// a hook to use enemyTargetState model
export function useEnemyTargetState<R = EnemyTargetState>(selector?: Selector<EnemyTargetState, R>) {
  // here we trick typescript to use the actual return type of the selector
  const mock = (false as true) && selector(game.enemyTargetState);
  type T = typeof mock;
  return useGameModel(game.enemyTargetState, selector) as T;
}

export type EventFn = (...args: any[]) => EventHandle;
