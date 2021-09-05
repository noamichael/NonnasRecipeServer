# Build Image
FROM maven:3.6-jdk-11-slim as builder

WORKDIR /tmp/build

COPY  . .

RUN mvn package

# Release Image
FROM openjdk:18-ea-11-alpine3.13 as release

USER 1001

WORKDIR /opt/app

COPY --from=builder /tmp/build/target/NonnasRecipeServer-1.0-SNAPSHOT-jar-with-dependencies.jar ./NonnasRecipeServer.jar

EXPOSE 6789 7890

ENTRYPOINT ["java", "-jar", "NonnasRecipeServer.jar" ]
