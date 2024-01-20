package org.ftclub.cabinet.user.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.ftclub.cabinet.user.domain.LentExtensions;
import org.ftclub.cabinet.user.repository.LentExtensionRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentExtensionQueryService {

	private final LentExtensionRepository lentExtensionRepository;

	/**
	 * 유저의 사용 가능한 연장권 중 사용 기한이 가장 임박한 연장권을 가져옵니다.
	 *
	 * @param userId
	 * @return 사용 기한이 가장 임박한 연장권을 반환합니다.
	 */
	public LentExtension findActiveLentExtension(Long userId) {

		List<LentExtension> lentExtensions = lentExtensionRepository.findAllByUserId(userId);
		return LentExtensions.builder()
				.lentExtensions(lentExtensions)
				.build()
				.findImminentActiveLentExtension()
				.orElse(null);
	}

	/**
	 * 유저의 사용 가능한 연장권을 모두 가져옵니다.
	 *
	 * @param userId
	 * @return 사용 가능한 연장권을 모두 반환합니다.
	 */
	public LentExtensions findActiveLentExtensions(Long userId) {
		return LentExtensions.builder()
				.lentExtensions(lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId))
				.build();
	}

	/**
	 * 유저의 모든 연장권을 사용 기한 기준 최신 순서로 가져옵니다.
	 *
	 * @param userId
	 * @return 사용 기한을 기준으로 최신 순서로 정렬된 모든 연장권을 반환합니다.
	 */
	public List<LentExtension> findLentExtensionsInLatestOrder(Long userId) {
		return lentExtensionRepository.findAllByUserId(userId)
				.stream()
				.sorted(Comparator.comparing(LentExtension::getExpiredAt,
						Comparator.reverseOrder()))
				.collect(Collectors.toList());
	}
}
