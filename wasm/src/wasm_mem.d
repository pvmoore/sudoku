module wasm_mem;

extern(C):
@nogc:
nothrow:

public:

// Get memory from the browser
int wasmMemorySize();
void wasmMemoryGrow(int pages);

// for string formatting
__gshared char[1024] scratchBuf;

extern __gshared ubyte __heap_base;
private __gshared ubyte* _memptr = &__heap_base;

void* malloc(int size) {
    uint ptr = cast(uint)_memptr;
    _memptr += size;
    return cast(void*)ptr;
}
void free(void* ptr) {
    // do nothing
}
void* realloc(void* ptr, int size) {

    return ptr;
}