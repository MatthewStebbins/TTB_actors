# TTB_actors

Small helper utilities for creating Through the Breach actors in FoundryVTT.

## Usage

```js
const { createTTBActor } = require("./src/create-ttb-actor");

await createTTBActor({
  name: "Perdita Ortega",
  type: "character",
  system: {
    station: "Outcast",
  },
});
```

By default the helper uses the global Foundry `Actor` document class and calls
`Actor.create(...)`.
