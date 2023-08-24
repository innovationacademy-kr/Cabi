package org.ftclub.cabinet.utils.blackhole.manager;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.exception.UtilException;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
public class BlackholeManager {

	private final FtApiManager ftApiManager;
	private final LentService lentService;
	private final UserService userService;

	/**
	 * JsonNode에 담긴 cursus_users를 확인하여 해당 유저가 카뎃인지 확인한다. cursus_users에 담긴 정보가 2개 이상이면 카뎃이다.
	 * cursus_users에 담긴 정보가 2개 미만이면 카뎃이 아니다. (피시너 등)
	 *
	 * @param jsonUserInfo JsonNode에 담긴 유저 정보
	 * @return 카뎃 여부
	 */
	private boolean isValidCadet(JsonNode jsonUserInfo) {
		log.debug("isValidCadet {}", jsonUserInfo);
		log.info("isValidCadet");
		return jsonUserInfo.get("cursus_users").size() >= 2;
	}

	/**
	 * 블랙홀 날짜를 LocalDateTime으로 파싱한다.
	 *
	 * @param jsonUserInfo JsonNode에 담긴 유저 정보
	 * @return LocalDateTime으로 파싱된 블랙홀 날짜
	 */
	private LocalDateTime parseBlackholedAt(JsonNode jsonUserInfo) {
		log.info("parseBlackholedAt {}", jsonUserInfo);
		JsonNode JsonBlackholedAt = jsonUserInfo.get("cursus_users").get(1).get("blackholed_at");
		if (JsonBlackholedAt == null || JsonBlackholedAt.asText().equals("null")) {
			return null;
		}
		return LocalDateTime.parse(JsonBlackholedAt.asText().substring(0, 19));
	}

	/**
	 * 갱신된 블랙홀 날짜를 바탕으로 블랙홀에 빠졌는지 확인한다.
	 *
	 * @param blackholedAtDate 블랙홀 날짜
	 * @return 블랙홀에 빠졌는지 여부
	 */
	private boolean isBlackholed(LocalDateTime blackholedAtDate) {
		log.info("isBlackholed {} {}", blackholedAtDate);
		LocalDateTime now = LocalDateTime.now();
		if (blackholedAtDate == null || blackholedAtDate.isAfter(now)) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 카뎃이 아닌 유저를 강제 반납 및 삭제 처리한다.
	 *
	 * @param userBlackholeInfoDto 유저 정보 {@link UserBlackholeInfoDto}
	 * @param now                  현재 시간
	 */
	private void handleNotCadet(UserBlackholeInfoDto userBlackholeInfoDto, LocalDateTime now) {
		log.warn("{}는 카뎃이 아닙니다.", userBlackholeInfoDto);
		lentService.terminateLentCabinet(userBlackholeInfoDto.getUserId());
		userService.deleteUser(userBlackholeInfoDto.getUserId(), now);
	}

	/**
	 * 블랙홀에 빠진 유저를 강제 반납 및 삭제 처리한다.
	 *
	 * @param userBlackholeInfoDto 유저 정보 {@link UserBlackholeInfoDto}
	 */
	private void handleBlackholed(UserBlackholeInfoDto userBlackholeInfoDto) {
		log.info("{}는 블랙홀에 빠졌습니다.", userBlackholeInfoDto);
		LocalDateTime now = LocalDateTime.now();
		lentService.terminateLentCabinet(userBlackholeInfoDto.getUserId());
		userService.deleteUser(userBlackholeInfoDto.getUserId(), now);
	}

	/**
	 * 블랙홀에 빠지지 않은 유저의 블랙홀 날짜를 갱신한다.
	 *
	 * @param userBlackholeInfoDto 유저 정보 {@link UserBlackholeInfoDto}
	 * @param newBlackholedAt      갱신된 블랙홀 날짜
	 */
	private void handleNotBlackholed(UserBlackholeInfoDto userBlackholeInfoDto,
			LocalDateTime newBlackholedAt) {
		log.info("{}는 블랙홀에 빠지지 않았습니다.", userBlackholeInfoDto);
		userService.updateUserBlackholedAt(userBlackholeInfoDto.getUserId(), newBlackholedAt);
	}

	/**
	 * 유저 정보 조회 결과 해당 유저를 42에서 찾을 수 없다면, 강제 반납 및 삭제 처리한다.
	 *
	 * @param userBlackholeInfoDto 유저 정보 {@link UserBlackholeInfoDto}
	 * @param now                  현재 시간
	 * @param e                    HttpClientErrorException
	 */
	private void handleHttpClientError(UserBlackholeInfoDto userBlackholeInfoDto, LocalDateTime now,
			HttpClientErrorException e) {
		log.error("handleBlackhole HttpClientErrorException {}", e.getStatusCode());
		if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
			log.warn("{}는 42에서 찾을 수 없습니다.", userBlackholeInfoDto);
			lentService.terminateLentCabinet(userBlackholeInfoDto.getUserId());
			userService.deleteUser(userBlackholeInfoDto.getUserId(), now);
		}
	}

