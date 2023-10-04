import uFuzzy from '@leeoniya/ufuzzy';

const uf = new uFuzzy();

export function fuzzySearch(
  haystack: string[],
  needle: string,
  opts?: {
    highlight?: boolean;
  },
) {
  const result: Array<{ index: number; content: string }> = [];
  const { highlight } = {
    highlight: false,
    ...opts,
  };
  const idxs = uf.filter(haystack, needle);
  if (idxs) {
    const info = uf.info(idxs, haystack, needle);
    const order = uf.sort(info, haystack, needle);
    order.forEach((infoIdx) => {
      const index = info.idx[infoIdx];
      const ranges = info.ranges[infoIdx];
      const content = highlight
        ? uFuzzy.highlight(haystack[index], ranges)
        : haystack[index];
      result.push({
        index,
        content,
      });
    });
  }
  return result;
}
