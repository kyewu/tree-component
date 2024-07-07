import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode, TreeNodeManager } from './tree-node.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent {
  @Input() treeMetadata: any[] = [];
  nodes: TreeNode[] = [];
  treeNodeManager = new TreeNodeManager();
  searchValue = '';

  ngOnInit() {
    this.nodes = this.treeNodeManager.buildTreeFromMetadata(this.treeMetadata);
  }

  toggleExpanded(node: TreeNode): void {
    node.expanded = !node.expanded;
  }


  toggleSelected(node: TreeNode): void {
    if (node.isLeaf) {
      this.handleLeafSelection(node);
    } else {
      node.selected = !node.selected;
      this.updateChildrenSelected(node);
    }
    this.updateParentSelected(node);
  }

  handleLeafSelection(node: TreeNode): void {
    const parent = this.treeNodeManager.getParent(node);
    if (parent) {
      if (!node.selected) {
        // 如果当前节点要被选中
        // 取消同级其他叶子节点的选中状态
        parent.children.forEach(child => {
          if (child.isLeaf && child !== node) {
            child.selected = false;
          }
        });
      }
      // 切换当前节点的选中状态
      node.selected = !node.selected;
    } else {
      // 如果没有父节点（根节点），直接切换状态
      node.selected = !node.selected;
    }
  }

  updateParentSelected(node: TreeNode): void {
    const parent = this.treeNodeManager.getParent(node);
    if (parent) {
      const selectedChildren = parent.children.filter(child => child.selected);
      const allLeafChildren = parent.children.every(child => child.isLeaf);

      if (allLeafChildren) {
        // 如果所有子节点都是叶子节点，那么父节点的选中状态取决于是否有一个子节点被选中
        parent.selected = selectedChildren.length > 0;
      } else {
        // 如果存在非叶子子节点，那么保持原来的逻辑
        const allSelected = parent.children.every(child => child.selected);
        parent.selected = allSelected;
      }

      this.updateParentSelected(parent);
    }
  }

  updateChildrenSelected(node: TreeNode): void {
    if (node.children) {
      node.children.forEach(child => {
        child.selected = node.selected;
        this.updateChildrenSelected(child);
      });
    }
  }

  searchNodes(): void {
    if (this.searchValue.trim() === '') {
      this.resetTreeState(this.nodes);
    } else {
      this.searchNodeRecursive(this.nodes, this.searchValue.toLowerCase());
    }
  }

  searchNodeRecursive(nodes: TreeNode[], searchValue: string): boolean {
    return nodes.some(node => {
      const isMatched = node.label.toLowerCase().includes(searchValue);
      const childrenMatched = node.children && this.searchNodeRecursive(node.children, searchValue);

      if (isMatched || childrenMatched) {
        node.expanded = true;
        node.visible = true;
        return true;
      } else {
        node.expanded = false;
        node.visible = false;
        return false;
      }
    });
  }

  resetTreeState(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      node.visible = true;
      node.expanded = node.children && node.children.length > 0 ? node.expanded : false;
      if (node.children) {
        this.resetTreeState(node.children);
      }
    });
  }
}
