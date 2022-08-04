const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pool = require('./config/database');
const config = require('./config/config');

const disabledLogQuery = fs.readFileSync('disable.sql').toString('utf-8');
const userQuery = fs.readFileSync('user.sql').toString('utf-8');
const cabinetQuery = fs.readFileSync('cabinet.sql').toString('utf-8');
const banUserQuery = fs.readFileSync('ban_user.sql').toString('utf-8');
const lentQuery = fs.readFileSync('lent.sql').toString('utf-8');
const lentLogQuery = fs.readFileSync('lent_log.sql').toString('utf-8');
const cabinetDataQuery = fs.readFileSync('cabinet_data.sql').toString('utf-8');

const init = async () => {
  try {
    await Promise.all([
      pool.query(userQuery),
      pool.query(cabinetQuery),
      pool.query(disabledLogQuery),
      pool.query(banUserQuery),
      pool.query(lentLogQuery),
    ]);
    console.log('  ✅  User Table');
    console.log('  ✅  Cabinet Table');
    console.log('  ✅  Lent Log Table');
    console.log('  ✅  Disable Log Table');
    console.log('  ✅  Ban Log Table');
    
    await pool.query(lentQuery);
    console.log('  ✅  Lent Table');
    await pool.query(cabinetDataQuery)
    console.log('  ✅  Cabinet Data');
  } catch (error) {
    console.log(`❌ 오류가 발생했습니다.\n${error}`);
    console.log('\n yoyoo에게 문의해주세요. ');
  } finally {
    pool.end();
    console.log(
      `\n\n use ${config.getDatabase()}\n show tables\n 위 명령어를 사용해 위에 명시한 6개 테이블이 잘 만들어졌는지 확인해주세요.\n`
    );
    process.exit(0);
  }
};

console.log(
  '❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️\n❗️❗️ 반드시 데이터베이스가 만들어진 상태에서 시행하셔야 합니다. ❗️❗️\n❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️❗️ \n\n\n\n'
);
console.log(
  `\n  해당 명령어는 한 번만 사용하시면 됩니다.\n\n  '${config.getDatabase()}'에\x1b[35m \`user\` \`cabinet\` \`lent\` \`lent_log\` \`disable\` \`ban log\` \x1b[0m 테이블을 만듭니다. (테이블이 존재하는 경우엔 만들지 않습니다.)\n\n  만드시겠습니까? [y/n] (EOF는 yes 처리됩니다.)`
);

rl.on('line', (line) => {
  if (line === 'n') {
    process.exit();
  } else if (line === 'y') {
    rl.close();
  } else {
    console.log('[y/n]으로 입력해주세요');
  }
});
rl.on('SIGINT', () => {
  process.exit();
});
rl.on('SIGQUIT', () => {
  process.exit();
});
rl.on('close', () => {
  init();
});
