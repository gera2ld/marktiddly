import uFuzzy from '@leeoniya/ufuzzy';

const uf = new uFuzzy();

export function fuzzySearch(
  haystack: string[],
  needle: string,
  opts?: {
    contextSize?: number;
    maxSize?: number;
  },
) {
  const result: Array<{ index: number; content: string }> = [];
  const { contextSize, maxSize } = {
    contextSize: 10,
    maxSize: 40,
    ...opts,
  };
  const idxs = uf.filter(haystack, needle);
  if (idxs) {
    const info = uf.info(idxs, haystack, needle);
    const order = uf.sort(info, haystack, needle);
    order.forEach((infoIdx) => {
      const index = info.idx[infoIdx];
      const ranges = info.ranges[infoIdx];
      const groupSize = ranges.length >> 1;
      let i = 0;
      const content = uFuzzy.highlight(
        haystack[index],
        ranges,
        (part, matched) => {
          if (!matched) {
            i += 1;
            if (i > 1 && i < groupSize) {
              return part.length > maxSize
                ? `${part.slice(0, contextSize)}...${part.slice(-contextSize)}`
                : part;
            }
            if (part.length <= contextSize) return part;
            if (i === 1) return `...${part.slice(-contextSize)}`;
            return `${part.slice(0, contextSize)}...`;
          }
          return `<mark>${part}</mark>`;
        },
      );
      result.push({
        index,
        content,
      });
    });
  }
  return result;
}
