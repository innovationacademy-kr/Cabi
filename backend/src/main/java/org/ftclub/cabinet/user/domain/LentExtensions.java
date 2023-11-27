package org.ftclub.cabinet.user.domain;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

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
						lentExtension.getExpiredAt().isBefore(currentTime)
		);
	}

	private void sortImminentASC() {
		lentExtensions.sort(Comparator.comparing(LentExtension::getExpiredAt));
	}

	public boolean hasActiveLentExtensions() {
		return lentExtensions != null && !lentExtensions.isEmpty();
	}

	public LentExtension getImminentActiveLentExtension() {
		filterActiveLentExtensions();
		sortImminentASC();
		return lentExtensions.get(0);
	}

	public List<LentExtension> getActiveLentExtensions() {
		filterActiveLentExtensions();
		return lentExtensions;
	}


}
