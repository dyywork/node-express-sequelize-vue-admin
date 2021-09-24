
export function compare (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

export function generateTree (treeData, props = {pId: 'pId', id: 'id'}) {
    const tmpTree = treeData.filter(node => node[props.pId] === null || node[props.pId] === '')
    // 递归生成节点及子节点数据
    const findChildren = (tree) => {
        tree.forEach(node => {
            node.children = treeData.filter(cNode => cNode[props.pId] == node[props.id])
            if (node.children.length > 0) {
                findChildren(node.children)
            }
        })
    }
    findChildren(tmpTree)
    return tmpTree
}


