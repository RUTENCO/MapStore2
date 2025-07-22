# Dockerfile.frontend
FROM tomcat:9-jdk11

# 1) Copiamos sólo lo que está compilado en la carpeta de web/client
COPY web/client /usr/local/tomcat/webapps/ROOT/


EXPOSE 8080
CMD ["catalina.sh", "run"]
