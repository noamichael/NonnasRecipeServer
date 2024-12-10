ARG RUNTIME_IMAGE_TAG=21.0.5_11-jre-alpine

# Build Image
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /tmp/build

COPY  . .

RUN mvn package

# CDS Layer
FROM eclipse-temurin:${RUNTIME_IMAGE_TAG} AS cds

WORKDIR /tmp/build

COPY --from=builder /tmp/build/target/NonnasRecipeServer-1.0-SNAPSHOT-jar-with-dependencies.jar ./NonnasRecipeServer.jar

# Run the application to get the used class list
RUN APP_CDS=true java -XX:DumpLoadedClassList=classes.lst -jar ./NonnasRecipeServer.jar

# Build the AppCDS archive file
RUN java -Xshare:dump -XX:SharedClassListFile=classes.lst -XX:SharedArchiveFile=appcds.jsa --class-path ./NonnasRecipeServer.jar

# Release Image
FROM eclipse-temurin:${RUNTIME_IMAGE_TAG} AS release

USER root

ENV JAVA_TOOL_OPTIONS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"

WORKDIR /opt/app

COPY --from=builder /tmp/build/target/NonnasRecipeServer-1.0-SNAPSHOT-jar-with-dependencies.jar ./NonnasRecipeServer.jar
COPY --from=cds /tmp/build/appcds.jsa ./appcds.jsa

EXPOSE 8080

USER 1001

ENTRYPOINT ["java", "-Xshare:on", "-XX:SharedArchiveFile=appcds.jsa", "-jar", "NonnasRecipeServer.jar"]