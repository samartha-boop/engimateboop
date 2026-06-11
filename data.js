/*
  EngiMate Sample Database & Mock Data
*/

export const SYLLABUS_DATA = {
  CSE: {
    name: "Computer Science & Engineering",
    semesters: {
      1: [
        {
          code: "CS101",
          name: "Programming in C",
          modules: [
            { title: "Unit 1: Introduction to Algorithms & Flowcharts", content: "Basics of computer organization, algorithm definitions, flowcharts, pseudo-code, compilation process, and executing C programs." },
            { title: "Unit 2: Control Structures", content: "Conditional statements (if-else, switch-case), loops (for, while, do-while), break, continue, and nesting of loops." },
            { title: "Unit 3: Arrays & Strings", content: "One-dimensional and multi-dimensional arrays, string handling functions, character arrays, and manipulation operations." },
            { title: "Unit 4: Functions & Pointers", content: "Function declarations, parameters, pass by value/reference, recursion, pointer syntax, pointer arithmetic, and arrays with pointers." }
          ],
          books: [
            { title: "Programming in ANSI C", author: "E. Balagurusamy", type: "Reference Book" },
            { title: "The C Programming Language", author: "Brian Kernighan & Dennis Ritchie", type: "Text Book" }
          ],
          revision: [
            { topic: "Pointer Basics", summary: "A pointer is a variable that stores the memory address of another variable. Format: int *ptr = &val;" },
            { topic: "Recursion Rule", summary: "Every recursive function must have a base case to terminate execution, preventing infinite stack frame allocation." }
          ]
        },
        {
          code: "MA101",
          name: "Engineering Mathematics I",
          modules: [
            { title: "Unit 1: Linear Algebra", content: "Rank of matrix, system of linear equations, eigenvalues, eigenvectors, Cayley-Hamilton theorem, and diagonalizing matrices." },
            { title: "Unit 2: Differential Calculus", content: "Rolle's theorem, Mean Value theorems, Taylor's and Maclaurin's series, curvature, and envelopes." }
          ],
          books: [{ title: "Higher Engineering Mathematics", author: "B.S. Grewal", type: "Core Textbook" }],
          revision: [{ topic: "Eigenvalues Equation", summary: "Characteristic equation: det(A - λI) = 0. Solving for λ yields the eigenvalues." }]
        }
      ],
      3: [
        {
          code: "CS301",
          name: "Data Structures & Algorithms",
          modules: [
            { title: "Unit 1: Linear Structures", content: "Stacks, queues, linked lists, circular queue, double ended queue, priority queue, and allocation models." },
            { title: "Unit 2: Tree Structures", content: "Binary trees, traversals (pre, in, post order), binary search trees (BST), AVL trees, heap structures, and Huffman trees." },
            { title: "Unit 3: Graphs", content: "Graph representation (adjacency matrix/list), Traversals (BFS, DFS), Minimum Spanning Trees (Kruskal, Prim), Shortest Path (Dijkstra)." }
          ],
          books: [{ title: "Data Structures Using C", author: "Reema Thareja", type: "Text Book" }],
          revision: [{ topic: "Time Complexities", summary: "Binary Search: O(log n), Merge Sort: O(n log n), BST Insertion (worst case): O(n), AVL Balance: O(log n)." }]
        }
      ]
    }
  },
  ECE: {
    name: "Electronics & Communication Engineering",
    semesters: {
      1: [
        {
          code: "EC101",
          name: "Basic Electronics",
          modules: [
            { title: "Unit 1: Semiconductor Diodes", content: "P-N junction diode theory, V-I characteristics, rectifiers (half-wave, full-wave), zener breakdown, and regulator circuits." },
            { title: "Unit 2: Bipolar Junction Transistors", content: "BJT construction, operation configurations (CB, CE, CC), biasing techniques, and small signal amplifiers." }
          ],
          books: [{ title: "Electronic Devices and Circuit Theory", author: "Robert Boylestad", type: "Reference" }],
          revision: [{ topic: "Diode Equation", summary: "Shockley equation: I = Is * (e^(V / (n*Vt)) - 1), where Vt is thermal voltage (approx 26mV at room temp)." }]
        }
      ]
    }
  }
};

