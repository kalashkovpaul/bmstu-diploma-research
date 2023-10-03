function update_dom(node, d_old, d_new) {
    for (let child in node.children) {
        if (child == d_old)
            child = d_new;
        update(child);
        if (!child.children.is_empty())
            update_dom(child, d_old, d_new);
    }
}
// n - количество вершин
// x - трудоёмкость update
// old - случ.величина, 1 - если надо менять, 0 иначе
// E(old) - мат.ожидание случайной величины old
// для одного вызова:
// n * (2 + 1 + E(old) + x + 2 + 3)
// old может принимать значение...
// E(old) = 1 * 1/n  + 0 * (n - 1) / n = 1/n
// Итого: 8n + xn + 1
// Тета (малая) (n)


function update_vdom(vdom_old_root, vdom_new_root) {
    let node_diffs = [];
    let tree_diffs = [];
    reconciliate(vdom_old_root, vdom_new_root, node_diffs, tree_diffs);
    for (let prop_diff in node_diffs) {
        update(prop_diff.node, prop_diff.diffs);
    }
    for (let diff in tree_diffs) {
        update_dom(diff.node, diff.old_node, diff.new_node);
    }
}
// k - случайная величина, может принимать от 0 до n
// E(k) = n/(n + 1) + (n-1)/(n + 1) + ... =
//      = 1 / (n + 1) * (n + 0) * (n + 1) / 2 = n / 2
// t - от 0 до n - k
// E(t) = (n - E(k)) / (n - E(k) + 1) + (n - E(k) - 1) / (n - E(k) + 1) + ...
//      = 1 / (n - E(k) + 1) * (n - E(k) + 0) * (n - E(k) + 1) / 2
//      = (n - E(k)) / 2 = n / 4
// 2 + f_reconciliate + 2 + k * (3 + x) + 2 + t * (3 + f_dom)
// f_update_vdom = ... = teta (n)


// х.с. - вызывается reconciliate для всех узлов (n раз) и во всех листах
// есть изменения
// k - количество листов - от 1 до n - 1
// m - количество параметров
// lambda - столько узлов добавляем в каждый лист
// для всех остальных вызывается последний else и находятся изменения
// (n + lambda) * (5 + 1 + 2 + m * (3 + 2 + m * (3 + 1 + 3)) + 2 + 7 + 4 + 4 + 7) + (n + lambda) * (2 + 2 + 2) + n * 3 + (n + lambda) * 3 + lambda + 1
// (n + lambda) * (41 + m * (5 + 7m)) + 3n + lambda + 1
// 7m^2(n + lambda) +5m(n + lambda) + 44n + 42lambda + 1
// 5 +
// л.с. 9
function reconciliate(old_root, new_root, node_diffs, tree_diffs) {
    if (old_root == null) {
        tree_diffs.push({
            node: new_root.parent,
            old_node: null,
            new_node: new_root
        });
    } else if (new_root = null) {
        tree_diffs.push({
            node: old_root.parent,
            old_node: old_root,
            new_node: null
        });
    } else if (old_root.type != new_root.type) {
        tree_diffs.push({
            node: old_root,
            old_node: old_root,
            new_node: new_root
        });
    } else {
        // 1 + 2 + m * (3 + 2 + m * (3 + 1 + 3)) +
        let diffs = [];
        for (let old_prop in old_root.props) {
            for (let new_prop in new_root.props) {
                if (old_prop != new_prop)
                    diffs.push({old_prop, new_prop});
            }
        }
        // + 2 + 7 + 4
        if (!diffs.is_empty()) {
            if (old_root.parent != null && !(new_root.key in parent.keys)) {
                tree_diffs.push({
                    node: old_root.parent,
                    old_node: old_root,
                    new_node: new_root
                });
            } else {
                node_diffs.push({node: new_root, diffs});
            }
        }
        // + 4 + 7
        // (n + lambda) * (2 + 2 + 2) + n * 3 + (n + lambda) * 3 +
        // + lambda * 1
        // и для листовых
        let i = 0, j = 0;
        let old_child = null, new_child = null;
        while (i < old_root.children.length || j < new_root.children.length) {
            if (i < old_root.children.length)
                old_child = old_root.children[i];
            if (j < new_root.children.length)
                new_child = new_root.children[j];
            reconciliate(old_child, new_child, node_diffs, tree_diffs);
            i++;
            j++;
            if (i == old_root.children.length)
                old_child = null;
            if (j == new_root.children.length)
                new_child = null;
        }
    }
}