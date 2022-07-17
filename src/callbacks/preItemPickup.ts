import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { getPlayerIndex, ModCallbackCustom, ModUpgraded, PickingUpItem } from "isaacscript-common";
import { logMsg } from "../debug";
import { isSafePlayer } from "../player";
import { state } from "../state";

export function initCbPreItemPickup(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  if ([ItemType.PASSIVE, ItemType.FAMILIAR].includes(pickingUpItem.itemType)) {
    logMsg(`player ${player.Index}-${getPlayerIndex(player)} picked up ${pickingUpItem.itemType} ${pickingUpItem.subType}`);

    const type = pickingUpItem.subType as CollectibleType;

    if (isSafePlayer(player)) {
      logMsg("known item groups:");
      for (const [collectibleType, collectibleGroup] of state.room.itemGroups.entries()) {
        logMsg(`${collectibleType}: ${collectibleGroup}`);
      }
      const group = state.room.itemGroups.get(type);
      logMsg(`item is of group ${group}`);
      if (group !== undefined) {
        const playerIndex = getPlayerIndex(player);
        const previousCount = state.run.itemCounts.getAndSetDefault(playerIndex).getAndSetDefault(group);
        state.run.itemCounts.getAndSetDefault(playerIndex).set(group, previousCount + 1);
        logMsg(`${type} incremented ${group} to ${previousCount + 1} for player ${player.Index}-${playerIndex}`);
      }
    }
  }
}
