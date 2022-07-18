let debug = false;

export function toggleDebug(): void {
  debug = !debug;
  logMsg(`debug: ${debug}`, true);
}

export function mapToString<K, V>(map: Map<K, V>): string {
  const res: string[] = [];
  for (const [key, value] of map.entries()) {
    res.push(`${key}: ${value}`);
  }
  return res.join(", ");
}

export function setToString<T>(set: Set<T>): string {
  const res: string[] = [];
  set.forEach((value) => {
    res.push(`${value}`);
  });
  return res.join(", ");
}

export function logMsg(msg: string, toConsole = false): void {
  Isaac.DebugString(msg);

  if (debug || toConsole) {
    print(msg);
  }
}
