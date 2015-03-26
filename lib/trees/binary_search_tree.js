#!/usr/bin/env node

/**
 * Elementary Algorithms in JavaScript
 *
 * Creator:
 * Peter Bakondy
 * https://github.com/pbakondy/elementary-algorithms-in-javascript/
 *
 * Based on:
 * Elementary Algorithms and Data structures
 * by Larry LIU Xinyu <liuxinyu95@gmail.com>
 * https://github.com/liuxinyu95/AlgoXY
 *
 * License: GNU GPLv3
 */

'use strict';

var utils = require('../utils/utils.js');

/*

1.1 Introduction

Arrays or lists are typically considered the ‘hello world’ data structures. However,
we’ll see they are not actually particularly easy to implement. In some
procedural settings, arrays are the most elementary data structures, and it is
possible to implement linked lists using arrays (see section 10.3). On the
other hand, in some functional settings, linked lists are the elementary building
blocks used to create arrays and other data structures.

Considering these factors, we start with Binary Search Trees (or BST) as the
‘hello world’ data structure using an interesting problem Jon Bentley mentioned
in ‘Programming Pearls’. The problem is to count the number of times each
word occurs in a large text. One solution is below (JavaScript with ES6):

*/

/* jshint -W098 */

function wordcount(text) {

  var dict = new Map();
  var word = '';
  var whitespace = /\s/;

  while (text.length) {
    let chr = text[0];
    text = text.slice(1);

    if (whitespace.test(chr)) {
      if (word.length) {
        let value = dict.get(word);
        dict.set(word, (value ? value + 1 : 1));
        word = '';
      }
    } else {
      word = word + chr;
    }
  }

  var wc = '';
  for (let val of dict) {
    wc += val + '\n';
  }

  return wc;
}

/* jshint  +W098 */

/*

The map provided in the standard template library is a kind of balanced
BST with augmented data. Here we use the words in the text as the keys and
the number of occurrences as the augmented data. This program is fast, and
it reflects the power of BSTs. We’ll introduce how to implement BSTs in this
section and show how to balance them in a later section

Before we dive into BSTs, let’s first introduce the more general binary tree.

Binary trees are recursively defined. BSTs are just one type of binary tree.
A binary tree is usually defined in the following way.

A binary tree is

• either an empty node;

• or a node containing 3 parts: a value, a left child which is a binary tree
  and a right child which is also a binary tree



                              (16)
                          ↙         ↘
                       (4)           (10)
                    ↙       ↘       ↙    ↘
                 (14)        (7)  (9)    (3)
                ↙    ↘      ↙
             (2)     (8)  (1)

       Figure 1.1: Binary tree concept and an example.



A BST is a binary tree where the following applies to each node:

• all the values in left child tree are less than the value of this node;

• the value of this node is less than any values in its right child tree.



                           (4)
                        ↙       ↘
                     (3)         (8)
                    ↙           ↙    ↘
                  (1)         (7)    (16)
                    ↘                ↙
                     (2)          (10)
                                 ↙    ↘
                               (9)    (14)

            Figure 1.2: An example of a BST



1.2 Data Layout

Based on the recursive definition of BSTs, we can draw the data layout in a
procedural setting with pointers.

The node first contains a field for the key, which can be augmented with
satellite data. The next two fields contain pointers to the left and right children,
respectively. To make backtracking to ancestors easy, a parent field is sometimes
provided as well.

In this section, we’ll ignore the satellite data for the sake of simplifying
the illustrations. Based on this layout, the node of BST can be defined in a
procedural language.

*/

var Node = (function(){
  function Node(key, left, right) {
    if (!utils.isNumber(key)) {
      throw new TypeError();
    }

    this.key = key;
    this.left = left ? left : null;
    this.right = right ? right : null;
    this.parent = null;
  }

  Node.prototype.delete = function() {
    if (this.left) {
      this.left.delete();
    }
    if (this.right) {
      this.right.delete();
    }
    this.key = undefined;
    this.left = undefined;
    this.right = undefined;
  };

  return Node;
})();



