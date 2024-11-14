// priorityQueue.js

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(complaint) {
        if (this.isEmpty()) {
            this.queue.push(complaint);
        } else {
            let added = false;
            for (let i = 0; i < this.queue.length; i++) {
                if (complaint.priority < this.queue[i].priority) {
                    this.queue.splice(i, 0, complaint);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.queue.push(complaint);
            }
        }
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    getQueue() {
        return this.queue;
    }
}

module.exports = PriorityQueue;
