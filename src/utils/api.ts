import queryString from 'query-string';

interface IRequest {
    url: string;
    method: string;
    body?: any;
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
}

export const sendRequest = async <T>(props: IRequest) => { //type
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams, { arrayFormat: 'none' })}`;
    }
    console.log("api url ",url)
    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T; //generic
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const sendRequestFile = async <T>(props: IRequest): Promise<T> => {
    let {
      url,
      method,
      body,
      queryParams = {},
      useCredentials = false,
      headers = {},
      nextOption = {},
    } = props;
  
    const options: any = {
      method,
      // 🧠 Do NOT set Content-Type manually — browser handles it
      headers: new Headers({ ...headers }),
      body: body || null,
      ...nextOption,
    };
  
    if (useCredentials) {
      options.credentials = "include";
    }
  
    if (queryParams) {
      url = `${url}?${queryString.stringify(queryParams, { arrayFormat: 'none' })}`;
    }
  
    return fetch(url, options).then(async (res) => {
      const json = await res.json();
      if (res.ok) {
        return json as T;
      } else {
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      }
    });
  };
  