/*

1.3 Insertion

To insert a key k (sometimes along with a value in practice) to a BST T, we
can use the following algorithm:

• If the tree is empty, construct a leaf node with key = k;

• If k is less than the key of root node, insert it in the left child;

• If k is greater than the key of root node, insert it in the right child.

The exception to the above is when k is equal to the key of the root node,
meaning it already exists in the BST, and we can either overwrite the data, or
just do nothing. To simplify things, this case has been skipped in this section.

This algorithm is described recursively. It’s simplicity is why we consider
the BST structure the ‘hello world’ data structure. Formally, the algorithm can
be represented with a recursive mathematical function:


                                node(φ, k, φ) : T = φ
  insert(T, k) =  node(insert(Tl, k), k', Tr) : k < k'
                  node(Tl, k', insert(Tr, k)) : otherwise

Where Tl is the left child, Tr is the right child, and k' is the key when T
isn’t empty.

The node function creates a new node given the left subtree, a key and a
right subtree as parameters. φ means NIL or empty.

This algorithm can be expressed imperatively using iteration, completely
free of recursion.

*/

// @param <T> T is the root of current tree
// @param <number> k is a new key
// @return <T> root of new Tree
function insert(T, k) {
  var root = T;
  var x = new Node(k);
  var parent = null;

  while (T !== null) {
    parent = T;
    if (k < T.key) {
      T = T.left;
    } else {
      T = T.right;
    }
  }
  x.parent = parent;
  if (parent === null) {
    // tree T is empty
    return x;
  } else if (k < parent.key) {
    parent.left = x;
  } else {
    parent.right = x;
  }
  return root;
}


/*

1.4 Traversing

Traversing means visiting every element one-by-one in a BST. There are 3 ways
to traverse a binary tree: a pre-order tree walk, an in-order tree walk and a
post-order tree walk. The names of these traversal methods highlight the order
in which we visit the root of a BST.

• pre-order traversal:, visit the key, then the left child, finally the right child;

• in-order traversal: visit the left child, then the key, finally the right child;

• post-order traversal: visit the left child, then the right child, finally the key.

Note that each ‘visiting’ operation is recursive. As mentioned before, we see
that the order in which the key is visited determines the name of the traversal
method.

For the BST shown in figure 1.2, below are the three different traversal
results.

• pre-order traversal results: 4, 3, 1, 2, 8, 7, 16, 10, 9, 14;

• in-order traversal results: 1, 2, 3, 4, 7, 8, 9, 10, 14, 16;

• post-order traversal results: 2, 1, 3, 7, 9, 14, 10, 16, 8, 4.

The in-order walk of a BST outputs the elements in increasing order. The
definition of a BST ensures this interesting property, while the proof of this fact
is left as an exercise to the reader.

The in-order tree walk algorithm can be described as:

• If the tree is empty, just return;

• traverse the left child by in-order walk, then access the key, finally traverse
  the right child by in-order walk.

Translating the above description yields a generic map function:

                                φ : T = φ
  map(f, T) = 
               node(Tl', k', Tr') : otherwise

Where

  Tl' = map(f, Tl)
  Tr' = map(f, Tr)
  k'  = f(k)

And Tl, Tr and k are the children and key when the tree isn’t empty.

If we only need access the key without create the transformed tree, we can
realize this algorithm in procedural way lie the below program.

*/

function inOrderWalk(T, fn) {
  if (!utils.isFunction(fn)) {
    throw new TypeError();
  }

  if (T) {
    inOrderWalk(T.left, fn);
    fn(T.key);
    inOrderWalk(T.right, fn);
  }
}


/*

The function takes a parameter fn, it can be a real function, or a function
object, this program will apply f to the node by in-order tree walk.

We can simplified this algorithm one more step to define a function which
turns a BST to a sorted list by in-order traversing.


                                           φ : T = φ
  toList(T) = 
               toList(Tl) ∪ {k} ∪ toList(Tr) : otherwise


Below is the program based on this definition.
*/


// @param <T> Tree
// @return <array> ordered list
function toList(T) {
  if (!T) {
    return [];
  }
  return toList(T.left).concat(T.key, toList(T.right));
}


/*

This provides us a method to sort a list of elements. We can first build a
BST from the list, then output the tree by in-order traversing. This method is
called as ‘tree sort’. Let’s denote the list X = {x1, x2, x3, ..., xn}.

  sort(X) = toList(fromList(X))

And we can write it in function composition form.

  sort = toList.fromList

Where function fromList repeatedly insert every element to an empty BST.

  fromList(X) = foldL(insert, φ, X)

It can also be written in partial application form (see #2) like below.

  fromList = foldL insert φ

For the readers who are not familiar with folding from left, this function can
also be defined recursively as the following.


                                                       φ : T = φ
  fromList(T) = 
                 insert(fromList({x2, x3, ..., xn}), x1) : otherwise


We’ll intense use folding function as well as the function composition and
partial evaluation in the future, please refer to appendix of this book or
[6] [7] and [8] for more information.


(#2) Also known as ’Curried form’ to memorialize the mathematican and logician Haskell
Curry

*/

