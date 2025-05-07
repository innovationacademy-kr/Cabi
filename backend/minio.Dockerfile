# minio.Dockerfile

FROM minio/minio:latest

COPY ./minio/entrypoint-wrapper.sh /usr/local/bin/entrypoint-wrapper.sh
COPY ./minio/init.sh /app/scripts/init.sh

RUN     chmod +x /usr/local/bin/entrypoint-wrapper.sh
RUN     chmod +x /app/scripts/init.sh

ENTRYPOINT ["/usr/local/bin/entrypoint-wrapper.sh"]

CMD ["server", "/data", "--console-address", ":9001"]