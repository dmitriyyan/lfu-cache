class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.freq = 1;
        this.next = this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = new Node(null, null);
        this.tail = new Node(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    insertHead(node) {
        node.next = this.head.next;
        this.head.next.prev = node;
        node.prev = this.head;
        this.head.next = node;
    }

    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node.prev = null;
        node.next = null;
    }

    isEmpty() {
        return this.head.next === this.tail && this.tail.prev === this.head;
    }
}


class LFUCache  {
    constructor() {
        this.capacity = capacity;
        this.values = new Map();
        this.freqs = new Map();
        this.min = 0;
    }

    get (key) {
        if (!this.values.has(key)) {
            return -1;
        }
        const node = this.values.get(key);
        this.incrementFreq(node);
        return node.value;
    }

    incrementFreq (node) {
        const list = this.freqs.get(node.freq);
        list.removeNode(node);
        if (this.min === node.freq && list.isEmpty()) {
            this.freqs.delete(node.freq);
            this.min++;
        }
        node.freq++;
        if (!this.freqs.has(node.freq)) {
            this.freqs.set(node.freq, new DoublyLinkedList());
        }
        this.freqs.get(node.freq).insertHead(node);
    }

    updateValue(key, value) {
        const node = this.values.get(key);
        node.value = value;
        this.incrementFreq(node);
    }

    deleteLFU() {
        const list = this.freqs.get(this.min);
        const node = list.tail.prev;
        list.removeNode(node);
        if (list.isEmpty()) {
            this.freqs.delete(node.freq);
        }
        this.values.delete(node.key);
    }

    _put(key, value) {
        const node = new Node(key, value);
        this.values.set(key, node);
        if (!this.freqs.has(1)) {
            this.min = 1;
            this.freqs.set(1, new DoublyLinkedList());
        }
        this.freqs.get(1).insertHead(node);
    }

    put(key, value) {
        if (this.values.has(key)) {
            this.updateValue(key, value);
        } else {
            if (this.values.size === this.capacity) {
                this.deleteLFU();
            }
            this._put(key, value);
        }
    }
};
/** 
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
