#!/usr/bin/env node

'use strict';

var utils = require('../utils/utils.js');


/*

0.3 The number puzzle, power of data structure

If the first problem, to find the minimum free number, is a some what useful in
practice, this problem is a ‘pure’ one for fun. The puzzle is to find the 1,500th
number, which only contains factor 2, 3 or 5. The first 3 numbers are of course
2, 3, and 5. Number 60 = 2^2×3^1×5^1 , however it is the 25th number. Number
21 = 2^0×3^1×7^1 , isn’t a valid number because it contains a factor 7. The first 10
such numbers are list as the following.

2,3,4,5,6,8,9,10,12,15

If we consider 1 = 2^0×3^0×5^0 , then 1 is also a valid number and it is the first
one.

*/


/*

0.3.1 The brute-force solution

It seems the solution is quite easy without need any serious algorithms. We can
check all numbers from 1, then extract all factors of 2, 3 and 5 to see if the left
part is 1.

This ‘brute-force’ algorithm works for most small n.

*/

function getNumber1(n) {
  if (!utils.isNumber(n) || n < 1) {
    throw new TypeError();
  }

  var x = 1;
  var i = 0;

  while (true) {
    if (valid(x)) {
      i = i + 1;
      if (i === n) {
        return x;
      }
    }
    x = x + 1;
  }
}

function valid(x) {
  while ((x % 2) === 0) {
    x = x / 2;
  }
  while ((x % 3) === 0) {
    x = x / 3;
  }
  while ((x % 5) === 0) {
    x = x / 5;
  }
  return (x === 1);
}


/*

0.3.2 Improvement 1

Analysis of the above algorithm shows that modular and divide calculations
are very expensive. And they executed a lot in loops. Instead of checking a
number contains only 2, 3, or 5 as factors, one alternative solution is to construct
such number by these factors.

We start from 1, and times it with 2, or 3, or 5 to generate rest numbers.
The problem turns to be how to generate the candidate number in order? One
handy way is to utilize the queue data structure.

A queue data structure is used to push elements at one end, and pops them
at the other end. So that the element be pushed first is also be popped out first.
This property is called FIFO (First-In-First-Out).

The idea is to push 1 as the only element to the queue, then we pop an
element, times it with 2, 3, and 5, to get 3 new elements. We then push them
back to the queue in order. Note that, the new elements may have already
existed in the queue. In such case, we just drop the element. The new element
may also smaller than the others in the queue, so we must put them to the
correct position.

*/

function getNumber2(n) {
  if (!utils.isNumber(n) || n < 1) {
    throw new TypeError();
  }

  var Q = [];
  enqueue(Q, 1);

  var x;
  while (n > 0) {
    x = dequeue(Q);
    uniqueEnqueue(Q, 2 * x);
    uniqueEnqueue(Q, 3 * x);
    uniqueEnqueue(Q, 5 * x);
    n = n - 1;
  }

  return x;
}

function enqueue(Q, x) {
  Q.push(x);
}

function dequeue(Q) {
  return Q.shift();
}

function uniqueEnqueue(Q, x) {
  var i = 0;
  while ((i < Q.length) && (Q[i] < x)) {
    i = i + 1;
  }
  if ((i < Q.length) && (x === Q[i])) {
    return;
  }
  insert(Q, i, x);
}

function insert(Q, i, x) {
  for(var a = Q.length; a > i; a--) {
    Q[a] = Q[a - 1];
  }
  Q[i] = x;
}


