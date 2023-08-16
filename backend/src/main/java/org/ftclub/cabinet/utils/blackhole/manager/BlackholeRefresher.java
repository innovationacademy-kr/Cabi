package org.ftclub.cabinet.utils.blackhole.manager;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
@RequiredArgsConstructor
@Log4j2
@Deprecated
public class BlackholeRefresher {

	private final FtApiManager ftApiManager;
	private final UserService userService;

	/**
	 * 유저의 블랙홀 정보를 API 를 통해 요청하 찾아온다.
	 *
	 * @param userName 유저 이름
	 * @return JsonNode 유저의 블랙홀 정보
	 * @throws ServiceException
	 */
	public JsonNode getBlackholeInfo(String userName)
			throws ServiceException, HttpClientErrorException {
		log.info("called refreshBlackhole{}", userName);
		return ftApiManager.getFtUsersInfoByName(
				userName);
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
	 * 유저의 블랙홀 날짜를 갱신하여 블랙홀에 빠졌는지 확인 후 업데이트
	 * @param userBlackholeInfoDto
	 * @return
	 */
	public Boolean isBlackholedAndUpdateBlackhole(UserBlackholeInfoDto userBlackholeInfoDto) {
		log.info("isBlackholedAndUpdateBlackhole {}", userBlackholeInfoDto);
		LocalDateTime now = LocalDateTime.now();
		JsonNode blackholeInfo = getBlackholeInfo(userBlackholeInfoDto.getName());
		LocalDateTime blackholedAtDate = parseBlackholedAt(blackholeInfo);
		if (blackholedAtDate == null || blackholedAtDate.isAfter(now)) {
			userService.updateUserBlackholedAt(userBlackholeInfoDto.getUserId(), blackholedAtDate);
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 갱신된 블랙홀 날짜를 바탕으로 블랙홀에 빠졌는지 확인한다.
	 *
	 * @return 블랙홀에 빠졌는지 여부
	 */
	public boolean isBlackholed(LocalDateTime blackholedAt) {
		log.info("isBlackholed {}", blackholedAt);
		LocalDateTime now = LocalDateTime.now();
		if (blackholedAt == null || blackholedAt.isAfter(now)) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 유저의 블랙홀 날짜를 갱신하여 LocalDateTime으로 반환한다.
	 * @param userName 유저 이름
	 * @return 갱신된 블랙홀 날짜 LocalDateTime
	 */
	public LocalDateTime refreshBlackholedAt(String userName) {
		log.info("refreshBlackholedAt {}", userName);
		JsonNode blackholeInfo = getBlackholeInfo(userName);
		return parseBlackholedAt(blackholeInfo);
	}

	/**
	 * 유저속성의 블랙홀 날짜를 갱신한다.
	 * @param userId 유저 아이디
	 * @param blackholedAt 갱신할 블랙홀 날짜
	 */
	public void refreshBlackholedAt(Long userId, LocalDateTime blackholedAt){
		userService.updateUserBlackholedAt(userId, blackholedAt);
	}
}
