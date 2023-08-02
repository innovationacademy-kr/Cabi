package org.ftclub.cabinet.utils.blackhole.manager;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
public class BlackholeManager {

	private final FtApiManager ftAPIManager;
	private final LentService lentService;
	private final UserService userService;

	/**
	 * JsonNode에 담긴 cursus_users를 확인하여 해당 유저가 카뎃인지 확인한다. cursus_users에 담긴 정보가 2개 이상이면 카뎃이다.
	 * cursus_users에 담긴 정보가 2개 미만이면 카뎃이 아니다. (피시너 등)
	 *
	 * @param jsonUserInfo JsonNode에 담긴 유저 정보
	 * @return 카뎃 여부
	 */
	private Boolean isValidCadet(JsonNode jsonUserInfo) {
		log.info("isValidCadet {}", jsonUserInfo);
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
	 * @param now              현재 시간
	 * @return 블랙홀에 빠졌는지 여부
	 */
	private Boolean isBlackholed(LocalDateTime blackholedAtDate, LocalDateTime now) {
		log.info("isBlackholed {} {}", blackholedAtDate, now);
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
	 * @param now                  현재 시간
	 */
	private void handleBlackholed(UserBlackholeInfoDto userBlackholeInfoDto, LocalDateTime now) {
		log.info("{}는 블랙홀에 빠졌습니다.", userBlackholeInfoDto);
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

	public void handleBlackhole(UserBlackholeInfoDto userBlackholeInfoDto) {
		log.info("called handleBlackhole {}", userBlackholeInfoDto);
		LocalDateTime now = LocalDateTime.now();
		try {
			JsonNode jsonUserInfo = ftAPIManager.getFtUsersInfoByName(
					userBlackholeInfoDto.getName());
			if (!isValidCadet(jsonUserInfo)) {
				handleNotCadet(userBlackholeInfoDto, now);
				return;
			}
			LocalDateTime newBlackholedAt = parseBlackholedAt(jsonUserInfo);
			log.info("갱신된 블랙홀 날짜 {}", newBlackholedAt);
			log.info("오늘 날짜 {}", now);

			if (isBlackholed(newBlackholedAt, now)) {
				handleBlackholed(userBlackholeInfoDto, now);
			} else {
				handleNotBlackholed(userBlackholeInfoDto, newBlackholedAt);
			}
		} catch (HttpClientErrorException e) {
			handleHttpClientError(userBlackholeInfoDto, now, e);
		} catch (ServiceException e) {
			if (e.getStatus().equals(ExceptionStatus.NO_LENT_CABINET)) {
				userService.deleteUser(userBlackholeInfoDto.getUserId(), now);
			}
		} catch (Exception e) {
			log.error("handleBlackhole Exception: {}", userBlackholeInfoDto, e);
		}
	}
}
