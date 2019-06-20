export { isFunc };

function isFunc(f) {
    return typeof(f) == "function";
}
/**
 * array.count(value)
 */
Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            var count = 0;
            for(let i=0; i<this.length; i++)
                if(this[i]==value) count++;
            return count;
        }
    },
    remove: {
        value: function(value) {
            const i = this.indexOf(value);
            if(i!=-1) {
                this.splice(i, 1);
            }
        }
    }
});
Object.defineProperties(NodeList.prototype, {

});