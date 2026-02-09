import type { MigrationSchema } from '@/types/migration';
import { sapSchema } from './sap';
import { snowflakeSchema } from './snowflake';
import { oracleSchema } from './oracle';
import { redshiftSchema } from './redshift';
import { sqlServerSchema } from './sql-server';
import { informaticaSchema } from './informatica';
import { synapseSchema } from './synapse';
import { teradataSchema } from './teradata';
import { talendSchema } from './talend';
import { gcpSchema } from './gcp';
import { unityCatalogSchema } from './unity-catalog';

export const migrationSchemas: Record<string, MigrationSchema> = {
  sap: sapSchema,
  snowflake: snowflakeSchema,
  oracle: oracleSchema,
  redshift: redshiftSchema,
  'sql-server': sqlServerSchema,
  informatica: informaticaSchema,
  synapse: synapseSchema,
  teradata: teradataSchema,
  talend: talendSchema,
  gcp: gcpSchema,
  'unity-catalog': unityCatalogSchema,
};

export function getSchemaByPlatform(slug: string): MigrationSchema | undefined {
  return migrationSchemas[slug];
}
