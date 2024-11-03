const domain = "your-domain";

const confluence = [
  // Add your (domain, id) pairs here
  { domain: domain, id: "4166582285" },
  { domain: domain, id: "4166844417" },
  { domain: "different-domain", id: "4166844418" },
];
// This can be named anything but it must be a default export of an array of objects with `domain` and `id` keys.
export default confluence;
