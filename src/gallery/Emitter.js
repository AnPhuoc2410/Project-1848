import mitt from 'mitt';

export default class Emitter {
  constructor() {
    this.emitter_instance = mitt();
  }

  $on(name, handler) {
    this.emitter_instance.on(name, handler);
  }

  $emit(name, ...args) {
    this.emitter_instance.emit(name, args);
  }

  $off(name, handler) {
    this.emitter_instance.off(name, handler);
  }
}
