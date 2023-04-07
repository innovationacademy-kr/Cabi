package org.ftclub.cabinet.auth;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.repository.AuthRepository;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthRepository authRepository;

	public User getUserByName(String name) {
		System.out.printf("in service, name = %s\n", name);
		return authRepository.findUserByName(name);
	}

	public void saveTest() {
		User test = new User(
				"test",
				"email",
				new Date(),
				UserRole.USER
		);
		authRepository.save(test);
	}
}
