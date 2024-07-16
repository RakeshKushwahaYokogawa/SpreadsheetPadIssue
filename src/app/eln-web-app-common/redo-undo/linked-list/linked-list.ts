import { Node, ILinkedList } from './linked-list.model';

//https://dev.to/glebirovich/typescript-data-structures-linked-list-3o8i
export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null = null;

  private getLast(node: Node<T>): Node<T> {
    return node.next ? this.getLast(node.next) : node;
  }
  public insertInEnd(data: T): Node<T> {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
    } else {
      const lastNode = this.getLast(this.head);
      node.prev = lastNode;
      lastNode.next = node;
    }
    return node;
  }

  public peek(): Node<T> | null {
    if (this.head) return this.getLast(this.head);
    return null;
  }

  public deleteNode(node: Node<T>): void {
    if (!node.prev) {
      this.head = node.next;
    } else {
      const prevNode = node.prev;
      prevNode.next = node.next;
    }
  }

  public traverse(): T[] {
    const array: T[] = [];
    if (!this.head) {
      return array;
    }
    const addToArray = (node: Node<T>): T[] => {
      array.push(node.data);
      return node.next ? addToArray(node.next) : array;
    };
    return addToArray(this.head);
  }

  public getFirst():Node<T> | null {
    if(!this.head) return null;
    const first = (node: Node<T>):Node<T> => {
      return node.next? first(node.next): node;
    }
    return first(this.head);
  }

  public size(): number {
    return this.traverse().length;
  }

  public reset(): void {
    this.head = null;
  }
}
