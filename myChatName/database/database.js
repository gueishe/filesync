'use strict';
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/gueishe';
const client = new pg.Client(connectionString);
client.connect();

function database() {
	let data;

	function defineData(res) {
		data = res;
	}

	return {
		end: () => {
			client.end();
		},
		query: query => {
			client.query(query, (err, res) => {
				defineData(res.rows);
			});
		},
		data: () => {
			return data;
		}
	};
}

module.exports = database();
