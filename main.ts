import { sortCreateTableQueries } from "./index";

async function main() {
  const filePath = "tables.sql";
  const text = await sortCreateTableQueries(filePath);
  await Bun.write("converted.sql", text.join("\n\n"));
}

console.log("Sorting...");

main()
  .then(() => {
    console.log("Done!");
  })
  .catch((error) => {
    console.error(error);
  });
