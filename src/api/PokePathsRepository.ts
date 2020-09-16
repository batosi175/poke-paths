import {
  ServerPathResponse,
  ErrorResponse,
  PokePathPostBody,
} from "../model/Models";

const url = "https://frozen-reef-96768.herokuapp.com/find-path";

const headers = {
  "Content-Type": "application/json",
};

type ResponseOptions = ServerPathResponse | ErrorResponse;

// fetching a path from the provided endpoint
export const fetchPath = async (
  postBody: PokePathPostBody
): Promise<ResponseOptions> => {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(postBody),
  });
  // the 400 error has a json body so we exclude it from here
  if (response.status !== 200 && response.status !== 400) {
    return {
      message: "There was a server issue, Error code: " + response.status,
    };
  }
  return response.json();
};
