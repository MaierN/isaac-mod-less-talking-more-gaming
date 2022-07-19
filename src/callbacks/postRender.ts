import { ButtonAction, EntityType, ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { ModUpgraded } from "isaacscript-common";
import { getCollectibleGroup, isCollectibleInteresting } from "../collectible";
import { config } from "../config";
import { getAliveRealPlayers } from "../playerCtrl";
import { addTextInfoCollectible } from "../renderInfo";
import { state } from "../state";

export function initCbPostRender(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  if (!config.run.enableMod) {
    return;
  }

  getAliveRealPlayers().forEach((realPlayer) => {
    if (
      [ButtonAction.SHOOT_LEFT, ButtonAction.SHOOT_RIGHT, ButtonAction.SHOOT_UP, ButtonAction.SHOOT_DOWN].every((action) =>
        realPlayer.isActionPressed(action),
      )
    ) {
      if (!realPlayer.isOfferingItems()) {
        realPlayer.animateHappy();
      }
      realPlayer.offerItems();
    }
  });

  Isaac.FindByType(EntityType.PICKUP, PickupVariant.COLLECTIBLE).forEach((entity) => {
    const pedestal = entity.ToPickup() as EntityPickupCollectible;

    if (isCollectibleInteresting(pedestal)) {
      state.room.itemGroups.set(pedestal.SubType, getCollectibleGroup(pedestal));

      if (getAliveRealPlayers().length > 1) {
        addTextInfoCollectible(pedestal);
      }
    }
  });
}
