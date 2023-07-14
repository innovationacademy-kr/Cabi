package org.ftclub.cabinet.utils.leave.absence;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

@ExtendWith(MockitoExtension.class)
public class LeaveAbsenceManagerUnitTest {

	@InjectMocks
	private LeaveAbsenceManager leaveAbsenceManager;
	@Mock
	private FtApiManager ftApiManager = mock(FtApiManager.class);
	@Mock
	private LentService lentService = mock(LentService.class);
	@Mock
	private UserService userService = mock(UserService.class);

	@Mock(lenient = true)
	FtApiProperties ftApiProperties = mock(FtApiProperties.class);

	@BeforeEach
	@DisplayName("테스트 전에 API 정보를 설정한다.")
	void setUp() {
		given(ftApiProperties.getAuthUri()).willReturn("https://urifor.auth");
		given(ftApiProperties.getClientId()).willReturn("client_id");
		given(ftApiProperties.getRedirectUri()).willReturn("https://urifor.auth/callback");
		given(ftApiProperties.getScope()).willReturn("profile");
		given(ftApiProperties.getGrantType()).willReturn("code");
	}

	@Test
	@DisplayName("성공 - 휴학생인 유저")
	void 성공_handleLeaveAbsence_휴학생유저() {
		Long userId = 1L;
		String name = "휴학생성희님";
		JsonNode jsonUserInfo = mock(JsonNode.class);
		JsonNode mockFieldNode = mock(JsonNode.class);
		given(jsonUserInfo.get("active?")).willReturn(mockFieldNode);
		given(mockFieldNode.asBoolean()).willReturn(false);
		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);

		leaveAbsenceManager.handleLeaveAbsence(userId, name);

		then(lentService).should().terminateLentCabinet(userId);
	}

	@Test
	@DisplayName("실패 - 휴학생 아닌 유저")
	void 실패_handleLeaveAbsence_휴학생아닌유저() {
		Long userId = 2L;
		String name = "고통받는막학기재학생사난";
		JsonNode jsonUserInfo = mock(JsonNode.class);
		JsonNode mockFieldNode = mock(JsonNode.class);
		given(jsonUserInfo.get("active?")).willReturn(mockFieldNode);
		given(mockFieldNode.asBoolean()).willReturn(true);
		given(ftApiManager.getFtUsersInfoByName(name)).willReturn(jsonUserInfo);

		leaveAbsenceManager.handleLeaveAbsence(userId, name);

		then(lentService).should(never()).terminateLentCabinet(userId);
	}

	@Test
	@DisplayName("실패 - 42에 존재하지 않는 유저")
	void 실패_handleLeaveAbsence_존재하지않는유저() {
		Long userId = 3L;
		String name = "42에없는유저";
		given(ftApiManager.getFtUsersInfoByName(name)).willThrow(
				new HttpClientErrorException(HttpStatus.NOT_FOUND));
		ArgumentCaptor<LocalDateTime> localDateTimeCaptor = ArgumentCaptor.forClass(
				LocalDateTime.class);

		leaveAbsenceManager.handleLeaveAbsence(userId, name);

		then(lentService).should().terminateLentCabinet(userId);
		then(userService).should().deleteUser(eq(userId), localDateTimeCaptor.capture());
	}

	@Test
	@DisplayName("실패 - API 요청 실패로 인한 알 수 없는 오류")
	void 실패_handleLeaveAbsence_알수없는오류() {
		Long userId = 4L;
		String name = "평범한우주님";
		given(ftApiManager.getFtUsersInfoByName(name)).willThrow(
				new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
		ArgumentCaptor<LocalDateTime> localDateTimeCaptor = ArgumentCaptor.forClass(
				LocalDateTime.class);

		leaveAbsenceManager.handleLeaveAbsence(userId, name);

		then(lentService).should(never()).terminateLentCabinet(userId);
		then(userService).should(never()).deleteUser(eq(userId), localDateTimeCaptor.capture());
	}
}
