import JsonP from 'jsonp'

export default class Axiox {
  static jsonp(options) {
    return new Promise((resolve, reject) => {
        JsonP(options.url, {
            param: 'callback'
        }, function (err, response) {
            if (response.status === 'success') {
                resolve(response);
            } else {
                reject(response.messsage);
            }
        })
    })
  }
}