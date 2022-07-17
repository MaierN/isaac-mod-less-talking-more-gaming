const DEBUG = false;

export function mapToString<K, V>(map: Map<K, V>): string {
  const res: string[] = [];
  for (const [key, value] of map.entries()) {
    res.push(`${key}: ${value}`);
  }
  return res.join(", ");
}

export function logMsg(msg: string, toConsole = false): void {
  Isaac.DebugString(msg);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (DEBUG || toConsole) {
    print(msg);
  }
}
