package org.ftclub.cabinet.user.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.LentExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class LentExtensionOptionalFetcher {

	private final LentExtensionRepository lentExtensionRepository;

	/*-------------------------------------------FIND-------------------------------------------*/
	@Transactional(readOnly = true)
	public Page<LentExtension> findAllPaged(PageRequest pageable) {
		return lentExtensionRepository.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public Page<LentExtension> findAllNotExpiredPaged(PageRequest pageable) {
		return lentExtensionRepository.findAllNotExpired(pageable);
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findAllNotExpired() {
		return lentExtensionRepository.findAll();
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findAllByUserId(Long userId) {
		return lentExtensionRepository.findAllByUserId(userId);
	}

	@Transactional(readOnly = true)
	public List<LentExtension> findAllByUserIdUsedAtIsNull(Long userId) {
		return lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId);
	}
}
