import { ButtonAction, EntityType, ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { getPlayerIndex, ModUpgraded } from "isaacscript-common";
import { getCollectibleGroup, isCollectibleInteresting } from "../collectible";
import { getSafePlayers } from "../player";
import { addTextInfoCollectible } from "../renderInfo";
import { state } from "../state";

export function initCbPostRender(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  getSafePlayers().forEach((player) => {
    if (
      [ButtonAction.SHOOT_LEFT, ButtonAction.SHOOT_RIGHT, ButtonAction.SHOOT_UP, ButtonAction.SHOOT_DOWN].every((action) =>
        Input.IsActionPressed(action, player.ControllerIndex),
      )
    ) {
      if (!state.room.offerItems.getAndSetDefault(getPlayerIndex(player))) {
        player.AnimateHappy();
      }
      state.room.offerItems.set(getPlayerIndex(player), true);
    }
  });

  Isaac.FindByType(EntityType.PICKUP, PickupVariant.COLLECTIBLE).forEach((entity) => {
    const pedestal = entity.ToPickup() as EntityPickupCollectible;

    if (isCollectibleInteresting(pedestal)) {
      state.room.itemGroups.set(pedestal.SubType, getCollectibleGroup(pedestal));

      if (getSafePlayers().length > 1) {
        addTextInfoCollectible(pedestal);
      }
    }
  });
}
