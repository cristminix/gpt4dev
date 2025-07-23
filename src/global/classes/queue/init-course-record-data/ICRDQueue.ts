import type { ICRDQueueItem } from "./ICRDQueueItem"

export class ICRDQueue {
  items: ICRDQueueItem[] = []
  static clone(instance: ICRDQueue) {
    const values = Object.values(instance.items)
    const copyObj = new ICRDQueue()
    values.forEach((item) => {
      copyObj.enqueue(item)
    })
    return copyObj
  }
  constructor() {
    // this.items = []
  }
  // enqueue function
  enqueue(element: ICRDQueueItem) {
    // adding element to the queue
    this.items.push(element)
  }

  // dequeue function
  dequeue() { 
    if (this.isEmpty()) return null
    return this.items.shift()
  }

  peek() {
    if (this.isEmpty()) return null
    return this.items[0]
  }
  isEmpty() {
    return this.items.length === 0
  }
  printQueue() {
    let str = ""
    for (var i = 0; i < this.items.length; i++) str += this.items[i] + " "
    return str
  }
}
