import { describe, expect, it } from "bun:test";
import { resolve } from "path";
import { createTablesArray, sortCreateTableQueries } from "./index";

const filePath = resolve(__dirname, "mock", "mock_tables.sql");
const file = Bun.file(filePath);

describe("createTablesArray", async () => {
  const text = await file.text();
  const lines = text.split("\n\n").filter((line) => line.trim() !== "");
  const queries = await createTablesArray(filePath);

  it("should return the same number of queries as in the file", async () => {
    expect(queries.length).toBe(lines.length);
  });
});

describe("sortCreateTableQueries", async () => {
  const text = await file.text();
  const lines = text.split("\n\n").filter((line) => line.trim() !== "");
  const queries = await sortCreateTableQueries(filePath);

  it("should return the same number of queries as in the file", async () => {
    expect(queries.length).toBe(lines.length);
  });

  it("should sort SQL queries with correct dependencies", async () => {
    const usersIndex = queries.findIndex((query) =>
      query.includes("CREATE TABLE `users`"),
    );
    const rolesIndex = queries.findIndex((query) =>
      query.includes("CREATE TABLE `roles`"),
    );
    const reservationsIndex = queries.findIndex((query) =>
      query.includes("CREATE TABLE `reservations`"),
    );
    const permissionsIndex = queries.findIndex((query) =>
      query.includes("CREATE TABLE `permissions`"),
    );
    const permissionRoleIndex = queries.findIndex((query) =>
      query.includes("CREATE TABLE `permission_role`"),
    );

    // Ensure `users` is created before any table that references it
    expect(usersIndex).toBeLessThan(rolesIndex);
    expect(usersIndex).toBeLessThan(reservationsIndex);

    // Ensure `roles` is created before `permission_role`
    expect(rolesIndex).toBeLessThan(permissionRoleIndex);

    // Ensure `permissions` is created before `permission_role`
    expect(permissionsIndex).toBeLessThan(permissionRoleIndex);
  });
});
