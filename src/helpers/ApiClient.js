import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

const formatUrl = path => (path[0] !== '/' ? `/${path}` : path);

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { headers = {}, params = {}, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        // Set Access Token
        if (this.accessToken) {
          headers.Authorization = `Bearer ${this.accessToken}`;
        }

        // Set headers
        request.set(headers);

        // Set request params
        request.query(params);

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => {
          if (err) {
            return reject(body || err);
          }

          return resolve(body);
        });
      });
    });
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  downloadFile = (path, {
    headers = {}, params = {}, data, outFileName
  } = {}) => {
    const request = superagent.post(formatUrl(path));

    // Set Access Token
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    // Set headers
    request.set(headers);

    // Set request params
    request.query(params);

    if (data) {
      request.send(data);
    }

    return request.responseType('blob')
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.body]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outFileName);

        // IE Work around
        // https://github.com/kennethjiang/js-file-download/blob/master/file-download.js

        if (typeof link.download === 'undefined') {
          link.setAttribute('target', '_blank');
        }

        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export const client = new ApiClient();

export default ApiClient;