/*

The insert function takes O(|Q|) time to find the proper position and insert
it. If the element has already existed, it just returns.

A rough estimation tells that the length of the queue increase proportion to n,
(each time, we extract one element, and pushed 3 new, the increase ratio ≤ 2),
so the total running time is O(1 + 2 + 3 + ... + n) = O(n^2).

Improvement 1 can also be considered in recursive way. Suppose X is the
infinity series for all numbers which only contain factors of 2, 3, or 5. The
following formula shows an interesting relationship.

X = {1} ∪ {2x : ∀x ∈ X} ∪ {3x : ∀x ∈ X} ∪ {5x : ∀x ∈ X} (2)

Where we can define ∪ to a special form so that all elements are stored
in order as well as unique to each other. Suppose that X = {x1, x2, x3...},
Y = {y1, y2, y3, ...}, X' = {x2, x3, ...} and Y' = {y2, y3, ...}. We have

                     X : Y = φ
                     Y : X = φ
X ∪ Y =  {x1, X' ∪ Y } : x1 < y1
         {x1, X' ∪ Y'} : x1 = y1
          {y1, X ∪ Y'} : x1 > y1

*/


/*

0.3.3 Improvement 2

Considering the above solution, although it is much faster than the brute-force
one, It still has some drawbacks. It produces many duplicated numbers and
they are finally dropped when examine the queue. Secondly, it does linear scan
and insertion to keep the order of all elements in the queue, which degrade the
ENQUEUE operation from O(1) to O(|Q|).

If we use three queues instead of using only one, we can improve the solution
one step ahead. Denote these queues as Q2, Q3, and Q5, and we initialize them
as Q2 = {2}, Q3 = {3} and Q5 = {5}. Each time we DEQUEUEed the smallest
one from Q2, Q3, and Q5 as x. And do the following test:

• If x comes from Q2, we ENQUEUE 2x, 3x, and 5x back to Q2, Q3, and
  Q5 respectively;

• If x comes from Q3, we only need ENQUEUE 3x to Q3, and 5x to Q5;
  We needn’t ENQUEUE 2x to Q2, because 2x have already existed in Q3;

• If x comes from Q5, we only need ENQUEUE 5x to Q5; there is no need
  to ENQUEUE 2x, 3x to Q2, Q3 because they have already been in the queues;

We repeatedly ENQUEUE the smallest one until we find the n-th element.
The algorithm based on this idea is implemented as below.

This algorithm loops n times, and within each loop, it extract one head
element from the three queues, which takes constant time. Then it appends
one to three new elements at the end of queues which bounds to constant time
too. So the total time of the algorithm bounds to O(n).

*/


function getNumber3(n) {
  if (!utils.isNumber(n) || n < 1) {
    throw new TypeError();
  }

  if (n === 1) {
    return 1;
  }

  var Q2 = [];
  var Q3 = [];
  var Q5 = [];

  enqueue(Q2, 2);
  enqueue(Q3, 3);
  enqueue(Q5, 5);

  var x;
  while (n > 1) {
    x = Math.min(head(Q2), head(Q3), head(Q5));
    if (x === head(Q2)) {
      dequeue(Q2);
      enqueue(Q2, 2 * x);
      enqueue(Q3, 3 * x);
      enqueue(Q5, 5 * x);
    } else if (x === head(Q3)) {
      dequeue(Q3);
      enqueue(Q3, 3 * x);
      enqueue(Q5, 5 * x);
    } else {
      dequeue(Q5);
      enqueue(Q5, 5 * x);
    }
    n = n - 1;
  }
  return x;
}

function head(Q) {
  return Q[0];
}


/*

This solution can be also implemented in Functional way. We define a function
take(n), which will return the first n numbers contains only factor 2, 3, or 5.

take(n) = f(n, {1}, {2}, {3}, {5})

Where

                                                      X : n = 1
f(n, X, Q2, Q3, Q5) = 
                       f(n − 1, X ∪ {x}, Q'2, Q'3, Q'5) : otherwise

x = min(Q21, Q31, Q51)


                 {Q22, Q23, ...} ∪ {2x}, Q3 ∪ {3x}, Q5 ∪ {5x} : x = Q21
Q'2, Q'3, Q'5 =         Q2, {Q32, Q33, ...} ∪ {3x}, Q5 ∪ {5x} : x = Q31
                               Q2, Q3, {Q52, Q53, ...} ∪ {5x} : x = Q51


*/






module.exports = {
  getNumber1: getNumber1,
  getNumber2: getNumber2,
  getNumber3: getNumber3
};

