import { AABB } from "../core/aabb";
import { Entityish } from "../systems/system";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";

const subdivide = (node: QuadTreeNode) => {
    // Work out dimensions for new nodes.
    const quadrantSize = node.bounds.size.mul(0.5);
    const quadrant = new AABB(node.bounds.min, quadrantSize);

    // Initialize child nodes.
    node.nodes = [
        new QuadTreeNode(quadrant), // Top left
        new QuadTreeNode(quadrant.offset(new Vector2(quadrantSize.x, 0))), // Top right
        new QuadTreeNode(quadrant.offset(quadrantSize)), // Bottom right
        new QuadTreeNode(quadrant.offset(new Vector2(0, quadrantSize.y))), // Bottom left
    ];

    // Insert contents into children.
    for (const child of node.contents) {
        const newParent = node.nodes.find(n => n.contains(child));
        newParent.contents.push(child);
    }

    // Remove node contents.
    node.contents = undefined;
}

interface Child {
    bounds: AABB;
}

class QuadTreeNode {
    bounds: AABB;

    nodes: QuadTreeNode[];
    contents: Child[] = [];

    constructor(bounds: AABB) {
        this.bounds = bounds;
    }

    contains(child: Child) {
        return this.bounds.contains(child.bounds.centre);
    }
}

export class QuadTree {
    root: QuadTreeNode;

    maxItemsPerNode: 10;
    maxDepth: 5;

    constructor(bounds: AABB) {
        this.root = new QuadTreeNode(bounds);
    }

    insert(child: Child, into: QuadTreeNode=undefined, depth=0) {
        into = into || this.root;

        // If the node hasn't been subdivided, insert the new item into it.
        if (!into.nodes) {
            into.contents.push(child);

            // If we can still make new layers, and we have too many items in our node, subdivide!!!
            if (depth < this.maxDepth && into.contents.length > this.maxItemsPerNode) {
                subdivide(into);
            }
            return;
        }

        // Insert into all children that match.
        const nodes = into.nodes.filter(t => t.bounds.intersects(child.bounds));
        for (const node of nodes)
          this.insert(child, node, depth+1);
    }

    update(child: Child) {
        this.remove(child);
        this.insert(child);
    }

    remove(child: Child) {

    }
}