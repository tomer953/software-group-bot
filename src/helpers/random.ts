// return random element from array
export function random(arr: Array<any>) {
  if (arr && arr.length) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return null;
}
