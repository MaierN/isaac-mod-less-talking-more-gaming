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
  CollectibleType.DOLLAR,
  CollectibleType.QUARTER,
  CollectibleType.BBF,
  CollectibleType.BLUE_MAP,
  CollectibleType.BOGO_BOMBS,
  CollectibleType.BOMB_BAG,
  CollectibleType.BOOM,
  CollectibleType.BOX,
  CollectibleType.BROKEN_WATCH,
  CollectibleType.BUM_FRIEND,
  CollectibleType.CONTRACT_FROM_BELOW,
  CollectibleType.DADDY_LONGLEGS,
  CollectibleType.DARK_BUM,
  CollectibleType.GOAT_HEAD,
  CollectibleType.HUMBLING_BUNDLE,
  CollectibleType.LITTLE_CHAD,
  CollectibleType.MITRE,
  CollectibleType.MOMS_COIN_PURSE,
  CollectibleType.MOMS_KEY,
  CollectibleType.MYSTERY_SACK,
  CollectibleType.PAGEANT_BOY,
  CollectibleType.PUNCHING_BAG,
  CollectibleType.PYRO,
  CollectibleType.SACK_OF_PENNIES,
  CollectibleType.SISSY_LONGLEGS,
  CollectibleType.SKELETON_KEY,
  CollectibleType.SPELUNKER_HAT,
  CollectibleType.STEAM_SALE,
  CollectibleType.COMPASS,
  CollectibleType.MIND,
  CollectibleType.RELIC,
  CollectibleType.THERES_OPTIONS,
  CollectibleType.TREASURE_MAP,
  CollectibleType.XRAY_VISION,
  CollectibleType.BUMBO,
  CollectibleType.BURSTING_SACK,
  CollectibleType.CHAOS,
  CollectibleType.CHARGED_BABY,
  CollectibleType.DEEP_POCKETS,
  CollectibleType.HEAD_OF_THE_KEEPER,
  CollectibleType.KEY_BUM,
  CollectibleType.LIL_CHEST,
  CollectibleType.LOST_FLY,
  CollectibleType.MORE_OPTIONS,
  CollectibleType.PAY_TO_PLAY,
  CollectibleType.RESTOCK,
  CollectibleType.RUNE_BAG,
  CollectibleType.SACK_HEAD,
  CollectibleType.SPIDER_MOD,
  CollectibleType.SUCCUBUS,
  CollectibleType.TOXIC_SHOCK,
  CollectibleType.SEVEN_SEALS,
  CollectibleType.ACID_BABY,
  CollectibleType.ANGRY_FLY,
  CollectibleType.BROKEN_MODEM,
  CollectibleType.DUALITY,
  CollectibleType.EUCHARIST,
  CollectibleType.FAST_BOMBS,
  CollectibleType.HUSHY,
  CollectibleType.POKE_GO,
  CollectibleType.SACK_OF_SACKS,
  CollectibleType.YO_LISTEN,
  CollectibleType.POUND_OF_FLESH,
  CollectibleType.BATTERY_PACK,
  CollectibleType.BOOSTER_PACK,
  CollectibleType.CARD_READING,
  CollectibleType.DIRTY_MIND,
  CollectibleType.FRUITY_PLUM,
  CollectibleType.GLITCHED_CROWN,
  CollectibleType.GUPPYS_EYE,
  CollectibleType.ISAACS_TOMB,
  CollectibleType.KEEPERS_KIN,
  CollectibleType.LOST_SOUL,
  CollectibleType.MEMBER_CARD,
  CollectibleType.LUNA,
  CollectibleType.OPTIONS,
  CollectibleType.SACRED_ORB,
  CollectibleType.SANGUINE_BOND,
  CollectibleType.STAR_OF_BETHLEHEM,
  CollectibleType.STAIRWAY,
  CollectibleType.TMTRAINER,
  CollectibleType.VANISHING_TWIN,
  CollectibleType.VOODOO_HEAD,
  CollectibleType.WORM_FRIEND,
  CollectibleType.ATHAME,
  CollectibleType.BETRAYAL,
  CollectibleType.BURSTING_SACK,
  CollectibleType.CONTAGION,
  CollectibleType.BLOOD_PUPPY,
  CollectibleType.LIL_PORTAL,
  CollectibleType.PURGATORY,
  CollectibleType.CURSED_EYE,
  CollectibleType.CURSE_OF_THE_TOWER,
];
