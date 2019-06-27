module cell;

public:
extern(C):
@nogc:
nothrow:

import wasm_util;

alias CellRef = Cell*;

struct Cell {
@nogc:
nothrow:
align(4):
    int index;           // cell index
    int box;             // box index
    
    int value;           // 0 to 9 (0==unset)
    bool isUser;         // true if placed by user
    int[9] scratch;

    void zeroScratch() {
        zeroMem(scratch.ptr, 9);
    }
}
