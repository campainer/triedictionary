import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
type response = {
  arr: string[];
  err: string;
};

interface TrieNode {
  val: boolean;
  child: { [key: string]: TrieNode };
}

const root: TrieNode = {
  val: false,
  child: {},
};

const add = (s: string) => {
  let node = root;
  for (let i = 0; i < s.length; i++) {
    let id: string = s.charAt(i);
    if (!node.child.hasOwnProperty(id))
      node.child[id] = {
        val: false,
        child: {},
      };
    node = node.child[id];
  }
  node.val = true;
};

const f1 = (node: TrieNode, ans: string[], s: string) => {
  if (node.val) ans.push(s);
  for (const key in node.child) {
    f1(node.child[key], ans, s + key);
  }
};
const f = (s: string): string[] => {
  let node = root;
  let temp: string = "";
  let ans: string[] = [];
  for (let i = 0; i < s.length; i++) {
    let id: string = s.charAt(i);
    temp += s.charAt(i);
    if (!node.child.hasOwnProperty(id)) return ans;
    node = node.child[id];
  }
  f1(node, ans, s);
  return ans;
};

const fetchUser = async (): Promise<response> => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    return {
      arr: response.data.map((x: any) => x.name),
      err: "",
    };
  } catch (error: any) {
    return {
      arr: [],
      err: "Cant fetch Users",
    };
  }
};

const PhoneDictionary = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<string[]>([]);

  useEffect(() => {
    console.log("ran2");
    fetchUser().then((res: response) => {
      if (res.err) console.log(res.err);
      res.arr.forEach((x: string) => {
        let temp: string[] = x.split(" ");
        add(temp[0].toLocaleLowerCase());
      });
      setFilteredData(f(searchTerm.toLocaleLowerCase()));
    });
  }, []);

  useEffect(() => {
    console.log("ran1");
    setFilteredData(f(searchTerm.toLocaleLowerCase()));
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="phone-dictionary">
      <h1>Phone Dictionary</h1>
      <input
        type="text"
        placeholder="Search for a name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <ul className="name-list">
        {filteredData.map((person) => (
          <li key={person}>{person}</li>
        ))}
      </ul>
    </div>
  );
};

export default PhoneDictionary;
