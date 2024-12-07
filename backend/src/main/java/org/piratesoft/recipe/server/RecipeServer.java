package org.piratesoft.recipe.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.piratesoft.recipe.server.sql.MySqlInstance;

import io.javalin.Javalin;

/**
 *
 * @author kucin
 */
public class RecipeServer {

    final int PORT = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));

    private Thread waitForInput;

    public static void main(String[] args) {
        RecipeServer server = new RecipeServer();
        server.startServer(args);
    }

    public void startServer(String... args) {
        Javalin publicService = Javalin.create(c -> {
            c.router.ignoreTrailingSlashes = true;
            c.jetty.defaultHost = "0.0.0.0";
        });

        AuthEndpoint.setupEndpoints(publicService);
        RecipeEndpoint.setupEndpoints(publicService);

        // Clean up MySQL instance after each request
        publicService.after((ctx) -> {
            MySqlInstance.destroy();
        });

        // Clean up the instance on exception as well
        publicService.exception(Exception.class, (ex, ctx) -> {
            System.out.println("Exception encounter. Cleaning up sql connection");
            MySqlInstance.destroy();
            ctx.status(500);
            ctx.contentType("text/plain");
            ctx.result("Internal Server Error");
            ex.printStackTrace();
        });

        System.out.println(String.format("Starting server with port: %s", PORT));

        publicService.start(PORT);

        doWaitForInput(publicService);
    }

    public void doWaitForInput(Javalin publicService) {
        this.waitForInput = new Thread(() -> {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String input;
            do {
                try {
                    // wait until we have data to complete a readLine()
                    while (!br.ready() /* ADD SHUTDOWN CHECK HERE */) {
                        Thread.sleep(200);
                    }
                    input = br.readLine();
                } catch (IOException | InterruptedException e) {
                    break;
                }
            } while (!isStopCommand(input) && !Thread.interrupted());

            System.out.println("Stopping the server...");
            publicService.stop();
        });
        this.waitForInput.start();
    }

    public boolean isStopCommand(String s) {
        s = s.trim().toLowerCase();
        return s.equals("stop") || s.endsWith("quit") || s.equals("exit");
    }

}
