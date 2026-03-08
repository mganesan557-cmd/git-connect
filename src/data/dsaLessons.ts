import { Topic } from "./pythonLessons";

export const dsaTopics: Topic[] = [
  {
    id: "dsa-linear",
    title: "Linear Data Structures",
    icon: "📊",
    color: "hsl(var(--syntax-function))",
    lessons: [
      {
        id: "dsa-arrays",
        title: "Arrays",
        description: "Contiguous memory, O(1) access.",
        content: `An **array** stores elements in contiguous memory. Access is O(1) by index, but insertion/deletion at arbitrary positions is O(n).\n\nArrays are the foundation of many other data structures. **Dynamic arrays** (like Python lists, Java ArrayList) resize automatically.\n\nCommon operations: access O(1), search O(n), insert at end O(1) amortized, insert at position O(n).`,
        code: `# Array operations\narr = [10, 20, 30, 40, 50]\n\n# Access O(1)\nprint(f"arr[2] = {arr[2]}")  # 30\n\n# Search O(n)\nprint(f"Index of 40: {arr.index(40)}")\n\n# Insert at end O(1) amortized\narr.append(60)\nprint(f"After append: {arr}")\n\n# Insert at position O(n)\narr.insert(1, 15)\nprint(f"After insert(1, 15): {arr}")\n\n# Delete O(n)\narr.remove(30)\nprint(f"After remove(30): {arr}")\n\n# Two-pointer technique\ndef two_sum_sorted(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target: return (left, right)\n        elif s < target: left += 1\n        else: right -= 1\n    return None\n\nsorted_arr = [1, 3, 5, 7, 9, 11]\nprint(f"Two sum (target=12): {two_sum_sorted(sorted_arr, 12)}")`,
        language: "Python",
        expectedOutput: `arr[2] = 30\nIndex of 40: 3\nAfter append: [10, 20, 30, 40, 50, 60]\nAfter insert(1, 15): [10, 15, 20, 30, 40, 50, 60]\nAfter remove(30): [10, 15, 20, 40, 50, 60]\nTwo sum (target=12): (1, 4)`,
        tips: [
          "Arrays provide O(1) random access — fastest for lookups",
          "Two-pointer technique is powerful for sorted arrays",
          "Sliding window is great for subarray problems",
          "Dynamic arrays double in size when full (amortized O(1) append)",
        ],
        questions: [
          { question: "What is array access time complexity?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], answer: 1, explanation: "Array access by index is O(1) due to contiguous memory." },
          { question: "What is the cost of inserting at position 0?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "Inserting at the beginning requires shifting all elements — O(n)." },
          { question: "What does 'contiguous memory' mean?", options: ["Random locations", "Elements stored next to each other", "Linked elements", "Scattered"], answer: 1, explanation: "Contiguous means elements occupy consecutive memory addresses." },
          { question: "What is amortized O(1)?", options: ["Always O(1)", "O(1) on average over many ops", "O(n) usually", "O(log n)"], answer: 1, explanation: "Amortized O(1) means occasional O(n) ops but O(1) on average." },
          { question: "When is two-pointer technique useful?", options: ["Unsorted arrays", "Sorted arrays/linked lists", "Trees", "Graphs"], answer: 1, explanation: "Two pointers work efficiently on sorted arrays and linked lists." },
        ],
      },
      {
        id: "dsa-linked-list",
        title: "Linked Lists",
        description: "Dynamic linear data structure.",
        content: `A **linked list** stores elements in nodes, each containing data and a reference to the next node.\n\n**Advantages**: O(1) insertion/deletion at known positions, dynamic size.\n**Disadvantages**: O(n) access (no random access), extra memory for pointers.\n\nVariants: singly linked, doubly linked, circular.`,
        code: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new = Node(data)\n        if not self.head:\n            self.head = new\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new\n    \n    def prepend(self, data):\n        new = Node(data)\n        new.next = self.head\n        self.head = new\n    \n    def display(self):\n        vals = []\n        curr = self.head\n        while curr:\n            vals.append(str(curr.data))\n            curr = curr.next\n        return " -> ".join(vals)\n    \n    def reverse(self):\n        prev, curr = None, self.head\n        while curr:\n            curr.next, prev, curr = prev, curr, curr.next\n        self.head = prev\n\nll = LinkedList()\nfor x in [1, 2, 3, 4, 5]:\n    ll.append(x)\nprint(f"List: {ll.display()}")\nll.prepend(0)\nprint(f"After prepend: {ll.display()}")\nll.reverse()\nprint(f"Reversed: {ll.display()}")`,
        language: "Python",
        expectedOutput: `List: 1 -> 2 -> 3 -> 4 -> 5\nAfter prepend: 0 -> 1 -> 2 -> 3 -> 4 -> 5\nReversed: 5 -> 4 -> 3 -> 2 -> 1 -> 0`,
        tips: [
          "Linked lists excel at insertion/deletion at known positions",
          "Use a dummy head node to simplify edge cases",
          "Reversing a linked list is a classic interview question",
          "Fast/slow pointer technique detects cycles",
        ],
        questions: [
          { question: "What is access time for linked lists?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "You must traverse from the head — no random access." },
          { question: "What is prepend time complexity?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2, explanation: "Prepending only requires updating the head pointer — O(1)." },
          { question: "What detects cycles in linked lists?", options: ["BFS", "Fast/slow pointers", "Recursion", "Sorting"], answer: 1, explanation: "Floyd's cycle detection uses two pointers moving at different speeds." },
          { question: "Array vs linked list for random access?", options: ["Linked list is better", "Array is better (O(1))", "Same speed", "Depends"], answer: 1, explanation: "Arrays provide O(1) random access; linked lists require O(n) traversal." },
          { question: "What extra memory do linked lists use?", options: ["None", "Pointer/reference per node", "Double the data", "A hash table"], answer: 1, explanation: "Each node stores an extra pointer to the next (and previous for doubly linked)." },
        ],
      },
      {
        id: "dsa-stacks-queues",
        title: "Stacks & Queues",
        description: "LIFO and FIFO data structures.",
        content: `A **stack** follows Last-In-First-Out (LIFO). Operations: push, pop, peek — all O(1).\n\nA **queue** follows First-In-First-Out (FIFO). Operations: enqueue, dequeue, front — all O(1).\n\nStacks are used for: function calls, undo, parsing, DFS.\nQueues are used for: BFS, scheduling, buffering.`,
        code: `from collections import deque\n\n# Stack (LIFO)\nstack = []\nstack.append(1)  # push\nstack.append(2)\nstack.append(3)\nprint(f"Stack: {stack}")\nprint(f"Pop: {stack.pop()}")  # 3\nprint(f"Peek: {stack[-1]}")   # 2\n\n# Queue (FIFO)\nqueue = deque()\nqueue.append(1)   # enqueue\nqueue.append(2)\nqueue.append(3)\nprint(f"\\nQueue: {list(queue)}")\nprint(f"Dequeue: {queue.popleft()}")  # 1\nprint(f"Front: {queue[0]}")           # 2\n\n# Stack application: balanced parentheses\ndef is_balanced(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in '([{':\n            stack.append(c)\n        elif c in ')]}':\n            if not stack or stack[-1] != pairs[c]:\n                return False\n            stack.pop()\n    return len(stack) == 0\n\nprint(f"\\n'{{[]}}' balanced: {is_balanced('{[]}')}")\nprint(f"'{{[)}}' balanced: {is_balanced('{[)}')}")`,
        language: "Python",
        expectedOutput: `Stack: [1, 2, 3]\nPop: 3\nPeek: 2\n\nQueue: [1, 2, 3]\nDequeue: 1\nFront: 2\n\n'{[]}' balanced: True\n'{[)}' balanced: False`,
        tips: [
          "Use Python list as stack (append/pop)",
          "Use deque for efficient queue (append/popleft)",
          "Stacks are natural for recursion simulation",
          "Monotonic stacks solve next-greater-element problems",
        ],
        questions: [
          { question: "What order does a stack follow?", options: ["FIFO", "LIFO", "Random", "Sorted"], answer: 1, explanation: "Stack follows Last-In-First-Out — most recent item comes out first." },
          { question: "What order does a queue follow?", options: ["LIFO", "FIFO", "Random", "Priority"], answer: 1, explanation: "Queue follows First-In-First-Out — oldest item comes out first." },
          { question: "What is the time complexity of push/pop?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2, explanation: "Stack push and pop are O(1) operations." },
          { question: "What is a common stack application?", options: ["BFS", "Balanced parentheses checking", "Shortest path", "Sorting"], answer: 1, explanation: "Stacks naturally check matching pairs of brackets." },
          { question: "Why use deque for queues in Python?", options: ["It's fancier", "O(1) popleft vs O(n) for lists", "More memory efficient", "Simpler syntax"], answer: 1, explanation: "deque.popleft() is O(1), while list.pop(0) is O(n)." },
        ],
      },
    ],
  },
  {
    id: "dsa-trees",
    title: "Trees",
    icon: "🌳",
    color: "hsl(var(--syntax-string))",
    lessons: [
      {
        id: "dsa-binary-tree",
        title: "Binary Trees & BST",
        description: "Hierarchical data structures.",
        content: `A **binary tree** has at most two children per node. A **Binary Search Tree (BST)** maintains: left < parent < right.\n\nBST operations: search O(h), insert O(h), delete O(h), where h = height.\n\nBalanced BST: h = O(log n). Unbalanced: h = O(n).\n\nTraversals: in-order (sorted), pre-order (copy), post-order (delete), level-order (BFS).`,
        code: `class TreeNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nclass BST:\n    def __init__(self):\n        self.root = None\n    \n    def insert(self, val):\n        self.root = self._insert(self.root, val)\n    \n    def _insert(self, node, val):\n        if not node: return TreeNode(val)\n        if val < node.val: node.left = self._insert(node.left, val)\n        elif val > node.val: node.right = self._insert(node.right, val)\n        return node\n    \n    def inorder(self, node=None, first=True):\n        if first: node = self.root\n        if not node: return []\n        return self.inorder(node.left, False) + [node.val] + self.inorder(node.right, False)\n    \n    def search(self, val):\n        node = self.root\n        while node:\n            if val == node.val: return True\n            elif val < node.val: node = node.left\n            else: node = node.right\n        return False\n\nbst = BST()\nfor v in [5, 3, 7, 1, 4, 6, 8]:\n    bst.insert(v)\n\nprint(f"In-order: {bst.inorder()}")\nprint(f"Search 4: {bst.search(4)}")\nprint(f"Search 9: {bst.search(9)}")`,
        language: "Python",
        expectedOutput: `In-order: [1, 3, 4, 5, 6, 7, 8]\nSearch 4: True\nSearch 9: False`,
        tips: [
          "In-order traversal of BST gives sorted order",
          "Balanced trees (AVL, Red-Black) guarantee O(log n) height",
          "BST with sorted input degrades to linked list",
          "Level-order traversal uses a queue (BFS)",
        ],
        questions: [
          { question: "What does BST guarantee?", options: ["Balanced height", "left < parent < right", "O(1) access", "Sorted arrays"], answer: 1, explanation: "BST property: left subtree < node < right subtree." },
          { question: "What traversal gives sorted order?", options: ["Pre-order", "Post-order", "In-order", "Level-order"], answer: 2, explanation: "In-order traversal of a BST visits nodes in ascending order." },
          { question: "Worst case BST height?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "An unbalanced BST can degenerate to O(n) height (like a linked list)." },
          { question: "What ensures O(log n) BST operations?", options: ["More nodes", "Self-balancing (AVL, Red-Black)", "Recursion", "Sorting first"], answer: 1, explanation: "Self-balancing trees maintain O(log n) height after insertions/deletions." },
          { question: "What does level-order traversal use?", options: ["Stack", "Queue", "Recursion", "Hash table"], answer: 1, explanation: "Level-order (BFS) uses a queue to visit nodes level by level." },
        ],
      },
    ],
  },
  {
    id: "dsa-sorting",
    title: "Sorting Algorithms",
    icon: "📈",
    color: "hsl(var(--syntax-number))",
    lessons: [
      {
        id: "dsa-sorting-basics",
        title: "Sorting: Bubble, Selection, Insertion",
        description: "O(n²) sorting algorithms.",
        content: `**Bubble Sort**: Repeatedly swap adjacent elements. O(n²) average/worst, O(n) best (already sorted).\n\n**Selection Sort**: Find minimum and place it. Always O(n²). Not stable.\n\n**Insertion Sort**: Insert each element into its sorted position. O(n²) worst, O(n) best. Stable. Great for small or nearly sorted data.`,
        code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(n - 1 - i):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped: break\n    return arr\n\ndef insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\ndef selection_sort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nprint(f"Bubble: {bubble_sort([64, 34, 25, 12, 22, 11, 90])}")\nprint(f"Insert: {insertion_sort([64, 34, 25, 12, 22, 11, 90])}")\nprint(f"Select: {selection_sort([64, 34, 25, 12, 22, 11, 90])}")`,
        language: "Python",
        expectedOutput: `Bubble: [11, 12, 22, 25, 34, 64, 90]\nInsert: [11, 12, 22, 25, 34, 64, 90]\nSelect: [11, 12, 22, 25, 34, 64, 90]`,
        tips: [
          "Insertion sort is fastest for nearly sorted data",
          "Selection sort minimizes swaps (O(n) swaps)",
          "Bubble sort with early termination detects sorted arrays",
          "All three are O(n²) — use for small datasets only",
        ],
        questions: [
          { question: "Which O(n²) sort is best for nearly sorted data?", options: ["Bubble", "Selection", "Insertion", "All equal"], answer: 2, explanation: "Insertion sort is O(n) on nearly sorted data." },
          { question: "Is selection sort stable?", options: ["Yes", "No", "Depends", "Sometimes"], answer: 1, explanation: "Selection sort is not stable — equal elements may be reordered." },
          { question: "What is bubble sort's best case?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], answer: 2, explanation: "With early termination, bubble sort is O(n) on sorted input." },
          { question: "How many swaps does selection sort make?", options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"], answer: 1, explanation: "Selection sort makes exactly n-1 swaps (one per iteration)." },
          { question: "Which sort works by inserting into sorted portion?", options: ["Bubble", "Selection", "Insertion", "Merge"], answer: 2, explanation: "Insertion sort builds the sorted portion by inserting each element." },
        ],
      },
      {
        id: "dsa-merge-quick",
        title: "Merge Sort & Quick Sort",
        description: "O(n log n) divide and conquer sorting.",
        content: `**Merge Sort**: Divide array in half, sort each half, merge. Always O(n log n). Stable. Uses O(n) extra space.\n\n**Quick Sort**: Pick a pivot, partition around it, recurse. O(n log n) average, O(n²) worst. In-place. Not stable.\n\nMerge sort is preferred for stability; quick sort for practical speed.`,
        code: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\ndef quick_sort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + mid + quick_sort(right)\n\ndata = [38, 27, 43, 3, 9, 82, 10]\nprint(f"Merge: {merge_sort(data)}")\nprint(f"Quick: {quick_sort(data)}")`,
        language: "Python",
        expectedOutput: `Merge: [3, 9, 10, 27, 38, 43, 82]\nQuick: [3, 9, 10, 27, 38, 43, 82]`,
        tips: [
          "Merge sort guarantees O(n log n) always",
          "Quick sort is faster in practice due to cache locality",
          "Random pivot selection avoids O(n²) worst case",
          "Merge sort is preferred for linked lists",
        ],
        questions: [
          { question: "What is merge sort's time complexity?", options: ["O(n²)", "O(n log n) always", "O(n)", "Depends"], answer: 1, explanation: "Merge sort is always O(n log n) — best, average, and worst." },
          { question: "What is quick sort's worst case?", options: ["O(n log n)", "O(n)", "O(n²)", "O(2ⁿ)"], answer: 2, explanation: "Quick sort is O(n²) when the pivot is always the smallest/largest." },
          { question: "Is merge sort stable?", options: ["Yes", "No", "Depends on implementation", "Only for integers"], answer: 0, explanation: "Merge sort preserves the relative order of equal elements." },
          { question: "What extra space does merge sort use?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "Merge sort requires O(n) extra space for the merge step." },
          { question: "Why is quick sort often faster in practice?", options: ["Better algorithm", "Better cache locality", "Less comparisons", "Less memory"], answer: 1, explanation: "Quick sort's in-place partitioning has better cache performance." },
        ],
      },
    ],
  },
  {
    id: "dsa-graphs",
    title: "Graphs",
    icon: "🕸️",
    color: "hsl(var(--syntax-variable))",
    lessons: [
      {
        id: "dsa-graph-basics",
        title: "Graph Representation & Traversal",
        description: "BFS and DFS on graphs.",
        content: `A **graph** consists of vertices (nodes) and edges (connections).\n\nRepresentations:\n- **Adjacency List**: Space O(V+E), good for sparse graphs\n- **Adjacency Matrix**: Space O(V²), good for dense graphs\n\n**BFS** (Breadth-First Search): Uses queue, finds shortest path in unweighted graphs.\n**DFS** (Depth-First Search): Uses stack/recursion, useful for cycle detection and topological sort.`,
        code: `from collections import deque\n\n# Adjacency list representation\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'],\n    'E': ['B', 'F'],\n    'F': ['C', 'E']\n}\n\n# BFS\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\n# DFS\ndef dfs(graph, start, visited=None):\n    if visited is None: visited = set()\n    visited.add(start)\n    order = [start]\n    for neighbor in graph[start]:\n        if neighbor not in visited:\n            order.extend(dfs(graph, neighbor, visited))\n    return order\n\nprint(f"BFS from A: {bfs(graph, 'A')}")\nprint(f"DFS from A: {dfs(graph, 'A')}")`,
        language: "Python",
        expectedOutput: `BFS from A: ['A', 'B', 'C', 'D', 'E', 'F']\nDFS from A: ['A', 'B', 'D', 'E', 'F', 'C']`,
        tips: [
          "BFS finds shortest path in unweighted graphs",
          "DFS uses less memory for deep graphs",
          "Adjacency list is preferred for most real-world graphs",
          "Always track visited nodes to avoid infinite loops",
        ],
        questions: [
          { question: "What data structure does BFS use?", options: ["Stack", "Queue", "Heap", "Array"], answer: 1, explanation: "BFS uses a queue to explore nodes level by level." },
          { question: "What data structure does DFS use?", options: ["Queue", "Stack/recursion", "Heap", "Hash table"], answer: 1, explanation: "DFS uses a stack (or recursion) to explore as deep as possible." },
          { question: "Which finds shortest path in unweighted graphs?", options: ["DFS", "BFS", "Both", "Neither"], answer: 1, explanation: "BFS explores level by level, guaranteeing shortest path." },
          { question: "Space complexity of adjacency list?", options: ["O(V²)", "O(V+E)", "O(V)", "O(E)"], answer: 1, explanation: "Adjacency list stores V lists with total E edges." },
          { question: "When is adjacency matrix preferred?", options: ["Sparse graphs", "Dense graphs", "Always", "Never"], answer: 1, explanation: "Adjacency matrix is efficient for dense graphs where most pairs are connected." },
        ],
      },
    ],
  },
  {
    id: "dsa-advanced-problems",
    title: "Advanced Problem Solving",
    icon: "🧠",
    color: "hsl(var(--syntax-keyword))",
    lessons: [
      {
        id: "dsa-prefix-hash",
        title: "Prefix Sum + Hash Map Patterns",
        description: "Solve subarray and frequency problems in linear time.",
        content: `A lot of interview problems that look quadratic can be solved in O(n) by combining **prefix sums** with a **hash map**.

Core idea:
- Track a running prefix sum.
- Store earlier prefix sums in a map.
- Use algebra to check whether a target condition is met.

Classic use cases:
- Subarray sum equals K
- Count of subarrays with target sum
- Longest subarray with equal numbers of two values

When data is static and query-heavy, prefix preprocessing often gives huge speedups.`,
        code: `# Count subarrays with sum exactly k\n# Time: O(n), Space: O(n)\ndef count_subarrays_sum_k(nums, k):\n    count = 0\n    prefix = 0\n    seen = {0: 1}\n\n    for x in nums:\n        prefix += x\n        count += seen.get(prefix - k, 0)\n        seen[prefix] = seen.get(prefix, 0) + 1\n\n    return count\n\narr = [1, 2, 3, -2, 5, -3, 1]\nprint(count_subarrays_sum_k(arr, 3))\n\n# Longest subarray with equal 0 and 1\n# Convert 0 -> -1, then find longest span with same prefix sum\ndef longest_equal_0_1(nums):\n    first_idx = {0: -1}\n    prefix = 0\n    best = 0\n\n    for i, x in enumerate(nums):\n        prefix += -1 if x == 0 else 1\n        if prefix in first_idx:\n            best = max(best, i - first_idx[prefix])\n        else:\n            first_idx[prefix] = i\n\n    return best\n\nprint(longest_equal_0_1([0, 1, 0, 1, 1, 0, 0]))`,
        language: "Python",
        expectedOutput: `7\n6`,
        tips: [
          "Initialize map with prefix sum 0 at index -1/count 1 for edge cases.",
          "Prefix + hash map often turns O(n^2) subarray scans into O(n).",
          "Use get(key, 0) to avoid key errors while counting.",
          "Always reason from equation: prefix[j] - prefix[i] = target.",
        ],
        questions: [
          { question: "For subarray sum = K counting, why start map with {0: 1}?", options: ["To store array length", "To handle subarrays starting at index 0", "For sorting", "For deduplication"], answer: 1, explanation: "It counts cases where current prefix itself equals K (subarray from start)." },
          { question: "Main complexity of prefix+hash counting approach?", options: ["O(n^2) time", "O(n log n) time", "O(n) time, O(n) space", "O(1) space"], answer: 2, explanation: "Each element is processed once, map operations are average O(1)." },
          { question: "Why convert 0 to -1 in equal-0-1 problems?", options: ["To sort faster", "To transform equal counts into zero-sum subarray", "To save space", "To avoid negatives"], answer: 1, explanation: "Equal numbers of 0 and 1 means transformed sum becomes 0." },
          { question: "If same prefix sum appears at i and j (i < j), then subarray i+1..j has sum?", options: ["1", "Prefix[j]", "0", "j-i"], answer: 2, explanation: "Equal prefix sums imply their difference is zero." },
          { question: "When does this method fail without changes?", options: ["Streaming data", "Problems with multiplicative constraints", "Negative numbers", "Small arrays"], answer: 1, explanation: "Prefix sums are additive; multiplicative/divisibility constraints need different tools." },
        ],
        examples: [
          {
            title: "Shortest Subarray with Sum >= Target (Positive Numbers)",
            explanation: "Use a sliding window when all values are non-negative.",
            code: `def min_len_subarray_geq(nums, target):\n    left = 0\n    cur = 0\n    best = float(\"inf\")\n\n    for right, x in enumerate(nums):\n        cur += x\n        while cur >= target:\n            best = min(best, right - left + 1)\n            cur -= nums[left]\n            left += 1\n\n    return 0 if best == float(\"inf\") else best\n\nprint(min_len_subarray_geq([2, 3, 1, 2, 4, 3], 7))`,
            expectedOutput: `2`,
          },
          {
            title: "Prefix Sum Range Query",
            explanation: "Precompute once, answer each sum query instantly.",
            code: `arr = [5, 1, 3, 4, 2]\nprefix = [0]\nfor n in arr:\n    prefix.append(prefix[-1] + n)\n\ndef q(l, r):\n    return prefix[r + 1] - prefix[l]\n\nprint(q(1, 3))`,
            expectedOutput: `8`,
          },
        ],
        advancedQuestions: [
          { question: "For mutable arrays with range sum queries and updates, best DS?", options: ["Prefix array", "Binary Indexed Tree / Segment Tree", "Hash set", "Deque"], answer: 1, explanation: "BIT/segment tree supports both updates and queries efficiently." },
          { question: "Why plain sliding window fails with negative numbers for sum>=K?", options: ["Too slow", "Window sum no longer monotonic when shrinking/expanding", "Cannot store negatives", "Python limitation"], answer: 1, explanation: "Negative values break monotonic behavior required for two-pointer correctness." },
          { question: "Count subarrays divisible by K is solved by...", options: ["Sorting values", "Prefix modulo frequency counting", "Two pointers only", "Binary search"], answer: 1, explanation: "Equal prefix remainders imply divisible subarray differences." },
        ],
      },
      {
        id: "dsa-dp-paths",
        title: "Dynamic Programming on Paths and Decisions",
        description: "Model state transitions and optimize overlapping subproblems.",
        content: `Dynamic Programming (DP) is about defining a **state**, a **transition**, and a **base case**.

For many path problems:
- State tracks best answer up to index/cell.
- Transition chooses from previous states.
- Base case anchors the first state.

Use DP when:
- Greedy choices can fail.
- Subproblems overlap.
- You need optimal result (min/max/count/ways).

A reliable approach:
1. Define dp meaning in plain English.
2. Write recurrence.
3. Fill table or memoize recursion.
4. Validate with tiny examples.`,
        code: `# Min cost climbing stairs\n# dp[i] = min cost to reach step i\ndef min_cost_climb(cost):\n    n = len(cost)\n    dp0, dp1 = 0, 0\n    for i in range(2, n + 1):\n        nxt = min(dp1 + cost[i - 1], dp0 + cost[i - 2])\n        dp0, dp1 = dp1, nxt\n    return dp1\n\nprint(min_cost_climb([10, 15, 20]))\nprint(min_cost_climb([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]))\n\n# House robber\n# dp[i] = best up to i\n\ndef rob(nums):\n    take, skip = 0, 0\n    for x in nums:\n        take, skip = skip + x, max(skip, take)\n    return max(take, skip)\n\nprint(rob([2, 7, 9, 3, 1]))`,
        language: "Python",
        expectedOutput: `15\n6\n12`,
        tips: [
          "If dp[i] depends only on recent states, compress memory to O(1).",
          "Write recurrence before code.",
          "Test base cases explicitly (empty/singleton inputs).",
          "Top-down and bottom-up are equivalent in power.",
        ],
        questions: [
          { question: "Which is true for DP applicability?", options: ["Requires sorted input", "Needs overlapping subproblems + optimal substructure", "Works only recursively", "Needs hash map"], answer: 1, explanation: "These two properties are classic DP indicators." },
          { question: "Why does house robber use max(take, skip)?", options: ["To sort houses", "Because adjacent houses cannot both be robbed", "To reduce memory", "To avoid recursion"], answer: 1, explanation: "Each house decision excludes adjacent one, creating take/skip states." },
          { question: "Memory optimization in DP is possible when...", options: ["N is prime", "Transition uses only fixed number of previous states", "Array is sorted", "Values are unique"], answer: 1, explanation: "Then old full table values are unnecessary." },
          { question: "Top-down memoization vs bottom-up tabulation:", options: ["Different answers", "Same answers, different evaluation order", "Top-down always faster", "Bottom-up can't optimize memory"], answer: 1, explanation: "They compute the same recurrence in different orders." },
          { question: "A common DP bug is...", options: ["Using loops", "Wrong state definition", "Using arrays", "Too many comments"], answer: 1, explanation: "If state meaning is unclear, transitions become incorrect." },
        ],
        examples: [
          {
            title: "Grid Unique Paths",
            explanation: "Count ways to reach bottom-right using right/down moves.",
            code: `def unique_paths(m, n):\n    dp = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            dp[j] += dp[j - 1]\n    return dp[-1]\n\nprint(unique_paths(3, 7))`,
            expectedOutput: `28`,
          },
          {
            title: "Maximum Subarray (Kadane)",
            explanation: "Track best subarray ending here and global best.",
            code: `def max_subarray(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best\n\nprint(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))`,
            expectedOutput: `6`,
          },
        ],
        advancedQuestions: [
          { question: "Why is Kadane's algorithm considered DP?", options: ["Uses recursion", "Each state reuses optimal prior state (best ending here)", "Needs memo dict", "Works only for positives"], answer: 1, explanation: "Kadane maintains dp-like transition on running subproblem optimum." },
          { question: "For 0/1 knapsack, one-dimensional DP must iterate capacity...", options: ["Low to high", "High to low", "Random", "Twice both ways"], answer: 1, explanation: "Descending iteration prevents reusing same item multiple times." },
          { question: "In path-count DP with obstacles, blocked cell transition should be...", options: ["1", "Carry previous", "0", "Infinity"], answer: 2, explanation: "No paths can pass through blocked cells, so contribution is zero." },
        ],
      },
    ],
  },
];
