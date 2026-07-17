export interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  link: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const allBlogs: Blog[] = [
  {
    "_id": "68c8d8293167a59c4a0ff7c5",
    "title": "Quantum Cryptography",
    "image": "/assets/images/blogs/68c8d8293167a59c4a0ff7c5.jpg",
    "description": "Leveraging quantum mechanics to create unbreakable security.",
    "link": "https://medium.com/@kareacm/quantum-cryptography-03b09a128bdf",
    "category": "Quantum Computing",
    "tags": [
      "Quantum",
      "Cryptography",
      "Security"
    ],
    "author": "KARE ACM",
    "createdAt": "2025-09-16T03:23:21.948000",
    "updatedAt": "2025-09-16T03:23:21.948000",
    "__v": 0
  },
  {
    "_id": "68c8d8e63167a59c4a0ff7c9",
    "title": "Willow: Quantum in Computing",
    "image": "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*GFUg7ncps0LXwZcatY3oWA.jpeg",
    "description": "Revolutionizing problem-solving with quantum chips.",
    "link": "https://medium.com/@kareacm/willow-quantum-in-computing-caddcd9f13dd",
    "category": "Quantum Computing",
    "tags": [
      "Quantum",
      "Computing",
      "Chips"
    ],
    "author": "KARE ACM",
    "createdAt": "2025-09-16T03:26:30.939000",
    "updatedAt": "2025-09-16T03:26:30.939000",
    "__v": 0
  },
  {
    "_id": "68c8d8f23167a59c4a0ff7cb",
    "title": "Competitive Programming",
    "image": "/assets/images/blogs/68c8d8fd3167a59c4a0ff7cd.jpg",
    "description": "Sharpen your problem-solving skills with competitive programming.",
    "link": "https://medium.com/@kareacm/competitive-programming-cefc5acc307a",
    "category": "Programming",
    "tags": [
      "DSA",
      "Algorithms",
      "Problem Solving"
    ],
    "author": "KARE ACM",
    "createdAt": "2025-09-16T03:26:42.366000",
    "updatedAt": "2025-09-16T03:26:42.366000",
    "__v": 0
  },
  {
    "_id": "68c8d8fd3167a59c4a0ff7cd",
    "title": "Blockchain Technology",
    "image": "/assets/images/blogs/68c8d8fd3167a59c4a0ff7cd.jpg",
    "description": "Exploring decentralized, transparent, and secure ledgers.",
    "link": "https://medium.com/@kareacm/blockchain-technology-706036b6deac",
    "category": "Blockchain",
    "tags": [
      "Blockchain",
      "Decentralization",
      "Security"
    ],
    "author": "KARE ACM",
    "createdAt": "2025-09-16T03:26:53.388000",
    "updatedAt": "2025-09-16T03:26:53.388000",
    "__v": 0
  },
  {
    "_id": "68c8d90b3167a59c4a0ff7cf",
    "title": "Decentralized Computing",
    "image": "/assets/images/blogs/68c8d90b3167a59c4a0ff7cf.jpg",
    "description": "Distributing computing resources for greater flexibility.",
    "link": "https://medium.com/@kareacm/decentralised-computing-d8c275b93ded",
    "category": "Computing",
    "tags": [
      "Decentralization",
      "Cloud",
      "Networking"
    ],
    "author": "KARE ACM",
    "createdAt": "2025-09-16T03:27:07.473000",
    "updatedAt": "2025-09-16T03:27:07.473000",
    "__v": 0
  },
  {
    "_id": "68c8d9183167a59c4a0ff7d1",
    "title": "The internet of things and smart cities",
    "image": "/assets/images/blogs/68c8d9183167a59c4a0ff7d1.jpg",
    "description": "A New Era of Urban Development",
    "link": "https://medium.com/@kareacm/the-internet-of-things-and-smart-cities-8ffbc1f3d6ec",
    "category": "IoT",
    "tags": [
      "IoT",
      "Smart Cities",
      "Urban Development"
    ],
    "author": "KARE ACM",
    "createdAt": "2025-09-16T03:27:20.463000",
    "updatedAt": "2025-09-16T03:27:20.463000",
    "__v": 0
  }
];

export const latestBlogs = [...allBlogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
