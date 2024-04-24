package org.ftclub.cabinet.item.domain;

import lombok.Getter;

@Getter
public enum ItemType {

	EXTENSION,
	PENALTY,
	SWAP,
	ALARM,
	;

	public boolean isValid() {
		return this.equals(EXTENSION) || this.equals(PENALTY) || this.equals(SWAP)
				|| this.equals(ALARM);
	}
}
