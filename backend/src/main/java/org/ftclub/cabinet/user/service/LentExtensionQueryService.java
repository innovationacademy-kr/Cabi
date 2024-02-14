package org.ftclub.cabinet.user.service;

import java.util.List;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensions;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentExtensionQueryService {

	private final LentExtensionRepository lentExtensionRepository;

	/**
	 * 유저의 사용 가능한 연장권 중 사용 기한이 가장 임박한 연장권을 가져옵니다.
	 *
	 * @param userId 유저의 아이디
	 * @return 사용 기한이 가장 임박한 연장권을 반환합니다.
	 */
	public LentExtension findActiveLentExtension(Long userId) {

		List<LentExtension> activeLentExtensions =
				lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId);
		return LentExtensions.builder()
				.lentExtensions(activeLentExtensions)
				.build()
				.filterActiveLentExtensions()
				.sortLentExtensions()
				.getOne();
	}

	/**
	 * 유저의 사용 가능한 연장권을 모두 가져옵니다.
	 *
	 * @param userId 유저의 아이디
	 * @return 사용 가능한 연장권을 모두 반환합니다.
	 */
	public List<LentExtension> findActiveLentExtensions(Long userId) {
		List<LentExtension> activeLentExtensions =
				lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId);
		return LentExtensions.builder()
				.lentExtensions(activeLentExtensions)
				.build()
				.sortLentExtensions()
				.get();
	}
}
