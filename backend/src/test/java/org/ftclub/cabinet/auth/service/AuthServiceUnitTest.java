package org.ftclub.cabinet.auth.service;

import org.ftclub.cabinet.config.DomainProperties;
import org.ftclub.cabinet.config.MasterProperties;
import org.ftclub.cabinet.dto.MasterLoginDto;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.service.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Map;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class AuthServiceUnitTest {

	@InjectMocks
	AuthService authService;
	@Mock
	MasterProperties masterProperties = mock(MasterProperties.class);
	@Mock
	DomainProperties domainProperties = mock(DomainProperties.class);
	@Mock
	UserService userService = mock(UserService.class);

	@Test
	@DisplayName("성공: MasterLoginDto의 id와 password가 일치하면 true를 반환한다.")
	void 성공_validateMasterLogin() {
		MasterLoginDto masterLoginDto = mock(MasterLoginDto.class);
		given(masterLoginDto.getId()).willReturn("id");
		given(masterLoginDto.getPassword()).willReturn("password");
		given(masterProperties.getId()).willReturn("id");
		given(masterProperties.getPassword()).willReturn("password");

		Assertions.assertTrue(authService.validateMasterLogin(masterLoginDto));
	}

	@Test
	@DisplayName("실패: MasterLoginDto의 id와 password가 일치하지 않으면 false를 반환한다.")
	void 실패_validateMasterLogin() {
		MasterLoginDto masterLoginDto = mock(MasterLoginDto.class);
		given(masterLoginDto.getId()).willReturn("id");
		given(masterLoginDto.getPassword()).willReturn("WRONG_PASSWORD");
		given(masterProperties.getId()).willReturn("id");
		given(masterProperties.getPassword()).willReturn("password");

		Assertions.assertFalse(authService.validateMasterLogin(masterLoginDto));
	}

	@Test
	@DisplayName("성공: 카뎃 계정이 존재하지 않으면 사용자를 생성한다.")
	void 성공_addUserIfNotExistsByClaims() {
		Map<String, Object> claims = mock(Map.class);
		LocalDateTime blackholedAt = LocalDateTime.now().plusDays(123);
		given(claims.get("email")).willReturn("email@user.com");
		given(claims.get("name")).willReturn("name");
		given(claims.get("blackholedAt")).willReturn(blackholedAt);
		given(userService.checkUserExists("email@user.com")).willReturn(false);
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.com");
		given(domainProperties.getUserEmailDomain()).willReturn("user.com");

		authService.addUserIfNotExistsByClaims(claims);

		then(userService).should().createUser("name", "email@user.com", blackholedAt, UserRole.USER);
	}

	@Test
	@DisplayName("성공: 멤버 계정이 존재하지 않으면 사용자를 생성한다.")
	void 성공_addUserIfNotExistsByClaims2() {
		Map<String, Object> claims = mock(Map.class);
		LocalDateTime blackholedAt = LocalDateTime.now().plusDays(123);
		given(claims.get("email")).willReturn("email@user.com");
		given(claims.get("name")).willReturn("name");
		given(claims.get("blackholedAt")).willReturn(null);
		given(userService.checkUserExists("email@user.com")).willReturn(false);
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.com");
		given(domainProperties.getUserEmailDomain()).willReturn("user.com");

		authService.addUserIfNotExistsByClaims(claims);

		then(userService).should().createUser("name", "email@user.com", null, UserRole.USER);
	}

	@Test
	@DisplayName("성공: 관리자 사용자 계정이 존재하지 않으면 사용자를 생성한다.")
	void 성공_addUserIfNotExistsByClaims3() {
		Map<String, Object> claims = mock(Map.class);
		given(claims.get("email")).willReturn("email@admin.com");
		given(userService.checkUserExists("email@admin.com")).willReturn(false);
		given(userService.checkAdminUserExists("email@admin.com")).willReturn(false);
		given(domainProperties.getAdminEmailDomain()).willReturn("admin.com");
		given(domainProperties.getUserEmailDomain()).willReturn("user.com");

		authService.addUserIfNotExistsByClaims(claims);

		then(userService).should().createAdminUser("email@admin.com");
	}

	@Test
	@DisplayName("실패: 사용자 계정이 존재하면 사용자를 생성하지 않는다.")
	void 실패_addUserIfNotExistsByClaims() {
		Map<String, Object> claims = mock(Map.class);
		given(claims.get("email")).willReturn("email@user.com");
		given(userService.checkUserExists("email@user.com")).willReturn(true);

		authService.addUserIfNotExistsByClaims(claims);

		then(userService).should().checkUserExists("email@user.com");
		then(userService).shouldHaveNoMoreInteractions();
	}

	@Test
	@DisplayName("실패: 관리자 계정이 존재하면 사용자를 생성하지 않는다.")
	void 실패_addUserIfNotExistsByClaims2() {
		Map<String, Object> claims = mock(Map.class);
		given(claims.get("email")).willReturn("email@admin.com");
		given(userService.checkUserExists("email@admin.com")).willReturn(false);
		given(userService.checkAdminUserExists("email@admin.com")).willReturn(true);

		authService.addUserIfNotExistsByClaims(claims);

		then(userService).should().checkUserExists("email@admin.com");
		then(userService).should().checkAdminUserExists("email@admin.com");
		then(userService).shouldHaveNoMoreInteractions();
	}
}