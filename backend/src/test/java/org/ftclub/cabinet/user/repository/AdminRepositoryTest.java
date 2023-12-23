package org.ftclub.cabinet.user.repository;

import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.ftclub.cabinet.admin.admin.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Disabled
public class AdminRepositoryTest {

	private Long adminUserId;

	@Autowired
	private AdminRepository adminRepository;

	@BeforeEach
	public void setUp() {
		Admin admin = Admin.of("adminTest@gmail.com", AdminRole.ADMIN);
		admin = adminRepository.save(admin);
		adminUserId = admin.getAdminId();
	}

	@Test
	@DisplayName("어드민 아이디로 어드민 유저 찾기 성공 - 어드민이 존재하는 경우")
	public void findAdminUser_성공_어드민이_존재하는_경우() {
		Optional<Admin> adminUser = adminRepository.findAdminUser(adminUserId);

		assertTrue(adminUser.isPresent());
		assertEquals(adminUserId, adminUser.get().getAdminId());
		assertEquals("adminTest@gmail.com", adminUser.get().getEmail());
		assertEquals(AdminRole.ADMIN, adminUser.get().getRole());
	}

	@Test
	@DisplayName("어드민 아이디로 어드민 유저 찾기 실패 - 어드민이 존재하지 않는 경우")
	public void findAdminUser_실패_어드민이_존재하지_않는_경우() {
		Optional<Admin> adminUser = adminRepository.findAdminUser(10000L);

		assertTrue(adminUser.isEmpty());
	}

	@Test
	@DisplayName("어드민 이메일로 어드민 유저 찾기 성공 - 어드민이 존재하는 경우")
	void findAdminUserByEmail_성공_어드민_유저가_존재하는_경우() {
		Optional<Admin> adminUser = adminRepository.findAdminUserByEmail(
				"adminTest@gmail.com");

		assertTrue(adminUser.isPresent());
		assertEquals(adminUserId, adminUser.get().getAdminId());
		assertEquals("adminTest@gmail.com", adminUser.get().getEmail());
		assertEquals(AdminRole.ADMIN, adminUser.get().getRole());
	}

	@Test
	@DisplayName("어드민 이메일로 어드민 유저 찾기 실패 - 어드민이 존재하지 않는 경우")
	public void findAdminUserByEmail_실패_어드민이_존재하지_않는_경우() {
		Optional<Admin> adminUser = adminRepository.findAdminUserByEmail("test@gmail.com");

		assertTrue(adminUser.isEmpty());
	}

	@Test
	@DisplayName("유저의 이메일로 어드민 유저의 권한 찾기 성공 - 어드민이 존재하는 경우")
	void findAdminUserRoleByEmail_성공_어드민이_존재하는_경우() {
		Optional<AdminRole> adminRole = adminRepository.findAdminUserRoleByEmail(
				"admin1@gmail.com");

		assertTrue(adminRole.isPresent());
		assertEquals(AdminRole.ADMIN, adminRole.get());
	}

	@Test
	@DisplayName("유저의 이메일로 어드민 유저의 권한 찾기 실패 - 어드민이 존재하지 않는 경우")
	public void findAdminUserRoleByEmail_실패_어드민이_존재하지_않는_경우() {
		Optional<AdminRole> adminRole = adminRepository.findAdminUserRoleByEmail(
				"test@gmail.com");

		assertFalse(adminRole.isPresent());
	}
}
