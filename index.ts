export async function sortCreateTableQueries(
  filePath: string,
): Promise<string[]> {
  const tables = await createTablesArray(filePath);

  // Use a map to track the order of tables by name
  const tableOrder: Map<string, number> = new Map();
  tables.forEach((table, index) => tableOrder.set(table.name, index));

  // Create an array to track the sorted order of table queries
  const sortedTables: string[] = [];
  const visited: Set<string> = new Set();

  function visit(table: { name: string; query: string }) {
    if (visited.has(table.name)) return;

    visited.add(table.name);

    // Extract all foreign table dependencies
    const foreignTableMatches = table.query.match(/REFERENCES `(.+?)`/gi) || [];
    for (const match of foreignTableMatches) {
      const foreignTableName = match.match(/`(.+?)`/i)?.[1];
      if (foreignTableName && !visited.has(foreignTableName)) {
        const foreignTable = tables.find((t) => t.name === foreignTableName);
        if (foreignTable) visit(foreignTable);
      }
    }

    sortedTables.push(table.query);
  }

  // Visit all tables and sort based on dependencies
  tables.forEach((table) => visit(table));

  return sortedTables;
}

export async function createTablesArray(filePath: string) {
  const file = Bun.file(filePath);
  const text = await file.text();
  const lines = text.split("\n\n").filter((line) => line.trim() !== "");

  const tables: Array<{
    name: string;
    query: string;
  }> = [];

  for (const line of lines) {
    // Extract table name
    const tableName = line.match(/CREATE TABLE `(.*)`/i)?.[1];

    if (!tableName) continue;

    const data = {
      name: tableName,
      query: line.trim(),
    };

    tables.push(data);
  }

  return tables;
}
