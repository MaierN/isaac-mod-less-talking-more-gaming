import { ModCallback } from "isaac-typescript-definitions";
import { DefaultMap, saveDataManager } from "isaacscript-common";

const v = {
  run: {
    x: new DefaultMap<number, number>(42),
    y: new Map<number, number>(),
  },
};

export function initTest1(mod: Mod): void {
  saveDataManager("test1", v);

  mod.AddCallback(ModCallback.POST_UPDATE, () => {
    v.run.x.set(v.run.x.size, 42);
    v.run.y.set(v.run.y.size, 42);

    // rint(v.run.x.size, v.run.y.size);
  });
}
