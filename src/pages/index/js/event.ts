class Event {
  listeners: any[] = [];

  attach(listener: any): void {
    if (typeof listener !== 'function') return;
    this.listeners.push(listener);
  }

  notify(args?: any): void {
    this.listeners.forEach((elem: any) => {
      elem(args);
    });
  }
}

export default Event;
