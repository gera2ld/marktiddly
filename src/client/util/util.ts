export async function requestJson<T>(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data as T;
}

export function getTiddlerNameByUrl(search = window.location.search) {
  const query = new URLSearchParams(search);
  const p = query.get('p');
  return p;
}

export function fuzzySearch(keyword: string, data: string) {
  const result: number[] = [];
  let j = 0;
  for (
    let i = 0;
    i < keyword.length && keyword.length - i <= data.length - j;
    i += 1
  ) {
    j = data.indexOf(keyword[i], j);
    if (j < 0) break;
    result.push(j);
    j += 1;
  }
  return result.length === keyword.length ? result : undefined;
}
