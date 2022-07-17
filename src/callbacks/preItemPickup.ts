import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { getCollectibleName, getPlayerIndex, ModCallbackCustom, ModUpgraded, PickingUpItem } from "isaacscript-common";
import { logMsg } from "../debug";
import { characterToRealPlayer } from "../playerCtrl";
import { state } from "../state";

export function initCbPreItemPickup(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  if ([ItemType.PASSIVE, ItemType.FAMILIAR].includes(pickingUpItem.itemType)) {
    const realPlayer = characterToRealPlayer(getPlayerIndex(player));

    logMsg(
      `player ${player.Index}-${getPlayerIndex(player)} (${realPlayer.toString()}) picked up ${pickingUpItem.itemType} ${pickingUpItem.subType}`,
    );

    const itemType = pickingUpItem.subType as CollectibleType;

    logMsg("known item groups:");
    for (const [collectibleType, collectibleGroup] of state.room.itemGroups.entries()) {
      logMsg(`${collectibleType}: ${collectibleGroup}`);
    }
    const group = state.room.itemGroups.get(itemType);
    logMsg(`item is of group ${group}`);

    if (group !== undefined) {
      const previousCount = state.run.itemCounts.getAndSetDefault(getPlayerIndex(realPlayer.mainCharacter)).getAndSetDefault(group);
      state.run.itemCounts.getAndSetDefault(getPlayerIndex(realPlayer.mainCharacter)).set(group, previousCount + 1);
      logMsg(`item ${itemType}-${getCollectibleName(itemType)} incremented ${group} to ${previousCount + 1} for player ${realPlayer.toString()}`);
    }
  }
}
