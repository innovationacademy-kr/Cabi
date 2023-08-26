package org.ftclub.cabinet.occupiedtime;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v4/calc")
@RequiredArgsConstructor
@Log4j2
public class OccupiedTimeController {

	private final OccupiedTimeManager occupiedTimeManager;


	@GetMapping("/data/{year}/{month}")
	public List<UserMonthDataDto> fetchData(@PathVariable("year") int year,
			@PathVariable("month") int month) {

		UserMonthDataDto[] userMonthDataDtoArray = occupiedTimeManager.getUserLastMonthOccupiedTime();

		List<User> allCabiUsers = occupiedTimeManager.findAllCabiUsers();

		List<UserMonthDataDto> userMonthDataDtoList = Arrays.stream(userMonthDataDtoArray)
				.filter(dto -> allCabiUsers.stream()
						.anyMatch(user -> user.getName().equals(dto.getLogin())))
				.collect(Collectors.toList());

		List<UserMonthDataDto> highTimeUsers = userMonthDataDtoList.stream()
				.filter(dto -> dto.getMonthAccumationTime() > 432000)
				.collect(Collectors.toList());

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

//		sortedUserMonthDataDtoList.forEach(System.out::println);

		System.out.println("전체 사람 수 = " + userMonthDataDtoList.size());
		System.out.println("0시간을 제외한 사람들 수 = " + sortedUserMonthDataDtoList.size());
		System.out.println("highTimers = " + highTimeUsers.size());
		System.out.println(
				"Average monthAccumationTime: " + hours + "시간 " + minutes + "분 " + secs + "초");
		return sortedUserMonthDataDtoList;
	}
}
