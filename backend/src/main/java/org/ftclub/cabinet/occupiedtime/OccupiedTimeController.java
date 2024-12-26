package org.ftclub.cabinet.occupiedtime;

/**
 * FOR TEST ONLY
 */

	/*
@RestController
@RequestMapping("/v4/calc")
@RequiredArgsConstructor
@Log4j2
public class OccupiedTimeController {

    private final OccupiedTimeManager occupiedTimeManager;
	private final LentExtensionService lentExtensionService;

	@GetMapping("/data")
	public List<UserMonthDataDto> test(){
		return occupiedTimeManager.filterCustomUserMonthlyTime(occupiedTimeManager.getUserLastMonthOccupiedTime());
	}

	@GetMapping("/ongoing")
	public String bulk(){
		List<UserMonthDataDto> userMonthDataDtos = occupiedTimeManager.filterCustomUserMonthlyTime(
				occupiedTimeManager.getUserLastMonthOccupiedTime());
		userMonthDataDtos.forEach(dto -> {
			lentExtensionService.assignLentExtension(dto.getLogin());
		});
		return "ok";

	}



    @GetMapping("/data")
    public List<UserMonthDataDto> previousMeet() {
        return occupiedTimeManager.metLimitTimeUser(
                occupiedTimeManager.getUserLastMonthOccupiedTime());
    }

    @GetMapping("/stat/data/{year}/{month}")
    public List<UserMonthDataDto> fetchData(@PathVariable("year") int year,
            @PathVariable("month") int month) {

        UserMonthDataDto[] userMonthDataDtoArray = occupiedTimeManager.getUserLastMonthOccupiedTime();

        List<User> allCabiUsers = occupiedTimeManager.findAllCabiUsers();

        // CABI 가입된 유저들만 필터링
        List<UserMonthDataDto> userMonthDataDtoList = Arrays.stream(userMonthDataDtoArray)
                .filter(dto -> allCabiUsers.stream()
                        .anyMatch(user -> user.getName().equals(dto.getLogin())))
                .collect(Collectors.toList());

        // 120시간 이상인 사람들만 필터링
        List<UserMonthDataDto> highTimeUsers = userMonthDataDtoList.stream()
                .filter(dto -> dto.getMonthAccumationTime() > 432000)
                .collect(Collectors.toList());

        // 0시간을 제외한 사람들만 필터링 & monthAccumationTime 기준으로 내림차순 정렬
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

 */
//}

