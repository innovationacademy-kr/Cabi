package org.ftclub.cabinet.utils.blackhole.manager;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.time.LocalDateTime;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.domain.FtProfile;
import org.ftclub.cabinet.auth.service.ApplicationTokenManager;
import org.ftclub.cabinet.auth.service.UserOauthService;
import org.ftclub.cabinet.dto.UserBlackHoleEvent;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.service.UserCommandService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
public class BlackholeManager {

	private final UserOauthService userOauthService;
	private final ApplicationTokenManager tokenManager;
	private final LentFacadeService lentFacadeService;
	private final UserCommandService userCommandService;

	/**
	 * 블랙홀에 빠진 유저를 강제 반납 및 삭제 처리한다.
	 *
	 * @param userBlackHoleEvent 유저 정보 {@link UserBlackHoleEvent}
	 */
	private void terminateInvalidUser(UserBlackHoleEvent userBlackHoleEvent, LocalDateTime now) {
		log.info("{}는 유효하지 않은 사용자입니다.", userBlackHoleEvent);
		lentFacadeService.endUserLent(userBlackHoleEvent.getUserId(), null);
		userCommandService.deleteById(userBlackHoleEvent.getUserId(), now);
	}

	/**
	 * 42 API를 통해 유저의 프로필을 가져온다.
	 *
	 * @param userName 42 intra name
	 * @return 유저 프로필 {@link FtProfile}
	 */
	public FtProfile getUserRecentIntraProfile(String userName) {
		try {
			return userOauthService.getProfileByIntraName(tokenManager.getFtAccessToken(),
					userName);
		} catch (JsonProcessingException e) {
			log.error("getUserRecentIntraProfile Exception: {}", userName, e);
			throw ExceptionStatus.OAUTH_BAD_GATEWAY.asServiceException();
		}
	}

	/**
	 * 스케쥴러가 샐행하는 블랙홀 처리 메서드 유저의 블랙홀 정보를 갱신하여 블랙홀에 빠졌는지 확인 후 처리한다.
	 * <p>
	 * 블랙홀에 빠진경우 반납 / 계정 삭제처리 블랙홀에 빠지지 않은경우 블랙홀 날짜 갱신
	 *
	 * @param dto 유저 정보 {@link UserBlackHoleEvent}
	 */
	@Transactional
	public void handleBlackHole(UserBlackHoleEvent dto) {
		LocalDateTime now = LocalDateTime.now();
		try {
			FtProfile userRecentIntraProfile = getUserRecentIntraProfile(dto.getName());
			if (!userRecentIntraProfile.getRole().isInCursus()) {
				terminateInvalidUser(dto, now);
			}
			userCommandService.updateUserBlackholedAtById(dto.getUserId(),
					userRecentIntraProfile.getBlackHoledAt());
		} catch (HttpClientErrorException e) {
			HttpStatus status = e.getStatusCode();
			if (status.equals(HttpStatus.UNAUTHORIZED) || status.equals(HttpStatus.FORBIDDEN)) {
				tokenManager.refreshFtAccessToken();
			}
			if (status.equals(HttpStatus.NOT_FOUND)) {
				terminateInvalidUser(dto, now);
			}
		} catch (ServiceException e) {
			ExceptionStatus status = e.getStatus();
			if (status.equals(ExceptionStatus.NO_LENT_CABINET)) {
				userCommandService.deleteById(dto.getUserId(), now);
			}
			log.info("handleBlackholedUser ServiceException {}", e.getStatus());
			throw e.getStatus().asUtilException();

		} catch (Exception e) {
			log.error("handleBlackHoledUser Exception: {}", dto, e);
			tokenManager.refreshFtAccessToken();
		}
	}

	private boolean isBlackholed(LocalDateTime blackholedAt) {
		if (blackholedAt == null) {
			return false;
		}
		return blackholedAt.isBefore(LocalDateTime.now());
	}

	public void blackholeUpdate(User user) {
		if (isBlackholed(user.getBlackholedAt())) {
			return;
		}
		FtProfile userRecentIntraProfile = getUserRecentIntraProfile(user.getName());
		userCommandService.updateUserBlackholedAtById(user.getId(),
				userRecentIntraProfile.getBlackHoledAt());
	}
}
