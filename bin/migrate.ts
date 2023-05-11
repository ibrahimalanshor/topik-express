import '../src/common/config/load-env';
import { runMigration } from '../src/database/migration';

runMigration()
  .catch((err) => console.log(err))
  .finally(() => process.exit(1));
