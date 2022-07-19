import { EntityType, ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { getPlayerIndex, isChildPlayer, ModUpgraded } from "isaacscript-common";
import { isCollectibleInteresting } from "../collectible";
import { config } from "../config";
import { characterToRealPlayer, getSortedRealPlayers } from "../playerCtrl";

export function initCbPrePickupCollision(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.PRE_PICKUP_COLLISION, main);
}

function main(pickup: EntityPickup, collider: Entity, _low: boolean): boolean | undefined {
  if (!config.run.enableMod) {
    return undefined;
  }

  if (pickup.Type === EntityType.PICKUP && pickup.Variant === PickupVariant.COLLECTIBLE && collider.Type === EntityType.PLAYER) {
    const player = collider.ToPlayer();
    const pedestal = pickup as EntityPickupCollectible;

    if (isCollectibleInteresting(pedestal) && player !== undefined && !isChildPlayer(player)) {
      const first = getSortedRealPlayers(pedestal)[0];
      if (first !== undefined) {
        const realPlayer = characterToRealPlayer(getPlayerIndex(player));
        if (getPlayerIndex(realPlayer.mainCharacter) === getPlayerIndex(first[0].mainCharacter) || first[0].isOfferingItems()) {
          return undefined;
        }
      }

      return false;
    }
  }

  return undefined;
}
