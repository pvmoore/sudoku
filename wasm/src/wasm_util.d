module wasm_util;

extern(C):
@nogc:
nothrow:

public:

import app;
import wasm_mem;

T as(T)(T thing) {
    return cast(T)thing;
}

struct List(T,int CAPACITY) {
@nogc:
nothrow:
private:
    alias LIST = List!(T,CAPACITY);
    T[CAPACITY] array;
    int _length;
public:
    T* ptr()     { return array.ptr; }
    int length() { return _length; }

    extern(D)
    int opApply(int delegate(T) @nogc nothrow dg) {
        int result = 0;
        for(auto i=0; i<_length; i++) {
            result = dg(array[i]);
            if(result) break;
        }
        return result;
    }
    void reset() {
        _length = 0;
    }
    LIST copy() {
        LIST list;
        for(auto i=0; i<_length; i++) {
            list.array[i] = array[i];
        }
        list._length = _length;
        return list;
    }

    auto add(T value) {
        array[_length++] = value;
        return this;
    }
    auto add(T[] values...) {
        for(auto i=0; i<values.length; i++) {
            array[_length++] = values[i];
        }
        return this;
    }
    auto add(L)(L values) {
        for(auto i=0; i<values._length; i++) {
            array[i+_length++] = values.array[i];
        }
        return this;
    }
    int count(T value) {
        int c = 0;
        for(auto i = 0; i<_length; i++) {
            if(array[i]==value) c++;
        }
        return c;
    }
    /**
     *  list.each((v) { });
     */
    void each(void delegate(T v) nothrow @nogc functor) {
        for(auto i = 0; i<_length; i++) {
            functor(array[i]);
        }
    }
    /**
     *  list.each((v,i) { });
     */
    void each(void delegate(T v, int index) nothrow @nogc functor) {
        for(auto i = 0; i<_length; i++) {
            functor(array[i], i);
        }
    }
    /** 
     *  list.filter(v=>v<5) // ==> returns new List!T
     *      .each((v,i){});
     */
    auto filter(bool delegate(T v) nothrow @nogc functor) {
        LIST temp;
        for(auto i = 0; i<_length; i++) {
            if(functor(array[i])) {
                temp.add(array[i]);
            }
        }
        return temp;
    }
    /** 
     *  list.map(v=>return v*2f);
     */
    auto map(K)(K delegate(T v) nothrow @nogc functor) {
        List!(K,CAPACITY) temp;
        for(auto i = 0; i<_length; i++) {
            auto v = functor(array[i]);
            temp.add(v);
        }
        return temp;
    }
}

void log(string msg) {
    jsLog(msg.ptr, msg.length);
}
void logI(int num) {
    int len = intToString(num, scratchBuf.ptr);
    jsLog(cast(immutable(char)*)scratchBuf.ptr,len);
}
void logSI(string prefix, int num) {
    memcpy(scratchBuf.ptr, cast(char*)prefix.ptr, prefix.length);

    int len = intToString(num, scratchBuf.ptr+prefix.length);

    jsLog(cast(immutable(char)*)scratchBuf.ptr, len+prefix.length);
}

void* memcpy(void* dest, void* src, int size) {
    auto d = cast(ubyte*)dest;
    auto s = cast(ubyte*)src;
    for(auto i=0; i<size; i++) {
        *d++ = *s++;
    }
    return dest;
}
void* memset(void* ptr, int val, int size) {
    ubyte* dest = cast(ubyte*)ptr;
    ubyte c     = cast(ubyte)val;
    for(auto i=0; i<size; i++) {
        *dest++ = c;
    }
    return ptr;
}
int memcmp(ubyte* ptr1, ubyte* ptr2, uint numBytes) {
    for(auto i=0; i<numBytes; i++) {
        if(ptr1[i] < ptr2[i]) return -1;
        if(ptr1[i] > ptr2[i]) return 1;
    }
    return 0;
}
void zeroMem(T)(T* ptr, int count) {
    for(auto i=0; i<count; i++) {
        *ptr++ = 0;
    }
}   
// Only handles positive integers
uint powi(int n, uint power) {
    if(power==0) return 1;
    if(power==1) return n;

    for(auto i=0; i<power-1; i++) {
        n *= n;
    }
    return n;
}
// Return the int representation of the string in _str_ of length _len_
int stringToInt(inout char* str, int len) {
    int r = 0;
    int mul = powi(10, len-1);
    for(auto i=0; i<len; i++) {
        int ch = (str[i] - '0') * mul;
        r += ch;
        mul /= 10;
    }
    return r;
}
// Assume the buffer is at least 32 bytes
int intToString(int n, char* buffer) {
    if(n==0) {
        buffer[0] = '0';
        return 1;
    }
    int pos = 0;
    while(n) {
        auto r = (n%10) + '0';
        n /= 10;
        buffer[pos++] = cast(char)r;
    }
    if(pos>1) {
        // reverse the buffer
        ubyte[32] temp;
        memcpy(temp.ptr, buffer, pos);
        for(auto i=pos-1; i>=0; i--) {
            *buffer++ = temp[i];
        }
    }
    return pos;
}
