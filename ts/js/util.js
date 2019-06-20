export { isFunc, includePrototypes };
function includePrototypes() {
}
function isFunc(f) {
    return typeof (f) == "function";
}
Array.prototype.count = function (value) {
    var count = 0;
    for (let i = 0; i < this.length; i++)
        if (this[i] == value)
            count++;
    return count;
};
Array.prototype.remove = function (value) {
    const i = this.indexOf(value);
    if (i != -1) {
        this.splice(i, 1);
        return true;
    }
    return false;
};
