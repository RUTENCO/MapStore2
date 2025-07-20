# ─────────────────────────────────────────────────
# 1) Stage “mother”: descarga el WAR oficial de MapStore
# ─────────────────────────────────────────────────
FROM tomcat:9-jdk11 AS mother

LABEL maintainer="Alessandro Parma <alessandro.parma@geosolutionsgroup.com>"

# Argumento para cambiar la fuente del WAR
ARG MAPSTORE_WEBAPP_SRC="https://github.com/geosolutions-it/MapStore2/releases/latest/download/mapstore.war"

# Descarga el WAR y copia scripts Docker
ADD "${MAPSTORE_WEBAPP_SRC}" /mapstore/mapstore.war
COPY ./docker /mapstore/docker

WORKDIR /mapstore

# ─────────────────────────────────────────────────
# 2) Stage final: Tomcat + Node.js para tu server.js
# ─────────────────────────────────────────────────
FROM tomcat:9-jdk11

# 2.1) Variables de entorno para Tomcat
ENV CATALINA_BASE="$CATALINA_HOME" \
    MAPSTORE_WEBAPP_DST="${CATALINA_BASE}/webapps" \
    INITIAL_MEMORY="512m" \
    MAXIMUM_MEMORY="512m" \
    DATA_DIR="${CATALINA_BASE}/datadir" \
    TERM=xterm

ARG OVR=""
ENV JAVA_OPTS="-Xms${INITIAL_MEMORY} -Xmx${MAXIMUM_MEMORY} -Ddatadir.location=${DATA_DIR}"

# 2.2) Copia el WAR y los scripts de espera
COPY --from=mother /mapstore/mapstore.war "${MAPSTORE_WEBAPP_DST}/mapstore.war"
COPY --from=mother /mapstore/docker "${CATALINA_BASE}/docker"

# 2.3) Ajusta el server.xml para escuchar en 8080
COPY binary/tomcat/conf/server.xml "${CATALINA_BASE}/conf/"
RUN sed -i 's/8082/8080/g' "${CATALINA_BASE}/conf/server.xml"

# 2.4) Prepara el directorio de datos y herramientas
RUN mkdir -p "${DATA_DIR}" \
 && cp "${CATALINA_BASE}/docker/wait-for-postgres.sh" /usr/bin/wait-for-postgres

# 2.5) Instala el cliente de Postgres y limpia cache en una sola capa
RUN apt-get update \
 && apt-get install --yes postgresql-client \
 && apt-get clean autoclean autoremove --yes \
 && rm -rf /var/lib/apt/lists/* /var/cache/apt/* /usr/share/{man,doc}/*

# 2.6) Instala Node.js y npm (para tu server.js)
RUN apt-get update \
 && apt-get install --yes nodejs npm \
 && rm -rf /var/lib/apt/lists/*

# 2.7) Copia y prepara tu servidor de notificaciones
WORKDIR /mapstore
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY build/server.js ./

# 2.8) Define volúmenes y puertos
VOLUME ["${DATA_DIR}"]
EXPOSE 8080 3001

# 2.9) Arranque conjunto de Tomcat y Node.js
CMD ["sh", "-c", "catalina.sh run & node server.js"]
