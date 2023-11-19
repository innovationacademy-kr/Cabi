FROM amazoncorretto:11

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY build/cabinet-0.0.1-SNAPSHOT.jar cabi.jar

CMD java -jar -Dspring.profiles.active=dev ${JAVA_OPTS} cabi.jar --spring.config.location=file:/resources/application-dev.yml
