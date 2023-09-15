package org.ftclub.cabinet.lent_extension.domain;

/**
 * 연장권 종류
 */
public enum LentExtensionType {
	ALL, PRIVATE_ONLY, SHARE_ONLY;

	public boolean isValid() {
		return this.equals(ALL) || this.equals(PRIVATE_ONLY) || this.equals(SHARE_ONLY);
	}
}
