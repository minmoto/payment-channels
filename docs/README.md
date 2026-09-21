# Payment channel documentation

This is the predictable entry point for humans and agents integrating `@minmoto/payment-channels`.

- [Agent contract](./agent-contract.md): the required discovery, selection, collection, validation, rendering, and security procedure.
- [Schema reference](./schema-reference.md): public types, enums, helpers, and exact runtime semantics.
- [Built-in channels](./generated/built-in-channels.md): generated human-readable registry inventory.
- [Registry JSON](./generated/registry.json): generated machine-readable registry snapshot.
- [Generic consumer example](../examples/generic-consumer.mjs): executable market-neutral integration example.
- [README](../README.md): package overview and quick start.

The runtime `builtinPaymentChannels` export is authoritative. Generated files are inspection aids, not a replacement for runtime discovery. `npm run check` fails when they differ from the compiled registry.

Repository modification and release instructions live in [AGENTS.md](../AGENTS.md) and [RELEASING.md](../RELEASING.md). They are contributor guidance, not part of the package's consumer contract.
