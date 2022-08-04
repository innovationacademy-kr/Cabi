FROM	mariadb:10.7

RUN		apt-get update -y; \
		apt-get upgrade -y; \
		apt-get -y install nodejs \
		npm \
		systemd \
		vim;

WORKDIR /

RUN		mkdir -p /initial-setting/config

COPY	./initial-setting/* /initial-setting/
COPY	./initial-setting/config/* /initial-setting/config
COPY	./package.json /
COPY	./.env /

RUN		chmod 777 /initial-setting/init.sh

RUN		npm i

# CMD	[ "/initial-setting/init.sh" ]
