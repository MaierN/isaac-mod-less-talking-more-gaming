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

export function sortByKeys<T>(array: T[], keys: Array<(elt: T) => number>): T[] {
  return array.sort((a, b) => {
    for (const key of keys) {
      const valA = key(a);
      const valB = key(b);
      if (valA !== valB) {
        return valA - valB;
      }
    }
    return 0;
  });
}
