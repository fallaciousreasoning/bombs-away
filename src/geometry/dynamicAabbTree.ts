import { AABB } from "../core/aabb";

interface Child {
    bounds: AABB;
    owningNode: Node;
}

class Node {
    parent: Node;
    nodes: [Node, Node];

    nodesCrossed: boolean;

    bounds: AABB;
    child: Child;

    constructor() {
        this.nodes = [undefined, undefined];
    }

    isLeaf() {
        return !!this.nodes[0]
    }

    setBranch(node1: Node, node2: Node) {
        node1.parent = this;
        node2.parent = this;

        this.nodes = [node1, node2];
    }

    setLeaf(child: Child) {
        this.child = child;
        child.owningNode = this;

        this.nodes = [undefined, undefined];
    }

    updateBounds(margin: number) {
        if (this.isLeaf()) {
            // Make the bounds fatter than the child by margin.
            this.bounds = this.child.bounds.grow(margin);
        } else {
            // Union of child bounds.
            this.bounds = this.nodes[0].bounds.combine(this.nodes[1].bounds);
        }
    }

    getSibling() {
        return this == this.parent.nodes[0]
            ? this.parent.nodes[1]
            : this.parent.nodes[0];
    }
}

export class AABBTree {
    root: Node;
    margin: number = 0.5;

    add(child: Child) {
        const node = new Node();
        node.setLeaf(child);
        node.updateBounds(this.margin);

        if (this.root)
            this.insertNode(node, this.root);
        else this.root = node;
    }

    insertNode(node: Node, into: Node) {
        if (into.isLeaf()) {
            // Subdivide
            const newNode = new Node();
            newNode.setBranch(node, into);
            this.replace(into, newNode);
        } else {
            const b0 = into.nodes[0].bounds;
            const b1 = into.nodes[1].bounds;

            // See which child would grow least if we inserted the node into it.
            const dB0 = b0.combine(node.bounds).area - b0.area;
            const dB1 = b1.combine(node.bounds).area - b1.area;

            if (dB0 < dB1)
              this.insertNode(node, into.nodes[0]);
            else this.insertNode(node, into.nodes[1]);
        }

        into.updateBounds(this.margin);
    }

    update() {
        if (!this.root)
            return;

        if (this.root.isLeaf()) {
            this.root.updateBounds(this.margin);
            return;
        }

        const invalidNodes = this.getInvalidNodes(this.root);

        for (const node of invalidNodes) {
            const parent = node.parent;
            const sibling = node.getSibling();

            // Replace the our parent with our sibling.
            this.replace(parent, sibling);

            node.updateBounds(this.margin);
            this.insertNode(node, this.root);
        }
    }

    private replace(childNode: Node, withNode: Node) {
        // Root is a special case.
        if (childNode == this.root) {
            this.root = withNode;
            delete withNode.parent;
            return;
        }

        const parent = childNode.parent;
        withNode.parent = parent;

        if (childNode == parent.nodes[0])
            parent.nodes[0] = withNode;
        else if (childNode == parent.nodes[1])
            parent.nodes[1] = childNode;
        else throw new Error("We probably shouldn't be trying to replace this...");
    }

    private getInvalidNodes(node: Node, invalidNodes?: Node[]) {
        invalidNodes = invalidNodes || [];

        if (node.isLeaf()) {
            if (!node.bounds.contains(node.child.bounds))
                invalidNodes.push(node);
        } else {
            this.getInvalidNodes(node.nodes[0], invalidNodes);
            this.getInvalidNodes(node.nodes[1], invalidNodes);
        }

        return invalidNodes;
    }
}