package org.ftclub.cabinet.user.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Getter
@ToString
@Log4j2
@AllArgsConstructor
@Builder
public class LentExtensions {

	private final List<LentExtension> lentExtensions;

	private void filterActiveLentExtensions() {
		LocalDateTime currentTime = LocalDateTime.now();

		lentExtensions.removeIf(lentExtension ->
				lentExtension.getUsedAt() != null ||
						lentExtension.isExpiredBefore(currentTime)
		);
	}

	private void sortImminentASC() {
		lentExtensions.sort(Comparator.comparing(LentExtension::getExpiredAt));
	}

	public boolean isEmpty() {
		return lentExtensions == null || lentExtensions.isEmpty();
	}

	public Optional<LentExtension> findImminentActiveLentExtension() {
		filterActiveLentExtensions();
		sortImminentASC();
		return Optional.ofNullable(!lentExtensions.isEmpty() ?
				lentExtensions.get(0) : null);
	}

	public List<LentExtension> getActiveLentExtensions() {
		filterActiveLentExtensions();
		return lentExtensions;
	}

	public boolean hasActiveLentExtension() {
		return !this.isEmpty()
				&& lentExtensions.parallelStream()
				.anyMatch(e -> !e.isExpiredBefore(LocalDateTime.now()) && !e.isUsed());
	}
}
