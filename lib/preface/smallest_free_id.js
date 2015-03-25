#!/usr/bin/env node

'use strict';

var utils = require('../utils/utils.js');


/*

0.2 The smallest free ID problem

This problem is discussed in Chapter 1 of Richard Bird’s book [1]. It’s common
that applications and systems use ID (identifier) to manage objects and entities.
At any time, some IDs are used, and some of them are available for use. When
some client tries to acquire a new ID, we want to always allocate it the smallest
available one. Suppose IDs are non-negative integers and all IDs in use are kept
in a list (or an array) which is not ordered. For example:

[18, 4, 8, 9, 16, 1, 14, 7, 19, 3, 0, 5, 2, 11, 6]

How can you find the smallest free ID, which is 10, from the list?
It seems the solution is quite easy even without any serious algorithms.

It seems this problem is trivial. However, There will be millions of IDs in a
large system. The speed of this solution is poor in such case for it takes O(n^2)
time, where n is the length of the ID list.

*/

function minFree1(A) {
  if (!utils.isArray(A)) {
    throw new TypeError();
  }

  var i = 0;
  while (true) {
    if (A.indexOf(i) === -1) {
      return i;
    } else {
      i = i + 1;
    }
  }
}


/*

0.2.1 Improvement 1

The key idea to improve the solution is based on a fact that for a series of n
numbers x1, x2, ..., xn, if there are free numbers, some of the xi are outside the
range [0, n); otherwise the list is exactly a permutation of 0, 1, ..., n − 1 and n
should be returned as the minimum free number. We have the following fact.

minfree(x1, x2, ..., xn) ≤ n (1)

One solution is to use an array of n + 1 flags to mark whether a number in
range [0, n] is free.


#2 initializes a flag array all of False values. This takes O(n) time. Then
the algorithm scans all numbers in A and mark the relative flag to True if the
value is less than n, This step also takes O(n) time. Finally, the algorithm
performs a linear time search to find the first flag with False value. So the total
performance of this algorithm is O(n). Note that we use n + 1 flags instead of
n flags to cover the special case that sorted(A) = [0, 1, 2, ..., n − 1].

Although the algorithm only takes O(n) time, it needs extra O(n) spaces to
store the flags.

*/

function minFree2(A) {
  if (!utils.isArray(A)) {
    throw new TypeError();
  }

  var i;

  // A: input array
  // n: length of the input array
  var n = A.length;
  // F: "flag" array, it is longer than the input array by 1
  var F = new Array(n + 1);

  // (#2) fill flag array with False
  for (i = 0; i <= n; i++) {
    F[i] = false;
  }
  // scan all numbers in A and mark the relative flag to True if the value is less than n
  for (i = 0; i < n; i++) {
    if (A[i] < n) {
      F[A[i]] = true;
    }
  }
  // a linear time search to find the first flag with False value
  for (i = 0; i <= n; i++) {
    if (F[i] === false) {
      return i;
    }
  }

}


/*

0.2.2 Improvement 2, Divide and Conquer

Although the above improvement is much faster, it costs O(n) extra spaces to
keep a check list. if n is huge number this means a huge amount of space is
wasted.

The typical divide and conquer strategy is to break the problem into some
smaller ones, and solve these to get the final answer.

We can put all numbers xi ≤ bn/2c as a sub-list A' and put all the others
as a second sub-list A''. Based on formula 1 if the length of A' is exactly bn/2c,
this means the first half of numbers are ‘full’, which indicates that the minimum
free number must be in A'' and so we’ll need to recursively seek in the shorter
list A''. Otherwise, it means the minimum free number is located in A', which
again leads to a smaller problem.

When we search the minimum free number in A'', the conditions changes
a little bit, we are not searching the smallest free number starting from 0, but
actually from bn/2c + 1 as the lower bound. So the algorithm is something like
minfree(A, l, u), where l is the lower bound and u is the upper bound index of
the element.

Note that there is a trivial case, that if the number list is empty, we merely
return the lower bound as the result.

This divide and conquer solution can be formally expressed as a function:

minfree(A) = search(A, 0, |A| − 1)


                                       l : A = φ              (1)
search(A, l, u) =  search(A'', m + 1, u) : |A'| = m − l + 1   (2)
                        search(A', l, m) : otherwise          (3)

where

m   = ⌊ (l + u) / 2 ⌋   (4)
A'  = {∀x ∈ A ∧ x ≤ m}  (5)
A'' = {∀x ∈ A ∧ x > m}  (6)

It is obvious that this algorithm doesn’t need any extra space (see #). Each call
performs O(|A|) comparison to build A' and A''. After that the problem scale
halves. So the time needed for this algorithm is T(n) = T(n/2) + O(n) which
reduce to O(n). Another way to analyze the performance is by observing that
the first call takes O(n) to build A0 and A00 and the second call takes O(n/2), and
O(n/4) for the third... The total time is O(n+n/2 +n/4 +...) = O(2n) = O(n).


(#) Procedural programmer may note that it actually takes O(lg n) stack spaces for bookkeeping.
As we’ll see later, this can be eliminated either by tail recursion optimization, for
instance gcc -O2. or by manually changing the recursion to iteration

*/

function minFree3(A) {
  if (!utils.isArray(A)) {
    throw new TypeError();
  }

  var smallestID;

  // A: input array
  // l: lower index
  // u: upper index
  function search(A, l, u) {
    if (A.length === 0) {
      smallestID = l;  // (1)
      return;
    }

    var m = Math.floor((l + u) / 2);  // (4)
    var A1 = [];
    var A2 = [];

    for (var i = 0; i < A.length; i++) {
      if (A[i] <= m) {
        A1.push(A[i]);  // (5)
      } else {
        A2.push(A[i]);  // (6)
      }
    }

    if (A1.length === (m - l + 1)) {
      search(A2, m + 1, u);  // (2)
    } else {
      search(A1, l, m);      // (3)
    }
  }

  search(A, 0, A.length);

  return smallestID;
}


/*

0.2.3 Expressiveness vs. Performance

Imperative language programmers may be concerned about the performance of
this kind of implementation. For instance in this minimum free ID problem, the
number of recursive calls is in O(lg n) , which means the stack size consumed
is in O(lg n). It’s not free in terms of space. But if we want to avoid that, we
can eliminate the recursion by replacing it by an iteration (see #) which yields the
following program.

This program uses a ‘quick-sort’ like approach to re-arrange the array so that
all the elements before lef t are less than or equal to m; while those between
left and right are greater than m.

This program is fast and it doesn’t need extra stack space. However, compared
to the previous Haskell program, it’s hard to read and the expressiveness
decreased. We have to balance performance and expressiveness.

(#) This is done automatically in most functional languages since our function is in tail
recursive form which lends itself perfectly to this transformation

*/

function minFree4(A) {
  if (!utils.isArray(A)) {
    throw new TypeError();
  }

  function swap(i, j) {
    var tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
  }

  var n = A.length;
  var l = 0;
  var u = n - 1;

  while (n) {
    var m = Math.floor((l + u) / 2);
    var right;
    var left = 0;
    for (right = 0; right < n; ++right) {
      if (A[right] <= m) {
        swap(left, right);
        ++left;
      }
    }
    if (left === m - l + 1) {
      A = A.slice(left);
      n = n - left;
      l = m + 1;
    } else {
      n = left;
      u = m;
    }

  }

  return l;
}




module.exports = {
  minFree1: minFree1,
  minFree2: minFree2,
  minFree3: minFree3,
  minFree4: minFree4
};


