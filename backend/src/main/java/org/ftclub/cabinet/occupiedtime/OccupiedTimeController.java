package org.ftclub.cabinet.occupiedtime;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.config.HaneProperties;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/v4/calc")
@RequiredArgsConstructor
public class OccupiedTimeController {

	private final HaneProperties haneProperties;

	@GetMapping("/data/{year}/{month}")
	public List<UserMonthDataDto> fetchData(@PathVariable("year") int year,
			@PathVariable("month") int month) {
		String apiUrl = haneProperties.getUrl() + "?year=" + year
				+ "&month=" + month;

		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer " + haneProperties.getJwtToken());
		HttpEntity<String> entity = new HttpEntity<>(headers);

		UserMonthDataDto[] userMonthDataDtoArray = restTemplate.exchange(apiUrl, HttpMethod.GET,
				entity,
				UserMonthDataDto[].class).getBody();

		List<UserMonthDataDto> userMonthDataDtoList = Arrays.asList(userMonthDataDtoArray);

		List<UserMonthDataDto> sortedUserMonthDataDtoList = userMonthDataDtoList.stream()
				.filter(userMonthDataDto -> userMonthDataDto.getMonthAccumationTime() != 0)
				.sorted(Comparator.comparingInt(UserMonthDataDto::getMonthAccumationTime)
						.reversed())
				.collect(Collectors.toList());

		// monthAccumationTime 기준으로 내림차순 정렬
		sortedUserMonthDataDtoList.sort(
				Comparator.comparingInt(UserMonthDataDto::getMonthAccumationTime).reversed());

		// monthAccumationTime 값의 평균 계산
		int totalAccumulationTime = sortedUserMonthDataDtoList.stream()
				.mapToInt(UserMonthDataDto::getMonthAccumationTime)
				.parallel()
				.sum();
		double averageAccumulationTime =
				(double) totalAccumulationTime / sortedUserMonthDataDtoList.size();
		int hours = (int) averageAccumulationTime / 3600;
		int minutes = ((int) averageAccumulationTime % 3600) / 60;
		int secs = (int) averageAccumulationTime % 60;

		sortedUserMonthDataDtoList.forEach(System.out::println);
		System.out.println(
				"Average monthAccumationTime: " + hours + "시간 " + minutes + "분 " + secs + "초");
		return sortedUserMonthDataDtoList;
	}

}
