import { PokePathPostBody } from "../component/App";

const url = "https://frozen-reef-96768.herokuapp.com/find-path";

const headers = {
  "Content-Type": "application/json",
};

export const fetchPath = async (postBody: PokePathPostBody) => {
  const result = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(postBody),
  });

  return result.json();
};
