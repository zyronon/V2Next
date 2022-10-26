export default {
  eventMap: new Map(),
  on(eventType, cb) {
    let cbs = this.eventMap.get(eventType);
    if (cbs) {
      cbs.push(cb);
    } else {
      cbs = [cb];
    }
    this.eventMap.set(eventType, cbs);
  },
  emit(eventType, val) {
    // console.log('emit===>', '事件类型===>', eventType, '     值===>', val)
    let cbs = this.eventMap.get(eventType);
    if (cbs) {
      cbs.map((cb) => cb(val));
    }
  },
  off(eventType) {
    let cbs = this.eventMap.has(eventType);
    if (cbs) {
      this.eventMap.delete(eventType);
    }
  },
  clear() {
    this.eventMap = new Map()
  }
};