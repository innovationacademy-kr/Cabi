package org.ftclub.cabinet.presentation.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ftclub.cabinet.user.domain.User;

@Entity
@Getter
@Table(name = "PRESENTATION")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Presentation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_TIME")
	private Duration duration;

	@Column(name = "TITLE", length = 50)
	private String title;

	@Column(name = "SUMMARY", length = 100)
	private String summary;

	@Column(name = "OUTLINE", length = 500)
	private String outline;

	@Lob
	@Column(name = "DETAIL", length = 10000)
	private String detail;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "CATEGORY")
	private Category category;

	@Column(name = "START_TIME", nullable = false)
	private LocalDateTime startTime;

	@Enumerated(value = EnumType.STRING)
	private PresentationLocation presentationLocation;

	@Column(name = "CANCELED", nullable = false)
	private boolean canceled = false;

	@Column(name = "THUMBNAIL_LINK", length = 2048)
	private String thumbnailLink;

	@Column(name = "VIDEO_LINK", length = 2048)
	private String videoLink;

	@Column(name = "IS_RECODING_ALLOWED", nullable = false)
	private boolean isRecodingAllowed = false;

	@Column(name = "IS_PUBLIC_ALLOWED", nullable = false)
	private boolean isPublicAllowed = false;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRESENTATION_SLOT_ID")
	private PresentationSlot slot;

	@OneToMany(mappedBy = "presentation")
	private List<PresentationComment> presentationComments = new ArrayList<>();

	@OneToMany(mappedBy = "presentation")
	private List<PresentationLike> presentationLikes = new ArrayList<>();

	public Presentation(User user, Duration duration, String title, String summary, String outline,
			String detail, Category category, String thumbnailLink, String videoLink,
			boolean isRecodingAllowed, boolean isPublicAllowed, PresentationSlot slot) {
		this.user = user;
		this.duration = duration;
		this.title = title;
		this.summary = summary;
		this.outline = outline;
		this.detail = detail;
		this.category = category;
		this.startTime = slot.getStartTime();
		this.presentationLocation = slot.getPresentationLocation();
		this.thumbnailLink = thumbnailLink;
		this.videoLink = videoLink;
		this.isRecodingAllowed = isRecodingAllowed;
		this.isPublicAllowed = isPublicAllowed;
		this.slot = slot;
	}
}
