export function toQueryString(obj, prefix) {
    let str = [], p;
    obj = JSON.parse(JSON.stringify(obj))
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                toQueryString(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&").replace('&=null', '');
}