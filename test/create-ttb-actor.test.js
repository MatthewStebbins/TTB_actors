const test = require("node:test");
const assert = require("node:assert/strict");

const { createTTBActor } = require("../src/create-ttb-actor");

test("createTTBActor creates an actor with defaults", async () => {
  const mockActor = { id: "actor-1" };
  const calls = [];
  const ActorDocumentClass = {
    create: async (data, options) => {
      calls.push({ data, options });
      return mockActor;
    },
  };

  const created = await createTTBActor(
    { name: "Sonnia Criid" },
    { renderSheet: true },
    ActorDocumentClass,
  );

  assert.equal(created, mockActor);
  assert.deepEqual(calls, [
    {
      data: { name: "Sonnia Criid", type: "character", system: {} },
      options: { renderSheet: true },
    },
  ]);
});

test("createTTBActor allows overriding defaults", async () => {
  const calls = [];
  const ActorDocumentClass = {
    create: async (data) => {
      calls.push(data);
      return data;
    },
  };

  await createTTBActor(
    { name: "Lady Justice", type: "npc", system: { rank: "master" } },
    {},
    ActorDocumentClass,
  );

  assert.deepEqual(calls[0], {
    name: "Lady Justice",
    type: "npc",
    system: { rank: "master" },
  });
});

test("createTTBActor ignores unsupported actor properties", async () => {
  const calls = [];
  const ActorDocumentClass = {
    create: async (data) => {
      calls.push(data);
      return data;
    },
  };

  await createTTBActor(
    { name: "Nellie Cochrane", unknownField: true },
    {},
    ActorDocumentClass,
  );

  assert.equal(calls[0].unknownField, undefined);
});

test("createTTBActor validates actorData", () => {
  assert.throws(
    () => createTTBActor(null, {}, { create: async () => ({}) }),
    /actorData must be an object/,
  );
});

test("createTTBActor validates actor name", () => {
  assert.throws(
    () => createTTBActor({ name: "  " }, {}, { create: async () => ({}) }),
    /actorData.name must be a non-empty string/,
  );
});

test("createTTBActor validates actor document class", () => {
  assert.throws(
    () => createTTBActor({ name: "Valid Name" }, {}, null),
    /Actor document class with a create function is required/,
  );
});