export const QUIZ_QUESTIONS = {
  aptitude: [
    {
      id: 1,
      q: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      options: ["120 metres", "150 metres", "324 metres", "180 metres"],
      correct: 1,
      explanation: "Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length of train = Speed * Time = (50/3) * 9 = 150 metres."
    },
    {
      id: 2,
      q: "The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?",
      options: ["0", "1", "10", "19"],
      correct: 3,
      explanation: "Average is 0, so sum of 20 numbers = 0. We can have 19 numbers positive, and the 20th number can be a negative number equal to the sum of the 19 numbers. Thus, at most 19 can be greater than zero."
    }
  ],
  technical: [
    {
      id: 1,
      q: "Which data structure uses the LIFO (Last In First Out) principle?",
      options: ["Queue", "Stack", "Binary Tree", "Linked List"],
      correct: 1,
      explanation: "Stacks use the Last-In First-Out (LIFO) model, where elements are inserted (push) and removed (pop) from the same end."
    },
    {
      id: 2,
      q: "What is the time complexity of searching in a perfectly balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correct: 2,
      explanation: "In a balanced BST, each step cuts the search space in half. Hence, the search complexity is O(log n)."
    }
  ]
};

export const HR_QUESTIONS = [
  "Tell me about yourself.",
  "What are your greatest strengths and weaknesses?",
  "Describe a challenging engineering project you worked on and how you resolved a team conflict.",
  "Why do you want to join our company?",
  "Where do you see yourself in five years?"
];