	/**
	 * 유저의 블랙홀 정보를 API 를 통해 요청하여 찾아온다.
	 *
	 * @param userName 유저 이름
	 * @return JsonNode 유저의 블랙홀 정보
	 * @throws ServiceException
	 */
	private JsonNode getBlackholeInfo(String userName)
			throws ServiceException, HttpClientErrorException {
		log.info("called refreshBlackhole{}", userName);
		JsonNode userInfoFromIntra = ftApiManager.getFtUsersInfoByName(
				userName);

		return userInfoFromIntra;
	}


	/**
	 * 유저의 블랙홀 날짜를 갱신하여 LocalDateTime으로 반환한다.
	 *
	 * @param userName 유저 이름
	 * @return 갱신된 블랙홀 날짜 LocalDateTime
	 */
	private LocalDateTime refreshBlackholedAt(String userName) {
		log.info("refreshBlackholedAt {}", userName);
		JsonNode blackholeInfo = getBlackholeInfo(userName);
		return parseBlackholedAt(blackholeInfo);
	}

	/**
	 * 유저속성의 블랙홀 날짜를 갱신한다.
	 *
	 * @param userId       유저 아이디
	 * @param blackholedAt 갱신할 블랙홀 날짜
	 */
	private void updateUserBlackholedAt(Long userId, LocalDateTime blackholedAt) {
		userService.updateUserBlackholedAt(userId, blackholedAt);
	}


	/**
	 * 스케쥴러가 샐행하는 블랙홀 처리 메서드 유저의 블랙홀 정보를 갱신하여 블랙홀에 빠졌는지 확인 후 처리한다.
	 * <p>
	 * 블랙홀에 빠진경우 반납 / 계정 삭제처리 블랙홀에 빠지지 않은경우 블랙홀 날짜 갱신
	 *
	 * @param userInfoDto
	 */

	public void handleBlackhole(UserBlackholeInfoDto userInfoDto) {
		log.info("called handleBlackhole {}", userInfoDto);
		LocalDateTime now = LocalDateTime.now();
		try {
			JsonNode jsonRefreshedUserInfo = getBlackholeInfo(userInfoDto.getName());
			if (!isValidCadet(jsonRefreshedUserInfo)) {
				handleNotCadet(userInfoDto, now);
				return;
			}
			LocalDateTime newBlackholedAt = parseBlackholedAt(jsonRefreshedUserInfo);
			log.info("갱신된 블랙홀 날짜 {}", newBlackholedAt);
			log.info("오늘 날짜 {}", now);

			if (isBlackholed(newBlackholedAt)) {
				handleBlackholed(userInfoDto);
			} else {
				handleNotBlackholed(userInfoDto, newBlackholedAt);
			}
		} catch (HttpClientErrorException e) {
			handleHttpClientError(userInfoDto, now, e);
		} catch (ServiceException e) {
			if (e.getStatus().equals(ExceptionStatus.NO_LENT_CABINET)) {
				userService.deleteUser(userInfoDto.getUserId(), now);
			}
			else if (e.getStatus().equals(ExceptionStatus.OAUTH_BAD_GATEWAY))
				log.info("handleBlackhole ServiceException {}", e.getStatus());
				throw new UtilException(e.getStatus());
		} catch (Exception e) {
			log.error("handleBlackhole Exception: {}", userInfoDto, e);
		}
	}

	// 따로 분리할 필요 없을듯..

	/**
	 * 블랙홀 갱신 후 처리
	 * <p>
	 * 블랙홀일 경우 반납 및 삭제 처리 블랙홀이 아닐경우 유저 정보(블랙홀일자) 업데이트
	 *
	 * @param userBlackholeInfoDto
	 */
	public void blackholeRefresher(UserBlackholeInfoDto userBlackholeInfoDto) {
		LocalDateTime refreshedBlackholedAt = refreshBlackholedAt(userBlackholeInfoDto.getName());
		if (isBlackholed(refreshedBlackholedAt)) {
			handleBlackholed(userBlackholeInfoDto);
			throw new ServiceException(ExceptionStatus.BLACKHOLED_USER);
		} else {
			updateUserBlackholedAt(userBlackholeInfoDto.getUserId(), refreshedBlackholedAt);
		}
	}
}
