FROM openjdk:11-corretto

COPY build/libs/cabi-0.0.1-SNAPSHOT.jar .

CMD java -jar -Dspring.profiles.active=dev build/libs/cabi-0.0.1-SNAPSHOT.jar
