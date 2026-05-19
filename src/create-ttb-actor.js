function createTTBActor(actorData, createOptions = {}, actorDocumentClass = globalThis.Actor) {
  if (!actorData || typeof actorData !== "object") {
    throw new TypeError("actorData must be an object.");
  }

  if (typeof actorData.name !== "string" || actorData.name.trim().length === 0) {
    throw new TypeError("actorData.name must be a non-empty string.");
  }

  if (!actorDocumentClass || typeof actorDocumentClass.create !== "function") {
    throw new Error("Actor document class with a create function is required.");
  }

  const normalizedData = {
    type: "character",
    system: {},
  };

  const allowedKeys = new Set([
    "name",
    "type",
    "img",
    "system",
    "items",
    "effects",
    "folder",
    "sort",
    "ownership",
    "flags",
    "prototypeToken",
    "token",
    "biography",
  ]);

  for (const [key, value] of Object.entries(actorData)) {
    if (allowedKeys.has(key)) {
      normalizedData[key] = value;
    }
  }

  return actorDocumentClass.create(normalizedData, createOptions);
}

module.exports = {
  createTTBActor,
};