// @param <array> X
// @return <T> Tree
function fromList(X) {
  if (!utils.isArray(X)) {
    throw new TypeError();
  }

  if (!X.length) {
    return null;
  }
  var first = X.shift();
  return insert(fromList(X), first);
}


/*

Exercise 1.1

• Given the in-order traverse result and pre-order traverse result, can you reconstruct
  the tree from these result and figure out the post-order traversing
  result?

  – Pre-order result: 1, 2, 4, 3, 5, 6;
  – In-order result: 4, 2, 1, 5, 3, 6;
  – Post-order result: ?

• Write a program in your favorite language to re-construct the binary tree
  from pre-order result and in-order result.

• Prove why in-order walk output the elements stored in a binary search
  tree in increase order?

• Can you analyze the performance of tree sort with big-O notation?

*/


/*

1.5 Querying a binary search tree

There are three types of querying for binary search tree, searching a key in the
tree, find the minimum or maximum element in the tree, and find the predecessor
or successor of an element in the tree.

1.5.1 Looking up

According to the definition of binary search tree, search a key in a tree can be
realized as the following.

• If the tree is empty, the searching fails;

• If the key of the root is equal to the value to be found, the search succeed.
  The root is returned as the result;

• If the value is less than the key of the root, search in the left child.
• Else, which means that the value is greater than the key of the root, search
  in the right child.

This algorithm can be described with a recursive function as below.

                              φ : T = φ
  lookup(T, x) =              T : k = x
                  lookup(Tl, x) : x < k
                  lookup(Tr, x) : otherwise

Where Tl, Tr and k are the children and key when T isn’t empty. In the real
application, we may return the satellite data instead of the node as the search
result. This algorithm is simple and straightforward.

*/

function lookup(T, x) {
  if (!T) {
    return null;
  }
  if (T.key === x) {
    return T;
  }
  if (x < T.key) {
    return lookup(T.left, x);
  } else {
    return lookup(T.right, x);
  }
}


/*

If the BST is well balanced, which means that almost all nodes have both
non-NIL left child and right child, for n elements, the search algorithm takes
O(lg n) time to perform. This is not formal definition of balance. We’ll show it
in later post about red-black-tree. If the tree is poor balanced, the worst case
takes O(n) time to search for a key. If we denote the height of the tree as h, we
can uniform the performance of the algorithm as O(h).

The search algorithm can also be realized without using recursion in a procedural
manner.

*/

function search(T, x) {
  while ((T) && (T.key !== x)) {
    if (x < T.key) {
      T = T.left;
    } else {
      T = T.right;
    }
  }
  return T;
}


/*

1.5.2 Minimum and maximum

Minimum and maximum can be implemented from the property of binary search
tree, less keys are always in left child, and greater keys are in right.

For minimum, we can continue traverse the left sub tree until it is empty.
While for maximum, we traverse the right.

  min(T) = {       k : Tl = φ
           { min(Tl) : otherwise

  max(T) = {       k : Tr = φ
           { max(Tr) : otherwise

Both functions bound to O(h) time, where h is the height of the tree. For
the balanced BST, min/max are bound to O(lg n) time, while they are O(n) in
the worst cases.

*/


function min(T) {
  if (!T) {
    return null;
  }
  if (!T.left) {
    return T.key;
  }
  return min(T.left);
}

function max(T) {
  if (!T) {
    return null;
  }
  if (!T.right) {
    return T.key;
  }
  return max(T.right);
}


