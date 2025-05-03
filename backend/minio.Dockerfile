# minio.Dockerfile

FROM minio/minio:latest

#RUN yum update -y && \
#    yum install -y curl && \
#    # yum 캐시 정리 (이미지 용량 감소)
#    yum clean all && \
#    rm -rf /var/cache/yum

COPY ./minio/entrypoint-wrapper.sh /usr/local/bin/entrypoint-wrapper.sh
COPY ./minio/init.sh /app/scripts/init.sh

RUN     chmod +x /usr/local/bin/entrypoint-wrapper.sh
RUN     chmod +x /app/scripts/init.sh

ENTRYPOINT ["/usr/local/bin/entrypoint-wrapper.sh"]

CMD ["server", "/data", "--console-address", ":9001"]