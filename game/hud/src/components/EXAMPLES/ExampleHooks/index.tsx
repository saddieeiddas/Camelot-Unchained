/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import UsingGameModels from './UsingGameModels';
import UsingGameEvents from './UsingGameEvents';
import UsingGraphQL from './UsingGraphQL';

const ExampleHooks = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        position: 'absolute',
        overflow: 'scroll',
        zIndex: 99999999,
      }}
    >
      <h1>Example Hooks API</h1>
      <UsingGameModels />
      <UsingGameEvents />
      <UsingGraphQL />
    </div>
  );
};

export default ExampleHooks;
