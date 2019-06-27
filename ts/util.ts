export { isFunc, isArray, includePrototypes };

function includePrototypes() {
    // import this to include the object prototypes
    // defined below
}

function isFunc(f:any) {
    return typeof(f) == "function";
}
function isArray(a:any) {
    return Array.isArray(a);
}

Array.prototype.count = function<T>(this: Array<T>, value:T) {
    var count = 0;
    for(let i=0; i<this.length; i++)
        if(this[i]==value) count++;
    return count;
};
Array.prototype.remove = function<T>(this: Array<T>, value:T) {
    const i = this.indexOf(value);
    if(i!=-1) {
        this.splice(i, 1);
        return true;
    }
    return false;
};
