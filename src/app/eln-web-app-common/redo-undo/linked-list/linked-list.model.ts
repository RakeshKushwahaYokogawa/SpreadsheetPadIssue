export class Node<T> {
  public next: Node<T> | null = null;
  public prev: Node<T> | null = null;
  public data: T;
  constructor(data: T) {
    this.data = data;
  }
}

export interface ILinkedList<T> {
  insertInEnd(data: T): Node<T>;
  peek(): Node<T> | null;
  deleteNode(node: Node<T>): void;
  traverse(): T[];
  size(): number;
  reset(): void;
}
