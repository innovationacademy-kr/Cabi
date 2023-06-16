package org.ftclub.cabinet.user.repository;

import static org.junit.Assert.assertEquals;

import java.util.Date;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class UserOptionalFetcherTest {

	@Autowired
	private UserOptionalFetcher userOptionalFetcher;
	@Autowired
	private UserRepository userRepository;

	@Test
	@DisplayName("유저 찾기 성공 - 유저가 존재하는 경우")
	void findUser_성공_존재하는_유저() {
		//given
		User user = User.of("test", "test@test.com", new Date(), UserRole.USER);
		userRepository.save(user);

		//when
		User result = userOptionalFetcher.findUser(user.getUserId());

		//then
		assertEquals(user.getUserId(), result.getUserId());
		assertEquals(user.getName(), result.getName());
		assertEquals(user.getEmail(), result.getEmail());
	}

	@Test
	@DisplayName("유저 찾기 실패 - 유저가 존재하지 않는 경우")
	void findUser_실패_존재하지않는_유저() {
		//given
		//when
		User result = userOptionalFetcher.findUser(0L);

		//then
		assertEquals(null, result);
	}
}
