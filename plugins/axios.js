/**
 * https://axios.nuxtjs.org/helpers.html#interceptors
 * @param $swal
 * @param title
 * @param data
 */

let errorDisplay = ($swal, title, data) => {
    $swal({
        icon: 'error',
        title: title,
        width: '50%',
        html: `<pre style="text-align: left;overflow: auto;font-family: monospace;font-size: 16px;">${JSON.stringify(
            data,
            null,
            2
        ).replace(/\\n/g, '\n')}</pre>`,
    });
};

export default function ({ $axios, store, app: { $swal } }) {
    // onError(err)
    $axios.onError((error) => {
        if (error.response.status === 500) {
            errorDisplay($swal, '500 Internal Server Error', error.response);
        }
        console.error(error);
    });
    $axios.onResponse((response) => {
        if (Array.isArray(response.data)) {
            response.data.forEach((data) => {
                if (data.error) {
                    errorDisplay($swal, data.error.message, data.error.data);
                }
                if (data.result) {
                    if (Array.isArray(data.result.mutations))
                        data.result.mutations.forEach((mutation) => {
                            if (process.env.NODE_ENV !== 'production')
                                console.log('mutation', mutation.name, mutation.data);
                            store.commit(mutation.name, mutation.data);
                        });
                    if (Array.isArray(data.result.actions))
                        data.result.actions.forEach((action) => {
                            if (process.env.NODE_ENV !== 'production') console.log('action', action.name, action.data);
                            store.dispatch(action.name, action.data);
                        });
                }
            });
        } else {
            errorDisplay($swal, 'Error response data', response.data);
        }
    });
    // onRequest(config)
    // onResponse(response)
    // onRequestError(err)
    // onResponseError(err)
    // $axios.setBaseURL(baseURL)
    // $axios.setHeader(name, value, scopes='common')
    // $axios.setToken(token, type, scopes='common')
}
