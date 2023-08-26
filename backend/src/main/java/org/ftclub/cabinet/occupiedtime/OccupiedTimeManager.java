package org.ftclub.cabinet.occupiedtime;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.config.HaneProperties;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.UtilException;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.repository.UserOptionalFetcher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Log4j2
@Component
@RequiredArgsConstructor
public class OccupiedTimeManager {

	private final HaneProperties haneProperties;
	private final UserOptionalFetcher userOptionalFetcher;
	@Value("${spring.hane.limit-time}")
	private int LIMIT_TIME;
	private static final int MAX_RETRY = 3;

	public List<User> findAllCabiUsers() {
		return userOptionalFetcher.findAllActiveUsers();
	}

	public void metLimitTimeUser(UserMonthDataDto[] userMonthDataDtoList) {
		List<User> allCabiUsers = userOptionalFetcher.findAllActiveUsers();
		List<UserMonthDataDto> userMonthData = Arrays.stream(userMonthDataDtoList)
				.filter(dto -> allCabiUsers.stream()
						.anyMatch(user -> user.getName().equals(dto.getLogin())))
				.collect(Collectors.toList());

	}

	public UserMonthDataDto[] getUserLastMonthOccupiedTime() {
		LocalDateTime time = LocalDateTime.now();

		String currentYear = String.valueOf(time.getYear());
		String currentMonth = String.valueOf(time.getMonth());

		String apiUrl = haneProperties.getUrl() + "?year=" + currentYear
				+ "&month=" + currentMonth;

		int attempt = 0;
		while (attempt < MAX_RETRY) {
			try {
				RestTemplate restTemplate = new RestTemplate();
				HttpHeaders headers = new HttpHeaders();
				headers.set("Authorization", "Bearer " + haneProperties.getJwtToken());
				HttpEntity<String> entity = new HttpEntity<>(headers);

				UserMonthDataDto[] userMonthDataDtoArray = restTemplate.exchange(apiUrl,
						HttpMethod.GET,
						entity,
						UserMonthDataDto[].class).getBody();
				return userMonthDataDtoArray;
			} catch (HttpClientErrorException e) {
				log.error(e);
				log.info("요청에 실패했습니다. 최대 3번 재시도합니다. 현재 시도 횟수: {}", attempt);
				if (attempt == MAX_RETRY) {
					log.error("요청에 실패했습니다. 최대 재시도 횟수를 초과했습니다. {}", e.getMessage());
					throw new UtilException(ExceptionStatus.HANEAPI_ERROR);
				}
			}
		}
		return null;
	}
}
