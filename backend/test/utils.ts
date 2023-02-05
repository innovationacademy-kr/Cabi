import { DataSource, QueryRunner } from 'typeorm';

/**
 * SQL 파일을 읽어서 쿼리를 실행하는 함수
 * @param queryRunner
 * @param filePath
 */
export async function loadSQL(queryRunner: QueryRunner, filePath: string) {
  /* eslint-disable */
  const sql = require('fs').readFileSync(filePath, 'utf8');
  const commands = sql.split(';');

  for (const command of commands) {
    if (command.trim()) {
      await queryRunner.query(command);
    }
  }
}

/**
 * 실제 테스트에 사용되는 DB를 초기화하는 함수
 * @param testDBName
 */
export async function initTestDB(testDBName: string) {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3310,
    username: 'root',
    password: 'test_password',
    database: 'test_db',
  });
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.createDatabase(testDBName, true);
  await queryRunner.query(
    `
    GRANT ALL PRIVILEGES ON ${testDBName}.* TO 'test_user'@'%';
    `,
  );
  await queryRunner.release();
  await dataSource.destroy();
}
