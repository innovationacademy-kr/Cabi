package org.ftclub.cabinet.utils.blackhole.manager;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.auth.service.FtApiManager;
import org.ftclub.cabinet.dto.UserBlackholeInfoDto;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.user.service.UserService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Log4j2
public class BlackholeRefresher {

	private final FtApiManager ftApiManager;
	private final UserService userService;

	/**
	 * 유저의 블랙홀 정보를 찾아온다.
	 *
	 * @param userBlackholeInfoDto
	 * @return JsonNode
	 * @throws ServiceException
	 */
	public JsonNode getBlackholeInfo(UserBlackholeInfoDto userBlackholeInfoDto)
			throws ServiceException {
		log.info("called refreshBlackhole{}", userBlackholeInfoDto);
		return ftApiManager.getFtUsersInfoByName(
				userBlackholeInfoDto.getName());
	}

	public JsonNode getBlackholeInfo2(UserBlackholeInfoDto userBlackholeInfoDto)
			throws ServiceException {
		log.info("called refreshBlackhole{}", userBlackholeInfoDto);
		getBlackholeInfo(userBlackholeInfoDto);
	}
}
