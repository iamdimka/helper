export default function definedMutable(item: any) {
  if (item == null) {
    return undefined;
  }

  if (typeof item !== "object") {
    return item;
  }

  if (Array.isArray(item)) {
    let i = 0;

    for (let val of item) {
      val = definedMutable(val);
      if (val != null) {
        item[i] = val;
        i++;
      }
    }

    if (i < item.length) {
      item.splice(i);
    }
  } else {
    for (const key in item) {
      const val = definedMutable(item[key]);
      if (val == null) {
        delete item[key];
      } else {
        item[key] = val;
      }
    }
  }
  return item;
}