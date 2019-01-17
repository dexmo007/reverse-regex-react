export function unescape(regexString) {
    return regexString.replace(/\\(.)/g, '$1');
}
