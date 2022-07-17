import { game, getCollectibleIndex, getPlayerIndex } from "isaacscript-common";
import { getCollectibleGroup } from "./collectible";
import { getSortedPlayers } from "./player";
import { state } from "./state";

export function addTextInfoCollectible(pedestal: EntityPickupCollectible): void {
  const index = getCollectibleIndex(pedestal);
  if (state.room.hiddenItems.getAndSetDefault(index, pedestal)) {
    return;
  }

  const group = getCollectibleGroup(pedestal);

  const pos = game.GetRoom().WorldToScreenPosition(pedestal.Position);
  let xOffset = 0;

  Isaac.RenderText(`${group}`, pos.X, pos.Y, 0, 1, 1, 1);

  const allPlayerCounts = getSortedPlayers(pedestal);

  const first = allPlayerCounts[0];
  if (first !== undefined) {
    allPlayerCounts.sort(([playerA, _countA], [playerB, _countB]) => playerA.Index - playerB.Index);
    allPlayerCounts.forEach(([player, _count]) => {
      const available = player === first[0] || state.room.offerItems.getAndSetDefault(getPlayerIndex(first[0]));
      Isaac.RenderText(`J${player.Index + 1}`, pos.X + xOffset++ * 16, pos.Y + 12, available ? 0 : 1, available ? 1 : 0, 0, 1);
    });
  }
}
