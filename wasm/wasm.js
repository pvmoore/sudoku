/** 
 * Handle wasm initialisation and interop between js and compiled code. 
 */

export { Wasm };

class Wasm {
    constructor() {
        this._module = null;
        this._instance = null;
        this._memory = null;
    }
    get module() { return this._module; }
    get instance() { return this._instance; }
    get memory() { return this._memory; }
    isSupported() {
        return 'WebAssembly' in window;
    }
    init(wasmFile, importObject, verbose) {
        this._wasmFile     = wasmFile;
        this._importObject = importObject;

        return WebAssembly
            .instantiateStreaming(fetch(wasmFile), importObject)
            .then(obj => { 
                this._module   = obj.module;
                this._instance = obj.instance;
                this._memory   = obj.instance.exports.memory;

                const buffer = new Uint8Array(this._memory.buffer);

                console.log(`Wasm '${wasmFile}' instantiated (memory = ${buffer.length/1024} KBs)`);
                
                if(verbose) {

                    for(const i in obj) {
                        console.log(`obj.${i}`);
                    }

                    for(const i in this._instance.exports) {
                        console.log(`instance.exports.${i}`);
                    }

                    console.log(`module.exports = ${JSON.stringify(WebAssembly.Module.exports(this._module), null, " ")}`);

                    console.log(`module.imports = ${JSON.stringify(WebAssembly.Module.imports(this._module), null, " ")}`);

                    for(const i in this._module.imports) {
                        console.log(`module.imports.${i}`);
                    }
                }
            });
    }
    getString(ptr, len) {
        const array = this.getU8Array(ptr, len);
        return String.fromCharCode.apply(String, array);
    }
    getObject(ptr, len) {
        throw new Error("Implement me");
    }
    getU8Array(ptr, len) {
        return new Uint8Array(this.memory.buffer, ptr, len);
    }
    getI8Array(ptr, len) {
        return new Int8Array(this.memory.buffer, ptr, len);
    }
    getU16Array(ptr, len) {
        return new Uint16Array(this.memory.buffer, ptr, len/2);
    }
    getI16Array(ptr, len) {
        return new Int16Array(this.memory.buffer, ptr, len/2);
    }
    getU32Array(ptr, len) {
        return new Uint32Array(this.memory.buffer, ptr, len/4);
    }
    getI32Array(ptr, len) {
        return new Int32Array(this.memory.buffer, ptr, len/4);
    }
    getU64Array(ptr, len) {
        return new Uint64Array(this.memory.buffer, ptr, len/8);
    }
    getI64Array(ptr, len) {
        return new Int64Array(this.memory.buffer, ptr, len/8);
    }
    getF32Array(ptr, len) {
        return new Float32Array(this.memory.buffer, ptr, len/4);
    }
    getF64Array(ptr, len) {
        return new Float64Array(this.memory.buffer, ptr, len/8);
    }
    sendI32Array(funcName, array) {
        /**
         * // See here for an example of copying arrays to wasm
         *  // https://github.com/WebAssembly/design/issues/1231
         * 
         * In order to transfer a js array to wasm, the array must be allocated in wasm first
         * and the ptr obtained. The ptr can then be used like this: new Int32Array(memory.buffer, ptr, length)
         * 
         * Transfering an array from wasm to js is simple because the memory is already allocted on the wasb side.
         * 
         * eg. Malloc an array in wasm code and get the pointer for use by js:
         * 
         * const ptr     = instance.exports.malloc(length);
         * const jsArray = new Int32Array(memory.buffer, ptr, length/4); 
         * // use jsArray here
         * 
         * eg. Copy a js array to wasm code:
         * const ptr       = instance.exports.malloc(length);
         * const wasmArray = new Int32Array(memory.buffer, ptr, length/4); 
         * const jsArray   = new Int32Array([1,2,3]);
         * 
         * // copy js data to array
         * wasmArray.set(jsArray);
         * 
         * // inform wasm function that data is ready
         * instance.exports.processArray(ptr, length);
         */
    
        throw new Error("Not working");
    }
}

