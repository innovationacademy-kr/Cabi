package org.ftclub.cabinet.user.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionOptionalFetcher {

	private final LentExtensionRepository lentExtensionRepository;

	/*-------------------------------------------FIND-------------------------------------------*/
	@Transactional(readOnly = true)
	public Page<LentExtension> findAllNotDeleted(PageRequest pageable) {
		return new PageImpl<>(lentExtensionRepository.findAll(pageable)
				.stream().filter(e -> !e.isDeleted()).collect(Collectors.toList()));
	}

	@Transactional(readOnly = true)
	public Page<LentExtension> findAllNotExpiredAndNotDeleted(PageRequest pageable) {
		return lentExtensionRepository.findAllNotExpired(pageable)
				.stream().filter(e -> !e.isUsed() && !e.isDeleted())
				.collect(Collectors.collectingAndThen(Collectors.toList(), PageImpl::new));
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findAllNotExpiredAndNotDeleted() {
		return lentExtensionRepository.findAll()
				.stream().filter(e -> !e.isUsed() && !e.isDeleted())
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findNotDeletedByUserId(Long userId) {
		return lentExtensionRepository.findAllByUserId(userId)
				.stream().filter(e -> !e.isDeleted()).collect(Collectors.toList());
	}

	// Active라는 표현 자체가 비즈니스적 의미를 담고 있으므로 변경해야할 필요가 있음.
	// 추후 리팩터링 필요.
	@Transactional(readOnly = true)
	public List<LentExtension> findActiveByUserId(Long userId) {
		return lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId)
				.stream().filter(e -> !e.isDeleted()).collect(Collectors.toList());
	}
}
