# Build Image
FROM maven:3.9.9-eclipse-temurin-21 as builder

WORKDIR /tmp/build

COPY  . .

RUN mvn package

# Release Image
FROM eclipse-temurin:21.0.5_11-jre as release

ENV GOOGLE_APPLICATION_CREDENTIALS="/opt/app/secrets/database-sa.json"

USER ***REMOVED***

WORKDIR /opt/app

#COPY ./secrets/database-sa.json ./secrets/database-sa.json

COPY --from=builder /tmp/build/target/NonnasRecipeServer-1.0-SNAPSHOT-jar-with-dependencies.jar ./NonnasRecipeServer.jar

EXPOSE 6789 8080

USER 1001

ENTRYPOINT ["java", "-jar", "NonnasRecipeServer.jar"]