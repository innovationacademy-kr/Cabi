FROM openjdk:17-jdk-slim

WORKDIR /app

RUN apt-get update
RUN apt-get -y install cron

ADD build/cron-1.0-SNAPSHOT.jar cron.jar

CMD tail -f /var/log/cron.log
