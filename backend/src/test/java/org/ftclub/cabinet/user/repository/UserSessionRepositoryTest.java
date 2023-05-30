package org.ftclub.cabinet.user.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Optional;
import javax.transaction.Transactional;
import org.ftclub.cabinet.user.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@SpringBootTest
@Transactional
public class UserSessionRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Test
	public void testFindNameById() {
		// user1
		Long userId = 9L;

		String name = userRepository.findNameById(userId);
		assertNotNull(name);
		assertEquals("user1", name);
	}

	@Test
	public void testGetUser() {
		Long userId = 9L;

		User user = userRepository.getUser(userId);

		assertNotNull(user);
		assertEquals("user1", user.getName());
	}

	@Test
	public void testFindByName() {
		String name = "user2";

		Optional<User> user = userRepository.findByName(name);

		assertTrue(user.isPresent());
		assertEquals("user2", user.get().getName());
	}

	@Test
	public void testFindByPartialName() {
		String partialName = "lent";
		Pageable pageable = PageRequest.of(0, 10);

		Page<User> users = userRepository.findByPartialName(partialName, pageable);

		assertNotNull(users);
		assertEquals(2, users.getTotalElements());
		assertEquals(1, users.getTotalPages());
	}
}
