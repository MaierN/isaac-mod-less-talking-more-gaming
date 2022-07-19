import { CollectiblePedestalType, CollectibleType, RoomType } from "isaac-typescript-definitions";
import { game, getCollectiblePedestalType, isPassiveCollectible } from "isaacscript-common";

const teamSharedItems = [
  CollectibleType.KEY_PIECE_1,
  CollectibleType.KEY_PIECE_2,
  CollectibleType.KNIFE_PIECE_1,
  CollectibleType.KNIFE_PIECE_2,
  CollectibleType.DADS_NOTE,
  CollectibleType.BROKEN_SHOVEL_1,
  CollectibleType.BROKEN_SHOVEL_2,
];

export function isCollectibleInteresting(collectible: EntityPickupCollectible): boolean {
  return (
    collectible.SubType !== CollectibleType.NULL &&
    isPassiveCollectible(collectible.SubType) &&
    collectible.Price >= 0 &&
    !teamSharedItems.includes(collectible.SubType)
  );
}

export function getCollectibleGroup(collectible: EntityPickupCollectible): string {
  let pedestalType = getCollectiblePedestalType(collectible);
  let roomType = game.GetRoom().GetType();

  if ([CollectiblePedestalType.LOCKED_CHEST, CollectiblePedestalType.ETERNAL_CHEST, CollectiblePedestalType.BOMB_CHEST].includes(pedestalType)) {
    pedestalType = CollectiblePedestalType.LOCKED_CHEST;
  }
  if (pedestalType === CollectiblePedestalType.MEGA_CHEST) {
    roomType = RoomType.TREASURE;
  }
  if (
    [
      CollectiblePedestalType.LOCKED_CHEST,
      CollectiblePedestalType.WOODEN_CHEST,
      CollectiblePedestalType.OLD_CHEST,
      CollectiblePedestalType.MOMS_CHEST,
      CollectiblePedestalType.MOMS_DRESSING_TABLE,
      CollectiblePedestalType.RED_CHEST,
      CollectiblePedestalType.SLOT_MACHINE,
      CollectiblePedestalType.BLOOD_DONATION_MACHINE,
      CollectiblePedestalType.FORTUNE_TELLING_MACHINE,
    ].includes(pedestalType)
  ) {
    return CollectiblePedestalType[pedestalType] ?? "unknown pedestal";
  }

  if ([RoomType.SHOP, RoomType.BLACK_MARKET].includes(roomType)) {
    roomType = RoomType.SHOP;
  }
  if ([RoomType.TREASURE, RoomType.DUNGEON, RoomType.CHALLENGE, RoomType.BOSS_RUSH].includes(roomType)) {
    roomType = RoomType.TREASURE;
  }
  if ([RoomType.ANGEL, RoomType.SACRIFICE].includes(roomType)) {
    roomType = RoomType.ANGEL;
  }
  if (
    [
      RoomType.SHOP,
      RoomType.ERROR,
      RoomType.BOSS,
      RoomType.MINI_BOSS,
      RoomType.SECRET,
      RoomType.CURSE,
      RoomType.TREASURE,
      RoomType.ANGEL,
      RoomType.LIBRARY,
      RoomType.DEVIL,
      RoomType.PLANETARIUM,
      RoomType.ULTRA_SECRET,
    ].includes(roomType)
  ) {
    return RoomType[roomType] ?? "unknown room";
  }

  return "DEFAULT";
}
