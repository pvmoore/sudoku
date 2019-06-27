module test;

extern(C):
@nogc:
nothrow:

void _start() {}

struct Blob {
    int value;
    int value2;
}

int add(int a, int b) {
    callbackString("hello".ptr, 5);

    int[6] array;
    for(auto i=0; i<6; i++) array[i] = i;
    callbackArray(array.ptr, int.sizeof*6);

    for(auto i=0; i<6; i++) array[i] = i*10;
    callbackArray(array.ptr, int.sizeof*6);

    int[6] array2;
    for(auto i=0; i<6; i++) array2[i] = i*100;
    callbackArray(array2.ptr, int.sizeof*6);

    return a+b;
}
int addArray(int* array, int len) {
    int total = 0;
    for(auto i=0; i<len; i++) {
        total += array[i];
    }
    return total;
}

void callbackString(immutable(char)* value, uint len);
void callbackArray(int* array, int);

