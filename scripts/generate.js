const JsonSchemaTranspiler = require('@json-schema-tools/transpiler').default;
const metadataConfigSchema = require('../schema.json');
const Dereferencer = require('@json-schema-tools/dereferencer').default;
const fs = require('fs-extra');

async function generate(fileName, schema) {
  const dereffer = new Dereferencer(schema);
  const dereffedSchema = await dereffer.resolve();
  const transpiler = new JsonSchemaTranspiler(dereffedSchema);
  fs.writeFile(fileName, transpiler.toTypescript());
}
(async function () {
  try {
    console.log('made it started');
    await generate(
      './src/generated/workflow_schema.ts',
      metadataConfigSchema,
    );
  } catch (e) {
    console.log(e);
  }
})();
