import { LinkedList } from "./linkedList";

test('items can be added', () => {
    let f = new LinkedList<number>();
    f.add(1);
    f.add(2);
    f.add(3);

    expect(f.length).toBe(3);
    expect(f.head.value).toBe(1);
    expect(f.tail.value).toBe(3);
});

test('items can be removed', () => {
    let f = new LinkedList([1,2,3,4,5]);
    f.remove(3);
    f.remove(1);

    expect(f.length).toBe(3);
    expect(f.head.value).toBe(2);
    expect(f.tail.value).toBe(5);
});

test('linked list can be iterated', () => {
    let f = new LinkedList([1,2,3,4,5]);
    const array = [...f];
    expect(array).toEqual([1,2,3,4,5]);
})