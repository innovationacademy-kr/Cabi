package org.ftclub.jdbc;

import javax.transaction.Transactional;
import org.ftclub.cabinet.CabinetApplication;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@SpringBootTest(classes = CabinetApplication.class)
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ExtendWith(SpringExtension.class)
class MairaDbTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @Transactional
    public void testQuery() {
        CabinetStatus status = jdbcTemplate.queryForObject(
                "select status from cabinet WHERE cabinet_id = 1",
                CabinetStatus.class);
        System.out.printf("cabinet status: %s\n", status);
        jdbcTemplate.query("update cabinet set status = 'AVAILABLE' where cabinet_id = 1",
                (RowMapper<Object>) (rs, rowNum) -> null);
        System.out.printf("not committed cabinet status: %s\n", status);
        status = jdbcTemplate.queryForObject(
                "select status from cabinet WHERE cabinet_id = 1",
                CabinetStatus.class);
        System.out.printf("committed cabinet status: %s\n", status);
    }
}
