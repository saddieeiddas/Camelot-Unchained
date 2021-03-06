/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Tooltip } from 'components/UI/Tooltip';


const PlayerFrameContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

const MainGrid = styled('div')`
  position: relative;
  flex: 0 0 auto;
  display: grid;
  cursor: pointer !important;
  grid-template-columns: 32px 70px 339px;
  grid-template-rows: 16px 63px 38px;
  @media (max-width: 2000px) {
    grid-template-columns: 16px 35px 170px;
    grid-template-rows: 8px 32px 19px;
  }
`;

const ArchetypeFrameContainer = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 3;
`;

const Name = styled('div')`
  color: white;
  grid-row-start: 2;
  grid-row-end: last;
  grid-column-start: 3;
  grid-column-end: last;
  z-index: 1;
  padding: 15px 0 0 10px;
  font-size: 22px;
  @media (max-width: 2000px) {
    font-size: 14px;
    padding: 7px 0 0 5px;
  }
`;

const Image = styled('img')`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const MainFrame = styled('div')`
  position: relative;
  grid-column-start: 1;
  grid-column-end: last;
  grid-row-start: 2;
  grid-row-end: last;
`;

const HealthSubGrid = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-areas:
   '. blood nameBG nameBG nameBG nameBG nameBG nameBG .'
   '. blood . . . . . . .'
   '. blood . . . health health health .'
   '. blood . . . . . . .'
   '. blood . . stamina stamina stamina . .'
   '. blood . . . . . . .'
   '. blood . panic panic panic . . .'
   '. blood . . . . . . .'
   '. . . . . . . . .';
  grid-template-columns: 8px 30px 6px 3px 6px 293px 3px 85px 7px;
  grid-template-rows: 57px 4px 13px 6px 4px 1px 4px 3px 9px;
  @media (max-width: 2000px) {
    grid-template-columns: 4px 15px 3px 1px 3px 147px 1px 43px 3px;
    grid-template-rows: 29px 2px 7px 2px 2px 1px 2px 1px 4px;
  }
`;

const NameBG = styled(Image)`
  grid-area: nameBG;
`;

const Blood = styled('div')`
  grid-area: blood;
  width: 100%;
  align-self: end;
`;

const Health = styled('div')`
  grid-area: health;
  height: 100%;
  transform: skewX(31.6deg);
`;

const HealthText = styled('div')`
  position: absolute;
  text-align: center;
  grid-area: health;
  height: 100%;
  width: 100%;
  color: white;
  line-height: 12px;
  @media (max-width: 2000px) {
    font-size: 16px;
    line-height: 6px;
  }
`;

const Stamina = styled('div')`
  grid-area: stamina;
  height: 100%;
  transform: skewX(-30deg);
  border-radius: 3px;
`;

const Statuses = styled('div')`
   display: flex;
   flex-wrap: wrap;
   justify-content: flex-start;
   align-content: flex-start;
   min-width: 180px;
   @media (max-width: 2000px) {
     min-width: 85px;
   }
`;

const Status = styled('div')`
  position: relative;
  overflow: hidden;
  border: 1px solid black;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin: 4px;
  @media (max-width: 2000px) {
    width: 16px;
    height: 16px;
    margin: 2px;
  }
`;

const StatusTooltip = styled('div')`
  background: #333;
  border: 1px solid #777;
  padding: 5px;
  color: white;
`;

const StatusTooltipName = styled('h3')`
  margin: 0;
  margin-bottom: 5px;
`;

const StatusTooltipDescription = styled('p')`
  margin: 0;
  padding: 0;
