import { CollectibleType } from "isaac-typescript-definitions";
import { isPassiveCollectible } from "isaacscript-common";

export function isInterestingCollectible(collectible: EntityPickupCollectible): boolean {
  return (
    collectible.SubType !== CollectibleType.NULL &&
    isPassiveCollectible(collectible.SubType) &&
    collectible.Price >= 0 &&
    !teamSharedItems.includes(collectible.SubType)
  );
}

const teamSharedItems = [
  CollectibleType.KEY_PIECE_1,
  CollectibleType.KEY_PIECE_2,
  CollectibleType.KNIFE_PIECE_1,
  CollectibleType.KNIFE_PIECE_2,
  CollectibleType.DADS_NOTE,
  CollectibleType.BROKEN_SHOVEL_1,
  CollectibleType.BROKEN_SHOVEL_2,

  // TODO add items like blue map etc...
];
