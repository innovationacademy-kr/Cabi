package org.ftclub.cabinet.cabinet.service;

import java.util.List;
import java.util.stream.Collectors;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.mapper.LentMapper;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Pageable;

@SpringBootTest
public class repoTest {

	@Autowired
	LentRepository lentRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	CabinetRepository cabinetRepository;

	@Autowired
	LentMapper lentMapper;

	@Test
	void checkData() {
		List<LentHistory> lentHistoryDtoList = lentRepository.findPaginationByCabinetId(4L,
				Pageable.ofSize(10)).stream().map(el -> {
			System.out.println(el);
			return el;
		}).collect(Collectors.toList());

		System.out.println("collected!");

		lentMapper.toLentHistoryPaginationDto(
				generateLentHistoryDtoList(lentHistoryDtoList),
				10).toString();
	}

	private List<LentHistoryDto> generateLentHistoryDtoList(
			List<LentHistory> lentHistories) {
		return lentHistories.stream()
				.map(e -> lentMapper.toLentHistoryDto(e,
						userRepository.getUser(e.getUserId()),
						cabinetRepository.findById(e.getCabinetId()).orElseThrow()))
				.collect(Collectors.toList());
	}
}
