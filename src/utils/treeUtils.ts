import type { TreeNode } from '../types/types';

export const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const removeNode = (
    tree: TreeNode,
    nodeId: string
): { tree: TreeNode; removed: TreeNode | null } => {
    const cloned = deepClone(tree);
    let removed: TreeNode | null = null;

    const findAndRemove = (node: TreeNode): boolean => {
        if (!node.children) return false;

        const index = node.children.findIndex(child => child.id === nodeId);
        if (index !== -1) {
            removed = node.children[index];
            node.children.splice(index, 1);
            return true;
        }

        return node.children.some(child => findAndRemove(child));
    };

    findAndRemove(cloned);
    return { tree: cloned, removed };
};

export const insertNode = (
    tree: TreeNode,
    targetParentId: string,
    nodeToInsert: TreeNode,
    position: number
): TreeNode => {
    const cloned = deepClone(tree);

    const findAndInsert = (node: TreeNode): boolean => {
        if (node.id === targetParentId) {
            if (!node.children) node.children = [];
            node.children.splice(position, 0, nodeToInsert);
            return true;
        }
        if (node.children) {
            return node.children.some(child => findAndInsert(child));
        }
        return false;
    };

    findAndInsert(cloned);
    return cloned;
};