export const CODING_CHALLENGES = [
  {
    id: "fizzbuzz",
    title: "FizzBuzz Challenge",
    difficulty: "Easy",
    desc: "Write a function `fizzBuzz(n)` that returns an array of strings from 1 to n. For multiples of 3, output 'Fizz' instead of the number. For multiples of 5, output 'Buzz'. For multiples of both 3 and 5, output 'FizzBuzz'.",
    templates: {
      javascript: `function fizzBuzz(n) {\n  const result = [];\n  // Write code here\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) result.push("FizzBuzz");\n    else if (i % 3 === 0) result.push("Fizz");\n    else if (i % 5 === 0) result.push("Buzz");\n    else result.push(i.toString());\n  }\n  return result;\n}\n\n// Run test\nconsole.log(fizzBuzz(15));`,
      python: `def fizz_buzz(n):\n    result = []\n    # Write code here\n    for i in range(1, n + 1):\n        if i % 15 == 0: result.append("FizzBuzz")\n        elif i % 3 == 0: result.append("Fizz")\n        elif i % 5 == 0: result.append("Buzz")\n        else: result.append(str(i))\n    return result\n\nprint(fizz_buzz(15))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n\nstd::vector<std::string> fizzBuzz(int n) {\n    std::vector<std::string> res;\n    for(int i=1; i<=n; ++i) {\n        if(i%15==0) res.push_back("FizzBuzz");\n        else if(i%3==0) res.push_back("Fizz");\n        else if(i%5==0) res.push_back("Buzz");\n        else res.push_back(std::to_string(i));\n    }\n    return res;\n}\n\nint main() {\n    auto v = fizzBuzz(15);\n    for(auto s : v) std::cout << s << " ";\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static List<String> fizzBuzz(int n) {\n        List<String> res = new ArrayList<>();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) res.add("FizzBuzz");\n            else if (i % 3 == 0) res.add("Fizz");\n            else if (i % 5 == 0) res.add("Buzz");\n            else res.add(String.valueOf(i));\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        System.out.println(fizzBuzz(15));\n    }\n}`
    },
    testCase: {
      input: 15,
      expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'
    }
  },
  {
    id: "reverse",
    title: "Reverse a String",
    difficulty: "Easy",
    desc: "Write a function `reverseString(str)` that takes a string input and returns the characters in reverse order.",
    templates: {
      javascript: `function reverseString(str) {\n  // Write code here\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString("engimate"));`,
      python: `def reverse_string(s):\n    # Write code here\n    return s[::-1]\n\nprint(reverse_string("engimate"))`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\n\nstd::string reverseString(std::string s) {\n    std::reverse(s.begin(), s.end());\n    return s;\n}\n\nint main() {\n    std::cout << reverseString("engimate");\n    return 0;\n}`,
      java: `public class Main {\n    public static String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n    public static void main(String[] args) {\n        System.out.println(reverseString("engimate"));\n    }\n}`
    },
    testCase: {
      input: "engimate",
      expected: '"etamigne"'
    }
  }
];

export const CAREER_ROADMAPS = {
  software: {
    title: "Software Engineer Roadmap",
    nodes: [
      { id: "s1", label: "Programming Foundations", desc: "Learn C, Python, or Java syntax.", status: "completed" },
      { id: "s2", label: "Data Structures & Algorithms", desc: "Stacks, Trees, Sorting, and Big O notation.", status: "active" },
      { id: "s3", label: "Web Development Basics", desc: "HTML, CSS, JS, and Responsive designs.", status: "locked" },
      { id: "s4", label: "Database Management (SQL)", desc: "Relational tables, joins, and normalizations.", status: "locked" },
      { id: "s5", label: "System Design & Scalability", desc: "Microservices, Caching, Load balancers.", status: "locked" }
    ],
    certs: ["AWS Certified Developer", "Oracle Java Programmer", "Google Cloud Associate"]
  },
  ai: {
    title: "AI Engineer Roadmap",
    nodes: [
      { id: "ai1", label: "Linear Algebra & Probability", desc: "Matrices, vectors, eigenvalues, Bayes theorem.", status: "completed" },
      { id: "ai2", label: "Python & Data Science Libs", desc: "NumPy, Pandas, Matplotlib operations.", status: "active" },
      { id: "ai3", label: "Machine Learning Foundations", desc: "Linear regression, Decision Trees, SVM.", status: "locked" },
      { id: "ai4", label: "Deep Learning & NLP", desc: "CNNs, RNNs, Transformers, and LLM tuning.", status: "locked" }
    ],
    certs: ["TensorFlow Developer Certificate", "Google Cloud ML Engineer", "Microsoft AI Engineer"]
  }
};

export const RECOMMENDED_COURSES = [
  {
    id: 1,
    title: "Introduction to Computer Science (CS50)",
    provider: "Harvard (edX)",
    price: "Free",
    skills: ["C", "Python", "SQL", "Algorithms"],
    progress: 40
  },
  {
    id: 2,
    title: "Machine Learning Specialization",
    provider: "Andrew Ng (Coursera)",
    price: "Paid / Financial Aid",
    skills: ["Python", "Regression", "Neural Networks"],
    progress: 0
  },
  {
    id: 3,
    title: "Modern Front-End Web BootCamp",
    provider: "Udemy",
    price: "$12.99",
    skills: ["HTML5", "CSS3", "JavaScript", "React"],
    progress: 85
  }
];

export const PROJECT_IDEAS = {
  software: [
    { title: "AI-Powered Budget Tracker", desc: "A dashboard app that uses linear regression to forecast future expenses based on historical user purchases.", difficulty: "Medium", type: "Software" },
    { title: "Real-time Chat via WebSockets", desc: "Secure messaging room app supporting multiple rooms and message persistence in MongoDB.", difficulty: "Hard", type: "Software" }
  ],
  hardware: [
    { title: "IoT Smart Home automation", desc: "Controlling electrical devices using NodeMCU (ESP8266) connected to a Firebase database.", difficulty: "Medium", type: "Hardware" },
    { title: "Automated Plant Watering System", desc: "Arduino system using soil moisture sensor, relay module, and a micro water pump.", difficulty: "Easy", type: "Hardware" }
  ]
};

export const OPPORTUNITIES = {
  internships: [
    { title: "Front-End Developer Intern", company: "MetaTech Solutions", duration: "3 Months", stipend: "$800/mo", type: "Remote" },
    { title: "Software Development Intern", company: "IntelliTech Labs", duration: "6 Months", stipend: "$1,200/mo", type: "On-site" }
  ],
  hackathons: [
    { title: "EngiHack 2026", date: "June 25-27, 2026", prize: "$5,000", status: "Open" },
    { title: "AI Hackathon: Future Tech", date: "July 15, 2026", prize: "$10,000", status: "Registering" }
  ]
};
