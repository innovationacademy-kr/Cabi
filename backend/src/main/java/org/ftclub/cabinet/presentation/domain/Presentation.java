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
	@Column(name = "CATEGORY", nullable = false)
	private Category category;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "DURATION", nullable = false)
	private Duration duration;

	@Column(name = "TITLE", length = 50, nullable = false)
	private String title;

	@Column(name = "SUMMARY", length = 100, nullable = false)
	private String summary;

	// TODO: 추가된 column으로 dev to main 시, main-db의 data 넣어야 함
	@Column(name = "OUTLINE", length = 500, nullable = false)
	private String outline;

	@Lob
	@Column(name = "DETAIL", length = 10000, nullable = false)
	private String detail;

	@Column(name = "CANCELED", nullable = false)
	private boolean canceled = false;

	@Column(name = "THUMBNAIL_S3_KEY", length = 2048)
	private String thumbnailS3Key;

	@Column(name = "VIDEO_LINK", length = 2048)
	private String videoLink;

	@Column(name = "RECORDING_ALLOWED", nullable = false)
	private boolean recordingAllowed = false;

	@Column(name = "PUBLIC_ALLOWED", nullable = false)
	private boolean publicAllowed = false;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PRESENTATION_SLOT_ID")
	private PresentationSlot slot;

	@Column(name = "START_TIME", nullable = false)
	private LocalDateTime startTime;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "PRESENTATION_LOCATION", nullable = false)
	private PresentationLocation presentationLocation;


	@OneToMany(mappedBy = "presentation")
	private final List<PresentationComment> presentationComments = new ArrayList<>();

	@OneToMany(mappedBy = "presentation")
	private final List<PresentationLike> presentationLikes = new ArrayList<>();

	public static Presentation of(User user, Category category, Duration duration,
			String title, String summary, String outline, String detail,
			String thumbnailS3Key, boolean recodingAllowed, boolean publicAllowed,
			PresentationSlot slot) {
		return new Presentation(user, category, duration, title, summary, outline,
				detail, thumbnailS3Key, null, recodingAllowed, publicAllowed,
				slot, slot.getStartTime(), slot.getPresentationLocation());
	}

	protected Presentation(User user, Category category, Duration duration,
			String title, String summary, String outline, String detail,
			String thumbnailS3Key, String videoLink,
			boolean recordingAllowed, boolean publicAllowed,
			PresentationSlot slot,
			LocalDateTime startTime, PresentationLocation presentationLocation) {
		this.user = user;
		this.category = category;
		this.duration = duration;
		this.title = title;
		this.summary = summary;
		this.outline = outline;
		this.detail = detail;
		this.thumbnailS3Key = thumbnailS3Key;
		this.videoLink = videoLink;
		this.recordingAllowed = recordingAllowed;
		this.publicAllowed = publicAllowed;
		this.slot = slot;
		this.startTime = startTime;
		this.presentationLocation = presentationLocation;
	}

	/**
	 * 프레젠테이션을 취소합니다.
	 */
	public void cancelPresentation() {
		this.canceled = true;
		this.slot = null;
	}
}
