package org.ftclub.cabinet.user.newService;

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
    public LentExtension findActiveLentExtension(Long userId) {

        return LentExtensions.builder()
                .lentExtensions(lentExtensionRepository.findAll(userId))
                .build()
                .findImminentActiveLentExtension()
                .orElse(null);
    }

	public LentExtensions findActiveLentExtensions(Long userId) {
		return LentExtensions.builder()
				.lentExtensions(lentExtensionRepository.findAllByUserIdAndUsedAtIsNull(userId))
				.build();
	}

	public List<LentExtension> findLentExtensionsInLatestOrder(Long userId) {
		return lentExtensionRepository.findAll(userId)
				.stream()
				.sorted(Comparator.comparing(LentExtension::getExpiredAt,
						Comparator.reverseOrder()))
				.collect(Collectors.toList());
	}
}
