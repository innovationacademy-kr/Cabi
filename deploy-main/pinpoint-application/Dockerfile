FROM amazoncorretto:11

ENV TZ=Asia/Seoul

COPY backend/build/libs/cabinet-0.0.1-SNAPSHOT.jar cabi.jar

CMD java -jar -Dspring.profiles.active=prod ${JAVA_OPTS} cabi.jar --spring.config.location=file:/resources/application-prod.yml
