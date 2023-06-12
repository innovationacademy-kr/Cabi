package org.ftclub.cabinet.user.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Optional;
import javax.transaction.Transactional;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
public class AdminUserRepositoryTest {

	@Autowired
	private AdminUserRepository adminUserRepository;

	@Test
	public void testGetAdminUser() {
		Long adminUserId = 1L;

		AdminUser adminUser = adminUserRepository.getAdminUser(adminUserId);

		assertNotNull(adminUser);
		assertEquals(adminUserId, adminUser.getAdminUserId());
		assertEquals("admin0@gmail.com", adminUser.getEmail());
	}

	@Test
	public void testFindByEmail() {
		String email = "admin1@gmail.com";

		Optional<AdminUser> adminUser = adminUserRepository.findByEmail(email);

		Assertions.assertTrue(adminUser.isPresent());
		assertEquals(email, adminUser.get().getEmail());
	}
}
