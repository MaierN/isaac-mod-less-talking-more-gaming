import { EntityType, ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { getPlayerIndex, ModUpgraded } from "isaacscript-common";
import { isCollectibleInteresting } from "../collectible";
import { getSortedPlayers, isSafePlayer } from "../player";
import { state } from "../state";

export function initCbPrePickupCollision(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_PICKUP_COLLISION, main);
}

function main(pickup: EntityPickup, collider: Entity, _low: boolean): boolean | undefined {
  if (pickup.Type === EntityType.PICKUP && pickup.Variant === PickupVariant.COLLECTIBLE && collider.Type === EntityType.PLAYER) {
    const player = collider.ToPlayer();
    const pedestal = pickup as EntityPickupCollectible;
    if (isCollectibleInteresting(pedestal) && player !== undefined && isSafePlayer(player)) {
      const first = getSortedPlayers(pedestal)[0];
      if (first !== undefined) {
        if (getPlayerIndex(player) !== getPlayerIndex(first[0]) && !state.room.offerItems.getAndSetDefault(getPlayerIndex(first[0]))) {
          if (player.IsExtraAnimationFinished()) {
            player.AnimateSad();
          }
          return false;
        }
      }
    }
  }

  return undefined;
}
