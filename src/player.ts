import { BabySubType, EntityType, PlayerVariant } from "isaac-typescript-definitions";
import { getPlayerIndex, getPlayers } from "isaacscript-common";
import { getCollectibleGroup } from "./collectible";
import { state } from "./state";

export function isSafePlayer(player: EntityPlayer): boolean {
  return (
    player.Type === EntityType.PLAYER &&
    player.Variant === PlayerVariant.PLAYER &&
    !player.IsDead() &&
    player.GetMainTwin().Index === player.Index &&
    player.GetBabySkin() === BabySubType.UNASSIGNED &&
    !player.IsCoopGhost()
  );
}

export function getSafePlayers(): EntityPlayer[] {
  return getPlayers().filter((player) => isSafePlayer(player));
}

export function getSortedPlayers(collectible: EntityPickupCollectible): Array<[EntityPlayer, number]> {
  const group = getCollectibleGroup(collectible);

  const allPlayerCounts: Array<[EntityPlayer, number]> = [];

  getSafePlayers().forEach((player) => {
    const playerIndex = getPlayerIndex(player);
    const count = state.run.itemCounts.getAndSetDefault(playerIndex).getAndSetDefault(group);

    allPlayerCounts.push([player, count]);
  });

  allPlayerCounts.sort(([playerA, countA], [playerB, countB]) => {
    if (countA !== countB) {
      return countA - countB;
    }

    return (
      state.run.itemPlayerPriorities.getAndSetDefault(getPlayerIndex(playerA)).getAndSetDefault(group) -
      state.run.itemPlayerPriorities.getAndSetDefault(getPlayerIndex(playerB)).getAndSetDefault(group)
    );
  });

  return allPlayerCounts;
}
