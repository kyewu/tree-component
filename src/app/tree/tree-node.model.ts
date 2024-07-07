// tree-node.model.ts
export class TreeNode {
  id: string;
  uniqueId: string;
  label: string;
  children: TreeNode[];
  isLeaf: boolean;
  expanded: boolean;
  selected: boolean;
  visible: boolean;

  constructor(options: {
    id: string;
    uniqueId: string;
    label: string;
    children?: TreeNode[];
    isLeaf?: boolean;
    expanded?: boolean;
    selected?: boolean;
    visible?: boolean;
  }) {
    this.id = options.id;
    this.uniqueId = options.uniqueId;
    this.label = options.label;
    this.children = options.children || [];
    this.isLeaf = options.isLeaf || this.children.length === 0;
    this.expanded = options.expanded || false;
    this.selected = options.selected || false;
    this.visible = options.visible !== undefined ? options.visible : true;
  }
}

export class TreeNodeManager {
  private parentMap = new WeakMap<TreeNode, TreeNode>();

  setParent(child: TreeNode, parent: TreeNode) {
    this.parentMap.set(child, parent);
  }

  getParent(node: TreeNode): TreeNode | undefined {
    return this.parentMap.get(node);
  }

  buildTree(nodes: TreeNode[]): TreeNode[] {
    nodes.forEach(node => {
      if (node.children) {
        node.children.forEach(child => this.setParent(child, node));
        this.buildTree(node.children);
      }
    });
    return nodes;
  }

  buildTreeFromMetadata(metadata: any[]): TreeNode[] {
    const buildNode = (data: any): TreeNode => {
      const node = new TreeNode({
        id: data.id,
        uniqueId: data.uniqueId,
        label: data.label,
        isLeaf: data.isLeaf,
        expanded: data.expanded,
        selected: data.selected,
        children: data.children ? data.children.map(buildNode) : []
      });

      if (node.children) {
        node.children.forEach(child => this.setParent(child, node));
      }

      return node;
    };

    return metadata.map(buildNode);
  }
}