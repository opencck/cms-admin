/**
 * @typedef {object} axios
 * @property {function(string, object)} post
 */

/**
 * OpenCCK JsonRPC API
 */
class API {
	/**
	 * API Constructor
	 * @param {axios} axios
	 */
	constructor(axios) {
		this.axios = axios;
		this.payload = [];
		this.query = [];
	}

	/**
	 * Add request to query
	 * @param {string} method
	 * @param {object} params
	 * @param {integer|string|object|null} id
	 * @returns {Promise}
	 */
	add(method, params = {}, id = null) {
		if (id && typeof id === 'object') id = id.id; // mistake-proofing
		return new Promise((resolve, reject) => {
			this.payload.push({
				method,
				params,
				id,
			});
			this.query.push({ resolve, reject });
		});
	}

	/**
	 * Add requests array to query
	 *
	 * @example
	 * this.$api.serial([
	 * 	{
	 * 		method: 'cck.items.select',
	 * 		params: {
	 * 		 select: {pages: ['id','name','content']},
	 * 		 where: [{'pages.state': 1}],
	 * 		 order: {'pages.id': 'DESC'},
	 * 		 group: ['pages.id'],
	 * 		 limit: [0, 100],
	 * 		}
	 * 	},
	 * 	{
	 * 	    method: 'cck.items.select',
	 * 	    params: {
	 * 	     select: ['COUNT(*) as `count`'],
	 * 	     where: [{'pages.state': 1}],
	 * 	     limit: [],
	 * 	    }
	 * 	}
	 * ])
	 * .post()
	 *   .then((response)=>{response;})
	 *   .catch((error)=>{error;});
	 *
	 * @param {[{method: string, params?: object, id?: integer|string|object|null}]} array
	 * @returns {this}
	 */
	serial(array) {
		array.forEach((item) => item.method && this.add(item.method, item.params || {}, item.id || null));
		return this;
	}

	/**
	 * Add request and send query
	 * @param {string} method
	 * @param {object} params
	 * @param {integer|string|object|null} id
	 * @returns {Promise}
	 */
	get(method, params = {}, id = null) {
		let promise = this.add(method, params, id);
		this.post();
		return promise;
	}

	/**
	 * Send query
	 * @returns {Promise}
	 */
	post() {
		if (!this.payload.length) return new Promise((resolve) => resolve());
		let query = this.query.splice(0);
		return this.axios.post('/', this.payload.splice(0)).then((response) => {
			query.forEach((promise, key) => {
				if (response.data[key].result) {
					promise.resolve(response.data[key].result);
				}
				if (response.data[key].error) {
					promise.reject(response.data[key].error);
				}
			});
		});
	}
}

/**
 * @param {axios} axios
 * @returns {API}
 */
export default (axios) => new API(axios);
