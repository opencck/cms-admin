class API {
	constructor(axios) {
		this.axios = axios;
		this.payload = [];
		this.query = [];
	}
	add(method, params = {}, id = null) {
		if (id && typeof id === 'object') id = id.id;
		return new Promise((resolve, reject) => {
			this.payload.push({
				method,
				params,
				id,
			});
			this.query.push({ resolve, reject });
		});
	}
	serial(array) {
		array.forEach((item) => this.add(item));
	}
	get(method, params = {}, id = null) {
		let promise = this.add(method, params, id);
		this.post();
		return promise;
	}
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
export default (axios) => new API(axios);
