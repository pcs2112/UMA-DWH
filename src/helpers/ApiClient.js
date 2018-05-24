import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

const formatUrl = path => (path[0] !== '/' ? `/${path}` : path);

class ApiClient {
  constructor() {
    methods.forEach((method) => // eslint-disable-line
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

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body)); // eslint-disable-line
      }));
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {} // eslint-disable-line
}

export const client = new ApiClient();

export default ApiClient;
