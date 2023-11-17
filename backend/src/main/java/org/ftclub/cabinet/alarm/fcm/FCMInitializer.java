package org.ftclub.cabinet.alarm.fcm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FCMInitializer {

	@Value("${firebase.messaging.credentials.path}")
	private String credentialsPath;
	private final ResourceLoader resourceLoader;

	@PostConstruct
	public void initialize() throws IOException {
		Path currentPath = Paths.get("").toAbsolutePath().normalize();
		Resource resource = resourceLoader.getResource("file:" + currentPath + credentialsPath);
		try (InputStream inputStream = resource.getInputStream()) {
			FirebaseOptions options = FirebaseOptions.builder()
					.setCredentials(GoogleCredentials.fromStream(inputStream))
					.build();
			if (FirebaseApp.getApps().isEmpty()) {
				FirebaseApp.initializeApp(options);
				log.info("Firebase application has been initialized");
			}
		}
	}
}
