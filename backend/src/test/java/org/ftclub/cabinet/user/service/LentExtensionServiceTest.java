package org.ftclub.cabinet.user.service;

import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@Disabled // Test를 위한 In-Memory를 얹는 데에 있어서 DDL이 동작하지 않음. 임시 비활성화
public class LentExtensionServiceTest {

//	@Autowired EntityManager em;
//	@Autowired LentExtensionService lentExtensionService;
//	@Autowired LentExtensionRepository lentExtensionRepository;
//	@MockBean FCMInitializer fcmInitializer; // 임시로 의존 제거,
//
//	@Nested
//	@DisplayName("만료된 연장권들을 지울 때,")
//	class DeleteExpiredExtensions {
//		LocalDateTime now = LocalDateTime.now();
//		User sanan;
//		User jpark2;
//
//		@BeforeEach
//		void setUp() {
//			sanan = User.of("sanan", "email@ab.com", LocalDateTime.MAX, UserRole.USER);
//			jpark2 = User.of("jpark2", "email@ac.com", LocalDateTime.MAX, UserRole.USER);
//			em.persist(sanan);
//			em.persist(jpark2);
//		}
//	}
}
