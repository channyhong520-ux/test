const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query("UPDATE source_codes SET price = '4.99' WHERE id = 1");
  await client.query("UPDATE source_codes SET price = '29.99' WHERE id = 2");

  const res = await client.query("SELECT id, title, price FROM source_codes ORDER BY id");
  console.log(JSON.stringify(res.rows, null, 2));

  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