/*

1.5.3 Successor and predecessor

The last kind of querying is to find the successor or predecessor of an element. It
is useful when a tree is treated as a generic container and traversed with iterator.
We need access the parent of a node to make the implementation simple.

It seems hard to find the functional solution, because there is no pointer like
field linking to the parent node. One solution is to left ‘breadcrumbs’ when we
visit the tree, and use these information to back-track or even re-construct the
whole tree. Such data structure, that contains both the tree and ‘breadcrumbs’
is called zipper. Please refer to [9] for details.

However, If we consider the original purpose of providing succ/pred function,
‘to traverse all the BST elements one by one‘ as a generic container, we realize
that they don’t make significant sense in functional settings because we can
traverse the tree in increase order by map function we defined previously.
We’ll meet many problems in this series of post that they are only valid in
imperative settings, and they are not meaningful problems in functional settings
at all. One good example is how to delete an element in red-black-tree [3].

In this section, we’ll only present the imperative algorithm for finding the
successor and predecessor in a BST.

When finding the successor of element x, which is the smallest one y that
satisfies y > x, there are two cases. If the node with value x has non-NIL right
child, the minimum element in right child is the answer; For example, in Figure
1.2, in order to find the successor of 8, we search it’s right sub tree for the
minimum one, which yields 9 as the result. While if node x don’t have right
child, we need back-track to find the closest ancestor whose left child is also
ancestor of x. In Figure 1.2, since 2 don’t have right sub tree, we go back to its
parent 1. However, node 1 don’t have left child, so we go back again and reach
to node 3, the left child of 3, is also ancestor of 2, thus, 3 is the successor of
node 2.

Based on this description, the algorithm can be given as the following.

*/

// @param <Node> x
function succ(x) {
  if (x.right) {
    return min(x.right);
  }
  var p = x.parent;
  while (p && x === p.right) {
    x = p;
    p = p.parent;
  }
  return p;
}


/*

If x doesn’t has successor, this algorithm returns NIL. The predecessor case
is quite similar to the successor algorithm, they are symmetrical to each other.

*/

// @param <Node> x
function pred(x) {
  if (x.left) {
    return max(x.left);
  }
  var p = x.parent;
  while (p && x === p.left) {
    x = p;
    p = p.parent;
  }
  return p;
}


/*

Exercise 1.2

• Can you figure out how to iterate a tree as a generic container by using
  Pred/Succ? What’s the performance of such traversing process in terms
  of big-O?

• A reader discussed about traversing all elements inside a range [a, b].
  In C++, the algorithm looks like the below code:

    for each (m.lower bound(12), m.upper bound(26), f);

  Can you provide the purely function solution for this problem?

*/


/*

1.6 Deletion

Deletion is another ‘imperative only’ topic for binary search tree. This is because
deletion mutate the tree, while in purely functional settings, we don’t modify
the tree after building it in most application.

However, One method of deleting element from binary search tree in purely
functional way is shown in this section. It’s actually reconstructing the tree but
not modifying the tree.

Deletion is the most complex operation for binary search tree. this is because
we must keep the BST property, that for any node, all keys in left sub tree are
less than the key of this node, and they are all less than any keys in right sub
tree. Deleting a node can break this property.

In this post, different with the algorithm described in [2], A simpler one from
SGI STL implementation is used [6].

To delete a node x from a tree.

• If x has no child or only one child, splice x out;

• Otherwise (x has two children), use minimum element of its right sub tree
  to replace x, and splice the original minimum element out.

The simplicity comes from the truth that, the minimum element is stored in
a node in the right sub tree, which can’t have two non-NIL children. It ends up
in the trivial case, the node can be directly splice out from the tree.

Based on this idea, the deletion can be defined as the below function.

                                           φ : T = φ
                  node(delete(Tl, x), K, Tr) : x < k
  delete(T, x) =  node(Tl, k, delete(Tr, x)) : x > k
                                          Tr : x = k ∧ Tl = φ
                                          Tl : x = k ∧ Tr = φ
                  node(Tl, y, delete(Tr, y)) : otherwise

Where

  Tl = left(T)
  Tr = right(T)
  k  = key(T)
  y  = min(Tr)

Translating the function to JavaScript the below program.

*/

// @param <Tree> T - root of the tree
// @param <Number> x - value to delete
// @return <Tree> T - root of the new tree
function deleteValue(T, x) {
  if (!T) {
    return null;
  }
  if (x < T.key) {
    return new Node(T.key, deleteValue(T.left, x), T.right);
  }
  if (x > T.key) {
    return new Node(T.key, T.left, deleteValue(T.right, x));
  }
  if ((x === T.key) && !T.left) {
    return T.right;
  }
  if ((x === T.key) && !T.right) {
    return T.left;
  }
  return new Node(min(T.right), T.left, deleteValue(T.right, min(T.right)));
}


