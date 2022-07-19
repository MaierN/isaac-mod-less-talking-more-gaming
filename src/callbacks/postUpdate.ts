import { EntityType, ModCallback, PlayerType, PlayerVariant } from "isaac-typescript-definitions";
import { DefaultMap, isChildPlayer, ModUpgraded, saveDataManager } from "isaacscript-common";
import { logMsg } from "../log";
import { addRealPlayer } from "../playerCtrl";

const playerTypeGroups = [
  [PlayerType.JACOB, PlayerType.ESAU],
  [PlayerType.THE_FORGOTTEN, PlayerType.THE_SOUL],
  [PlayerType.LAZARUS_B, PlayerType.LAZARUS_2_B],
  [PlayerType.THE_FORGOTTEN_B, PlayerType.THE_SOUL_B],
];

const postUpdateState = {
  run: {
    queues: new DefaultMap<PlayerType, EntityPlayer[]>(() => []),
    newPlayers: [] as EntityPlayer[],
  },
};

export function initCbPostUpdate(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);

  saveDataManager("postUpdateState", postUpdateState, () => false);
}

export function initNewPlayer(player: EntityPlayer): void {
  postUpdateState.run.newPlayers.push(player);
  logMsg(`new character ${PlayerType[player.GetPlayerType()]}`);
}

function main() {
  postUpdateState.run.newPlayers.forEach((player) => {
    if (player.Type === EntityType.PLAYER && player.Variant === PlayerVariant.PLAYER && !player.IsCoopGhost() && !isChildPlayer(player)) {
      const playerType = player.GetPlayerType();
      postUpdateState.run.queues.getAndSetDefault(playerType).push(player);

      if (playerTypeGroups.every((group) => !group.includes(playerType))) {
        addRealPlayer(player, new Set([player]));
      } else {
        playerTypeGroups.forEach((types) => {
          if (types.every((type) => postUpdateState.run.queues.getAndSetDefault(type).length > 0)) {
            const playerSet = new Set<EntityPlayer>();

            types.forEach((type) => {
              const thisPlayer = postUpdateState.run.queues.getAndSetDefault(type).shift();
              if (thisPlayer !== undefined) {
                playerSet.add(thisPlayer);
              }
            });

            const mainCharacter = [...playerSet.values()][0];
            if (mainCharacter !== undefined) {
              addRealPlayer(mainCharacter, playerSet);
            }
          }
        });
      }
    } else {
      logMsg(`ignored new character ${PlayerType[player.GetPlayerType()]}`);
    }
  });
  postUpdateState.run.newPlayers = [];
}
