# Build Image
FROM maven:3.6-jdk-11-slim as builder

WORKDIR /tmp/build

COPY  . .

RUN mvn package

# Release Image
FROM openjdk:11.0.12-slim as release

ENV GOOGLE_APPLICATION_CREDENTIALS="/opt/app/secrets/database-sa.json"

USER root

WORKDIR /opt/app

COPY ./secrets/database-sa.json ./secrets/database-sa.json

COPY --from=builder /tmp/build/target/NonnasRecipeServer-1.0-SNAPSHOT-jar-with-dependencies.jar ./NonnasRecipeServer.jar

EXPOSE 6789

USER 1001

ENTRYPOINT ["java", "-jar", "NonnasRecipeServer.jar"]