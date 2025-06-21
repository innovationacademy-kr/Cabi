package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Table(name = "PRESENTATION_COMMENT")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PresentationComment {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	@Id
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRESENTATION_ID", nullable = false)
	private Presentation presentation;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	@CreatedDate
	@Column(name = "CREATED_AT", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "UPDATED_AT", nullable = false)
	private LocalDateTime updatedAt;

	@Column(name = "DETAIL", length = 500, nullable = false)
	private String detail;

	@Column(name = "DELETED", nullable = false)
	private boolean deleted = false;

	@Column(name = "BANNED", nullable = false)
	private boolean banned = false;

	public PresentationComment(Presentation presentation, User user, String detail) {
		this.presentation = presentation;
		this.user = user;
		this.detail = detail;
	}

	public void updateDetail(String detail) {
		this.detail = detail;
	}

	public void delete() {
		this.deleted = true;
	}
}
