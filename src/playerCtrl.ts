import { ButtonAction, EntityType, PlayerVariant } from "isaac-typescript-definitions";
import { DefaultMap, getPlayerIndex, getPlayerName, PlayerIndex, saveDataManager } from "isaacscript-common";
import { getCollectibleGroup } from "./collectible";
import { logMsg } from "./debug";
import { state } from "./state";

const playerCtrlState = {
  run: {
    realPlayers: [] as RealPlayer[],
    characterToRealPlayerMap: new Map<PlayerIndex, RealPlayer>(),
  },
  room: {
    offerItems: new DefaultMap<PlayerIndex, boolean>(false),
  },
};

export function initPlayerCtrl(): void {
  saveDataManager("playerCtrlState", playerCtrlState, () => false);
}

export class RealPlayer {
  mainCharacter: EntityPlayer;
  characters: Set<EntityPlayer>;

  constructor(mainCharacter: EntityPlayer, characters: Set<EntityPlayer>) {
    this.mainCharacter = mainCharacter;
    this.characters = characters;
  }

  toString(): string {
    return `${this.mainCharacter.Index}-${getPlayerName(this.mainCharacter)}-${getPlayerIndex(this.mainCharacter)}`;
  }

  offerItems(): void {
    playerCtrlState.room.offerItems.set(getPlayerIndex(this.mainCharacter), true);
  }

  isOfferingItems(): boolean {
    return playerCtrlState.room.offerItems.getAndSetDefault(getPlayerIndex(this.mainCharacter));
  }

  isDead(): boolean {
    return [...this.characters].every((character) => character.IsDead());
  }

  isCoopGhost(): boolean {
    return [...this.characters].every((character) => character.IsCoopGhost());
  }

  isActionPressed(action: ButtonAction): boolean {
    return [...this.characters].some((character) => Input.IsActionPressed(action, character.ControllerIndex));
  }

  animateHappy(): void {
    this.characters.forEach((character) => character.AnimateHappy());
  }
}

export function addRealPlayer(mainCharacter: EntityPlayer, characters: Set<EntityPlayer>): void {
  if (
    [...characters].every(
      (character) => character.Type === EntityType.PLAYER && character.Variant === PlayerVariant.PLAYER && !character.IsCoopGhost(),
    )
  ) {
    const realPlayer = new RealPlayer(mainCharacter, characters);
    playerCtrlState.run.realPlayers.push(realPlayer);
    characters.forEach((character) => {
      playerCtrlState.run.characterToRealPlayerMap.set(getPlayerIndex(character), realPlayer);
    });

    logMsg(`real player added: ${realPlayer.toString()} (${getPlayerIndex(mainCharacter)} -> ${characters.size})`);
  }
}

export function characterToRealPlayer(character: PlayerIndex): RealPlayer {
  const realPlayer = playerCtrlState.run.characterToRealPlayerMap.get(character);
  if (realPlayer === undefined) {
    logMsg(`error: invalid character index ${character}`);
    throw new Error();
  }
  return realPlayer;
}

export function getAliveRealPlayers(): RealPlayer[] {
  return playerCtrlState.run.realPlayers.filter((realPlayer) => !realPlayer.isDead() && !realPlayer.isCoopGhost());
}

export function getSortedRealPlayers(collectible: EntityPickupCollectible): Array<[RealPlayer, number]> {
  const group = getCollectibleGroup(collectible);

  const allPlayerCounts: Array<[RealPlayer, number]> = [];

  getAliveRealPlayers().forEach((realPlayer) => {
    const count = state.run.itemCounts.getAndSetDefault(getPlayerIndex(realPlayer.mainCharacter)).getAndSetDefault(group);

    allPlayerCounts.push([realPlayer, count]);
  });

  allPlayerCounts.sort(([playerA, countA], [playerB, countB]) => {
    if (countA !== countB) {
      return countA - countB;
    }

    return (
      state.run.itemPlayerPriorities.getAndSetDefault(`${getPlayerIndex(playerA.mainCharacter)}/${group}`) -
      state.run.itemPlayerPriorities.getAndSetDefault(`${getPlayerIndex(playerB.mainCharacter)}/${group}`)
    );
  });

  return allPlayerCounts;
}
