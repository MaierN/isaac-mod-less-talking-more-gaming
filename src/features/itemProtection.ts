import {
  EntityType,
  ModCallback,
  PickupVariant,
  PlayerVariant,
} from "isaac-typescript-definitions";
import { isChildPlayer } from "isaacscript-common";
import { config } from "../config";
import { isInterestingCollectible } from "../helpers/collectibles";
import { getPersonForPlayer } from "../helpers/persons";
import { mod } from "../mod";
import { getAttributedPerson } from "./itemCounter";
import { isPersonOfferingItem } from "./offering";

export function itemProtectionInit(): void {
  mod.AddCallback(ModCallback.PRE_PICKUP_COLLISION, prePickupCollision);
}

function prePickupCollision(pickup: EntityPickup, collider: Entity, _low: boolean) {
  if (!config.run.enableMod) {
    return undefined;
  }

  if (pickup.Variant !== PickupVariant.COLLECTIBLE || collider.Type !== EntityType.PLAYER) {
    return undefined;
  }
  const collectible = pickup as EntityPickupCollectible;
  const player = collider.ToPlayer();
  const owner = getAttributedPerson(collectible);

  if (
    player === undefined ||
    !isInterestingCollectible(collectible) ||
    player.Variant !== PlayerVariant.PLAYER ||
    player.IsCoopGhost() ||
    isChildPlayer(player) ||
    owner === undefined
  ) {
    return undefined;
  }

  const person = getPersonForPlayer(player);
  if (person === owner || isPersonOfferingItem(owner, collectible)) {
    return undefined;
  }

  return false;
}
