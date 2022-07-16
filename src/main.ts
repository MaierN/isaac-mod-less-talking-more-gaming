import { BabySubType, CollectiblePedestalType, CollectibleType, EntityType, ModCallback, PickupVariant, PlayerVariant, RoomType } from "isaac-typescript-definitions";
import { game, getCollectibleName, getCollectiblePedestalType, getPlayerCollectibleMap, getPlayerIndex, getPlayers, isPassiveCollectible, log, PlayerIndex, saveDataManager, upgradeMod } from "isaacscript-common";

const MOD_NAME = "less-talking-more-gaming";

const state = {
  run: {
    itemCounts: new Map<PlayerIndex, Map<string, number>>(),
    itemPlayerPriorities: new Map<PlayerIndex, Map<string, number>>(),
    inventoryCount: new Map<PlayerIndex, number>(),
    inventoryContent: new Map<PlayerIndex, Map<CollectibleType, number>>(),
  },
  room: {
    itemGroups: new Map<CollectibleType, string>(),
    offerItems: new Map<PlayerIndex, boolean>(),
  },
};

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  saveDataManager("main", state);

  mod.AddCallback(ModCallback.POST_RENDER, postRender);
  mod.AddCallback(ModCallback.PRE_PICKUP_COLLISION, prePickupCollision);
  mod.AddCallback(ModCallback.POST_PEFFECT_UPDATE, postPeffectUpdate);

  log(`${MOD_NAME} initialized.`);
}

function postPeffectUpdate(player: EntityPlayer) {
  if (!state.run.inventoryCount.has(getPlayerIndex(player))) {
    state.run.inventoryCount.set(getPlayerIndex(player), player.GetCollectibleCount());
    state.run.inventoryContent.set(getPlayerIndex(player), getPlayerCollectibleMap(player));
  }

  if (state.run.inventoryCount.get(getPlayerIndex(player)) !== player.GetCollectibleCount()) {
    const oldMap = state.run.inventoryContent.get(getPlayerIndex(player)) ?? new Map<CollectibleType, number>();
    const newMap = getPlayerCollectibleMap(player);

    for (const [type, count] of newMap.entries()) {
      for (let i = 0; i < count - (oldMap.get(type) ?? 0); i++) {
        newItemFound(player, type);
      }
    }

    state.run.inventoryCount.set(getPlayerIndex(player), player.GetCollectibleCount());
    state.run.inventoryContent.set(getPlayerIndex(player), newMap);
  }
}

function postRender() {
  Isaac.FindByType(EntityType.PICKUP, PickupVariant.COLLECTIBLE).forEach((entity) => {
    const pedestal = entity.ToPickup() as EntityPickupCollectible;
    if (!isCollectibleInteresting(pedestal)) {
      return;
    }
    const pos = Isaac.WorldToRenderPosition(pedestal.Position);
    let yOffset = 0;

    const group = getCollectibleGroup(pedestal);

    const allPlayerCounts = getSortedPlayers(pedestal);

    let first = true;
    allPlayerCounts.forEach(([player, count]) => {
      Isaac.RenderText(`J${player.Index + 1}: ${count} (${state.run.itemPlayerPriorities.get(getPlayerIndex(player))?.get(group)})`, pos.X, pos.Y + ++yOffset * 12, first ? 0 : 1, first ? 1 : 0, 0, 1);
      first = false;
    });

    state.room.itemGroups.set(pedestal.SubType, group);

    Isaac.RenderText(`${entity.SubType} ${getCollectibleName(pedestal.SubType)} (${group})`, pos.X, pos.Y, 0, 1, 1, 1);
  });
}

