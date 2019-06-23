
export { Events, EventListener };

interface EventListener<EVENT> {
    onEvent(e:EVENT, payload:Object);
}
 
class Events<EVENT> {
    private listeners:Array<EventListener<EVENT>> = [];

    register(l:EventListener<EVENT>) {
        this.listeners.push(l);
        //console.log(`Events: register ${l.constructor.name} num listeners=${this.listeners.length}`);
    }
    unregister(l:EventListener<EVENT>) {
        this.listeners.remove(l);
        //console.log(`Events: unregister ${l.constructor.name} num listeners=${this.listeners.length}`);
    }
    fire(e:EVENT, payload:Object) {
        //console.log(`Events: fire id:${JSON.stringify(e)} data:${JSON.stringify(payload)} listeners:(${this.listeners.length})`);

        this.listeners.forEach((l)=> {
            window.setTimeout(()=>{
                l.onEvent(e, payload);
            });
        });
    }
}