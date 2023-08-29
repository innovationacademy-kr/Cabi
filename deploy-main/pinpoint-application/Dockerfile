FROM amazoncorretto:11

COPY build/cabinet-0.0.1-SNAPSHOT.jar cabi.jar

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY build/cabinet-0.0.1-SNAPSHOT.jar cabi.jar

CMD java -jar -Dspring.profiles.active=prod ${JAVA_OPTS} cabi.jar