/*

Note that the algorithm first performs search to locate the node where the element
need be deleted, after that it execute the deletion. This algorithm takes O(h) time
where h is the height of the tree.

It’s also possible to pass the node but not the element to the algorithm for
deletion. Thus the searching is no more needed.

The imperative algorithm is more complex because it need set the parent
properly. The function will return the root of the result tree.

*/

// @param <Tree> T - root of the tree
// @param <Node> x - node to delete
// @return <Tree> T - root of the new tree
function deleteNode(T, x) {
  if (!x) {
    return T;
  }

  var root = T;
  var x1 = x;
  var parent = x.parent;

  if (!x.left) {
    x = x.right;
  } else if (!x.right) {
    x = x.left;
  } else {
    // both children are non-NIL
    var y = min(x.right);
    x.key = y.key;
    // Copy other satellite data from y to x
    if (y.parent !== x) {
      // y hasn’t left sub tree
      y.parent.left = y.right;
    } else {
      // y is the root of right child of x
      x.right = y.right;
    }
    return root;
  }

  if (x) {
    x.parent = parent;
  }

  if (!parent) {
    // We are removing the root of the tree
    root = x;
  } else {
    if (parent.left === x1) {
      parent.left = x;
    } else {
      parent.right = x;
    }
  }

  return root;
}


/*

Here we assume the node to be deleted is not empty (otherwise we can simply
returns the original tree). In other cases, it will first record the root of the tree,
create copy pointers to x, and its parent.

If either of the children is empty, the algorithm just splice x out. If it has
two non-NIL children, we first located the minimum of right child, replace the
key of x to y’s, copy the satellite data as well, then splice y out. Note that there
is a special case that y is the root node of x’s right sub tree.

Finally we need reset the stored parent if the original x has only one nonNIL
child. If the parent pointer we copied before is empty, it means that we are
deleting the root node, so we need return the new root. After the parent is set
properly, we finally remove the old x from memory.

Because the procedure seeks minimum element, it runs in O(h) time on a
tree of height h.

*/


/*

Exercise 1.3

• There is a symmetrical solution for deleting a node which has two non-NIL
  children, to replace the element by splicing the maximum one out off the
  left sub-tree. Write a program to implement this solution.

*/


/*

1.7 Randomly build binary search tree

It can be found that all operations given in this post bound to O(h) time for a
tree of height h. The height affects the performance a lot. For a very unbalanced
tree, h tends to be O(n), which leads to the worst case. While for balanced tree,
h close to O(lg n). We can gain the good performance.

How to make the binary search tree balanced will be discussed in next post.
However, there exists a simple way. Binary search tree can be randomly built as
described in [2]. Randomly building can help to avoid (decrease the possibility)
unbalanced binary trees. The idea is that before building the tree, we can call
a random process, to shuffle the elements.

*/


/*

Exercise 1.4

• Write a randomly building process for binary search tree.

*/


/*

Bibliography

[1] Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest and Clifford
    Stein. “Introduction to Algorithms, Second Edition”. ISBN:0262032937.
    The MIT Press. 2001

[2] Jon Bentley. “Programming Pearls(2nd Edition)”. Addison-Wesley Professional;
    2 edition (October 7, 1999). ISBN-13: 978-0201657883

[3] Chris Okasaki. “Ten Years of Purely Functional Data Structures”.
    http://okasaki.blogspot.com/2008/02/ten-years-of-purely-functional-data.html

[4] SGI. “Standard Template Library Programmer’s Guide”.
    http://www.sgi.com/tech/stl/

[5] http://en.literateprograms.org/Category:Binary_search_tree

[6] http://en.wikipedia.org/wiki/Fold_(higher-order_function)

[7] http://en.wikipedia.org/wiki/Function_composition

[8] http://en.wikipedia.org/wiki/Partial_application

[9] Miran Lipovaca. “Learn You a Haskell for Great Good! A Beginner’s
    Guide”. the last chapter. No Starch Press; 1 edition April 2011, 400 pp.
    ISBN: 978-1-59327-283-8

*/



module.exports = {
  Node: Node,
  insert: insert,
  inOrderWalk: inOrderWalk,
  toList: toList,
  fromList: fromList,
  lookup: lookup,
  search: search,
  min: min,
  max: max,
  succ: succ,
  pred: pred,
  deleteValue: deleteValue,
  deleteNode: deleteNode
};