`;

export interface Props {
  player: PlayerState;
  target?: 'enemy' | 'friendly';
}

export interface State {
  hover: boolean;
}

export class PlayerFrame extends React.Component<Props, State> {

  public state = {
    hover: false,
  };

  public render() {
    return (
      <UIContext.Consumer>
        {this.uiContextRender}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    game.store.onUpdated(() => this.forceUpdate());
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.hover !== nextState.hover) {
      return true;
    }

    if (Object.is(this.props.player, nextProps.player)) {
      return false;
    }

    if (PlayerState.equals(this.props.player, nextProps.player)) {
      return false;
    }

    return true;
  }

  private uiContextRender = (uiContext: UIContext) => {
    const { player } = this.props;
    if (!player.health[0]) return null;
    const imgDir = 'images/unit-frames/' + (uiContext.use4kAssets() ? '4k/' : '1080/');
    const realmPrefix = this.realmPrefix(player.faction);
    const archetypePrefix = this.archetypePrefix(player.classID);
    const theme = uiContext.currentTheme();

    return (
      <PlayerFrameContainer data-input-group='block'>
        <MainGrid onMouseOver={this.setHoverOn} onMouseLeave={this.setHoverOff}>
          <MainFrame>
            <Image src={imgDir + 'bg.png'} />

            <HealthSubGrid>
              <NameBG src={imgDir + realmPrefix + 'nameplate-bg.png'} />
            </HealthSubGrid>

            <HealthSubGrid style={{ WebkitMaskImage: `url(${imgDir}main-frame-mask.png)` }}>
              <Blood style={{
                height: CurrentMax.cssPercent(player.blood),
                backgroundColor: theme.unitFrames.color.blood,
              }} />
              <Health style={{
                width: CurrentMax.cssPercent(player.health[0]),
                backgroundColor: theme.unitFrames.color.health,
              }} />
              <Stamina style={{
                width: CurrentMax.cssPercent(player.stamina),
                backgroundColor: theme.unitFrames.color.stamina,
              }} />
              <NameBG src={imgDir + realmPrefix + 'nameplate-bg.png'} />
            </HealthSubGrid>

            {/* Overlay */}
            <Image src={imgDir + realmPrefix + 'main-frame.png'} />

            {this.state.hover &&
              <HealthSubGrid>
                <HealthText>{player.health[0].current + ' / ' + player.health[0].max}</HealthText>
              </HealthSubGrid >
            }

          </MainFrame>

          <ArchetypeFrameContainer>
            <Image src={imgDir + archetypePrefix + 'bg.png'} />
            <Image
              src={imgDir + realmPrefix + 'propic.png'}
              style={{ WebkitMaskImage: `url(${imgDir + archetypePrefix}bg.png)` }}
            />
            <Image src={imgDir + realmPrefix + archetypePrefix + 'frame.png'} />
          </ArchetypeFrameContainer>

          <Name>{player.name}</Name>
        </MainGrid>

        <Statuses>
          {Object.values(player.statuses).map(this.renderStatus)}
        </Statuses>
      </PlayerFrameContainer>
    );
  }

  private renderStatus = (status: {id: number } & Timing) => {
    const info = game.store.getStatusInfo(status.id) || {
      name: 'unknown',
      description: 'unknown',
      iconURL: 'images/unit-frames/4k/' + this.realmPrefix(this.props.player.faction) + 'propic.png',
    };

    return (
      <Tooltip content={(
        <StatusTooltip>
          <StatusTooltipName>
            {info.name}
          </StatusTooltipName>
          <StatusTooltipDescription>
            {info.description}
          </StatusTooltipDescription>
        </StatusTooltip>
      )}>
        <Status key={status.id}>
          <Image src={info.iconURL} />;
        </Status>
      </Tooltip>
    );
  }

  private setHoverOn = () => {
    this.setState({ hover: true });
  }

  private setHoverOff = () => {
    this.setState({ hover: false });
  }

  private realmPrefix = (faction: Faction) => {
    switch (faction) {
      case Faction.Arthurian: return 'art-';
      case Faction.Viking: return 'vik-';
      case Faction.TDD: return 'tdd-';
      default: return '';
    }
  }

  private archetypePrefix = (archetype: Archetype) => {
    switch (archetype) {
      case Archetype.BlackKnight: case Archetype.Fianna: case Archetype.Mjolnir: return 'heavy-fighter-';
      case Archetype.Blackguard: case Archetype.ForestStalker: case Archetype.WintersShadow: return 'archer-';
      case Archetype.Physician: case Archetype.Empath: case Archetype.Stonehealer: return 'healer-';
      default: return '';
    }
  }
}
