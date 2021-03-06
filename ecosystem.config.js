module.exports = {
	apps: [
		{
			name: 'admin',
			script: 'npm',
			args: 'run start',
			env: {
				PORT: 4000,
			},
		},
	],
};
