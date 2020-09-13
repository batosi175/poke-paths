import {
  PokePathPostBody,
  ServerPathResponse,
  ErrorResponse,
} from "../component/App";

const url = "https://frozen-reef-96768.herokuapp.com/find-path";

const headers = {
  "Content-Type": "application/json",
};

type ResponseOptions = ServerPathResponse | ErrorResponse;

export const fetchPath = async (
  postBody: PokePathPostBody
): Promise<ResponseOptions> => {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(postBody),
  });
  return response.json();
};
