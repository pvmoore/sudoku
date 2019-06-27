module wasm_json;

extern(C):
@nogc:
nothrow:

public:

import app;

struct JSON(OBS) {
@nogc:
nothrow:
private:
    OBS observer;
    string bytes;
    int len;
    int pos;
public:
    this(OBS observer, string bytes) {
        this.observer = observer;
        this.bytes = bytes;
    }
    void parse() {
        auto c = peek();
        if(c=='[') {
            array();
        } else if(c=='{') {
            object();
        } else if(c>='0' && c<='9') {
            number();
        } else {
            log("YELP");
        }
    }
private:
    void array() {
        // [
        observer.onArray(true);
        pos++;

        while(peek()!=']') {
            parse();

            if(peek()==',') pos++;
        }

        // ]
        observer.onArray(false);
        pos++;
    }
    void object() {
        // {
        observer.onObject(true);
        pos++;

        do{
            if(peek()==',') pos++;

            if(peek()=='\"') {
                key();
                parse();
            }
        }while(peek()==',');

        // }
        observer.onObject(false);
        pos++;
    }
    void key() {
        // "
        pos++;

        int start = pos;
        int end = indexOf('\"');
        pos = end+1;

        observer.onKey(bytes[start..end]);

        // :
        pos++;
    }
    void number() {
        // 0..9

        int start = pos;
        while(peek()>='0' && peek()<='9') {
            pos++;
        }

        observer.onNumber(bytes[start..pos]);
    }

    ubyte peek() {
        while(pos<bytes.length) {
            auto c = bytes[pos];
            if(c>32) return c;
            pos++;
        }
        return 0;
    }
    int indexOf(char ch) {
        for(auto i = pos; i<bytes.length; i++) {
            if(bytes[i]==ch) return i;
        }
        return -1;
    }
}


