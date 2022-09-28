FROM		debian:buster

RUN			apt-get update -y; \
			apt-get upgrade -y; \
			apt-get install -y \
			mariadb-server \
			vim

WORKDIR		/

RUN			mkdir -p /var/run/mysqld && \
			chown -R mysql:mysql /var/run/mysqld && \
			chmod 777 /var/run/mysqld

RUN			mkdir -p /database
RUN			mkdir -p /database/credentials

COPY		./database/ /database/

RUN			chmod 777 /database/init.sh

ENTRYPOINT	["bash", "/database/init.sh"]

# Command to launch mariadb and enable the database to listen globally

CMD ["mysqld", "--bind-address=0.0.0.0"]
