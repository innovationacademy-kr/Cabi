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
	public Page<LentExtension> findAllLentExtension(PageRequest pageable) {
		return new PageImpl<>(lentExtensionRepository.findAll(pageable)
				.stream().filter(e -> !e.isDeleted()).collect(Collectors.toList()));
	}

	@Transactional(readOnly = true)
	public Page<LentExtension> findAllNotExpired(PageRequest pageable) {
		return lentExtensionRepository.findAllNotExpired(pageable);
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findAllNotExpired() {
		return lentExtensionRepository.findAll()
				.stream().filter(e -> !e.isUsed())
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findLentExtensionByUserId(Long userId) {
		return lentExtensionRepository.findAllByUserId(userId)
				.stream().filter(e -> !e.isDeleted()).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findActiveLentExtensionsByUserId(Long userId) {
		return lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId)
				.stream().filter(e -> !e.isDeleted()).collect(Collectors.toList());
	}
}
