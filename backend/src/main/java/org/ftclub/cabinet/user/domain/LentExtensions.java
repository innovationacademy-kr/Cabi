package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

@ToString
@Log4j2
@AllArgsConstructor
@Builder
public class LentExtensions {

	private final List<LentExtension> lentExtensions;

	public boolean isEmpty() {
		return lentExtensions == null || lentExtensions.isEmpty();
	}

	public LentExtensions sortLentExtensions() {
		lentExtensions.sort(Comparator.comparing(LentExtension::getExpiredAt));
		return this;
	}

	public LentExtensions filterActiveLentExtensions() {
		LocalDateTime currentTime = LocalDateTime.now();

		lentExtensions.removeIf(lentExtension ->
				lentExtension.getUsedAt() != null ||
						lentExtension.isExpiredBefore(currentTime)
		);
		return this;
	}

	public boolean hasActiveLentExtension() {
		return !this.isEmpty()
				&& lentExtensions.parallelStream()
				.anyMatch(e -> !e.isExpiredBefore(LocalDateTime.now()) && !e.isUsed());
	}

	public List<LentExtension> get() {
		return lentExtensions;
	}

	public LentExtension getOne() {
		if (lentExtensions == null || lentExtensions.isEmpty() || lentExtensions.get(0) == null) {
			return null;
		}
		return lentExtensions.get(0);
	}
}
