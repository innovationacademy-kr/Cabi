package org.ftclub.cabinet.user.service;

import org.ftclub.cabinet.firebase.FCMInitializer;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensionType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@Disabled // Test를 위한 In-Memory를 얹는 데에 있어서 DDL이 동작하지 않음. 임시 비활성화
public class LentExtensionServiceTest {

	@Autowired EntityManager em;
	@Autowired LentExtensionService lentExtensionService;
	@Autowired LentExtensionRepository lentExtensionRepository;
	@MockBean FCMInitializer fcmInitializer; // 임시로 의존 제거,

	@Nested
	@DisplayName("만료된 연장권들을 지울 때,")
	class DeleteExpiredExtensions {
		LocalDateTime now = LocalDateTime.now();
		User sanan;
		User jpark2;

		@BeforeEach
		void setUp() {
			sanan = User.of("sanan", "email@ab.com", LocalDateTime.MAX, UserRole.USER);
			jpark2 = User.of("jpark2", "email@ac.com", LocalDateTime.MAX, UserRole.USER);
			em.persist(sanan);
			em.persist(jpark2);
		}
	}
}