function prePickupCollision(pickup: EntityPickup, collider: Entity, _low: boolean): boolean | undefined {
  if (pickup.Type === EntityType.PICKUP && pickup.Variant === PickupVariant.COLLECTIBLE && collider.Type === EntityType.PLAYER) {
    const player = collider.ToPlayer();
    const pedestal = pickup as EntityPickupCollectible;
    if (isCollectibleInteresting(pedestal) && player !== undefined && isSafePlayer(player)) {
      const first = getSortedPlayers(pedestal)[0];
      if (first !== undefined) {
        if (getPlayerIndex(player) !== getPlayerIndex(first[0])) {
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

function isSafePlayer(player: EntityPlayer) {
  return player.Type === EntityType.PLAYER && player.Variant === PlayerVariant.PLAYER && !player.IsDead() && player.GetMainTwin().Index === player.Index && player.GetBabySkin() === BabySubType.UNASSIGNED && !player.IsCoopGhost();
}

function getSafePlayers() {
  return getPlayers().filter((player) => isSafePlayer(player));
}

function getSortedPlayers(collectible: EntityPickupCollectible) {
  const group = getCollectibleGroup(collectible);

  const allPlayerCounts: Array<[EntityPlayer, number]> = [];

  getSafePlayers().forEach((player) => {
    const playerIndex = getPlayerIndex(player);
    if (!state.run.itemCounts.has(playerIndex)) {
      state.run.itemCounts.set(playerIndex, new Map<string, number>());
    }

    const itemCounts = state.run.itemCounts.get(playerIndex) ?? new Map<string, number>();
    if (!itemCounts.has(group)) {
      itemCounts.set(group, 0);
    }
    const count = itemCounts.get(group) ?? 0;

    if (!state.run.itemPlayerPriorities.has(playerIndex)) {
      state.run.itemPlayerPriorities.set(playerIndex, new Map<string, number>());
    }
    const playerPriorities = state.run.itemPlayerPriorities.get(playerIndex) ?? new Map<string, number>();
    if (!playerPriorities.has(group)) {
      playerPriorities.set(group, Math.random());
    }

    allPlayerCounts.push([player, count]);
  });

  allPlayerCounts.sort(([playerA, countA], [playerB, countB]) => {
    if (countA !== countB) {
      return countA - countB;
    }

    return (state.run.itemPlayerPriorities.get(getPlayerIndex(playerA))?.get(group) ?? 0) - (state.run.itemPlayerPriorities.get(getPlayerIndex(playerB))?.get(group) ?? 0);
  });

  return allPlayerCounts;
}

function isCollectibleInteresting(collectible: EntityPickupCollectible) {
  return collectible.SubType !== CollectibleType.NULL && isPassiveCollectible(collectible.SubType) && collectible.Price >= 0;
}

function getCollectibleGroup(collectible: EntityPickupCollectible): string {
  let pedestalType = getCollectiblePedestalType(collectible);
  let roomType = game.GetRoom().GetType();

  if (pedestalType in [CollectiblePedestalType.LOCKED_CHEST, CollectiblePedestalType.ETERNAL_CHEST, CollectiblePedestalType.BOMB_CHEST]) {
    pedestalType = CollectiblePedestalType.LOCKED_CHEST;
  }
  if (pedestalType === CollectiblePedestalType.MEGA_CHEST) {
    roomType = RoomType.TREASURE;
  }
  if (pedestalType in [CollectiblePedestalType.LOCKED_CHEST, CollectiblePedestalType.WOODEN_CHEST, CollectiblePedestalType.OLD_CHEST, CollectiblePedestalType.MOMS_CHEST, CollectiblePedestalType.MOMS_DRESSING_TABLE, CollectiblePedestalType.RED_CHEST, CollectiblePedestalType.SLOT_MACHINE, CollectiblePedestalType.BLOOD_DONATION_MACHINE, CollectiblePedestalType.FORTUNE_TELLING_MACHINE]) {
    return CollectiblePedestalType[pedestalType] ?? "unknown pedestal";
  }

  if (roomType in [RoomType.SHOP, RoomType.BLACK_MARKET]) {
    roomType = RoomType.SHOP;
  }
  if (roomType in [RoomType.TREASURE, RoomType.DUNGEON, RoomType.CHALLENGE, RoomType.BOSS_RUSH]) {
    roomType = RoomType.TREASURE;
  }
  if (roomType in [RoomType.ANGEL, RoomType.SACRIFICE]) {
    roomType = RoomType.ANGEL;
  }
  if (roomType in [RoomType.SHOP, RoomType.ERROR, RoomType.BOSS, RoomType.MINI_BOSS, RoomType.SECRET, RoomType.CURSE, RoomType.TREASURE, RoomType.ANGEL, RoomType.LIBRARY, RoomType.DEVIL, RoomType.PLANETARIUM, RoomType.ULTRA_SECRET]) {
    return RoomType[roomType] ?? "unknown room";
  }

  return "default";
}

function newItemFound(player: EntityPlayer, collectible: CollectibleType) {
  if (isSafePlayer(player)) {
    const group = state.room.itemGroups.get(collectible);
    if (group !== undefined) {
      const playerIndex = getPlayerIndex(player);
      const previousCount = state.run.itemCounts.get(playerIndex)?.get(group) ?? 0;
      state.run.itemCounts.get(playerIndex)?.set(group, previousCount + 1);
      print(`${collectible} incremented ${group} to ${previousCount + 1}`);
    }
  }
}
