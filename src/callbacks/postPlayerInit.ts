import { ModCallback, PlayerType } from "isaac-typescript-definitions";
import { DefaultMap, getPlayerIndex, ModUpgraded, saveDataManager } from "isaacscript-common";
import { logMsg } from "../debug";
import { addRealPlayer } from "../playerCtrl";

const playerTypeGroups = [
  [PlayerType.JACOB, PlayerType.ESAU],
  [PlayerType.LAZARUS_B, PlayerType.LAZARUS_2_B],
  [PlayerType.THE_FORGOTTEN_B, PlayerType.THE_SOUL_B],
];

const playerInitState = {
  run: {
    queues: new DefaultMap<PlayerType, EntityPlayer[]>(() => []),
    newPlayers: [] as EntityPlayer[],
  },
};

export function initCbPostPlayerInit(mod: ModUpgraded): void {
  mod.AddCallback(ModCallback.POST_PLAYER_INIT, main);
  mod.AddCallback(ModCallback.POST_UPDATE, () => {
    playerInitState.run.newPlayers.forEach((player) => {
      const playerType = player.GetPlayerType();
      playerInitState.run.queues.getAndSetDefault(playerType).push(player);

      if (playerTypeGroups.every((group) => !group.includes(playerType))) {
        addRealPlayer(player, new Set([player]));
      } else {
        playerTypeGroups.forEach((types) => {
          if (types.every((type) => playerInitState.run.queues.getAndSetDefault(type).length > 0)) {
            const playerSet = new Set<EntityPlayer>();

            types.forEach((type) => {
              const thisPlayer = playerInitState.run.queues.getAndSetDefault(type).shift();
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
    });
    playerInitState.run.newPlayers = [];
  });

  saveDataManager("playerInitState", playerInitState, () => false);
}

function main(player: EntityPlayer) {
  logMsg(`new character ${PlayerType[player.GetPlayerType()]} ${getPlayerIndex(player)}`);
  playerInitState.run.newPlayers.push(player);
}
