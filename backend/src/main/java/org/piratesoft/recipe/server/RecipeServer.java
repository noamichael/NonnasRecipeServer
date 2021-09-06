package org.piratesoft.recipe.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.piratesoft.recipe.server.sql.MySqlInstance;

import spark.Service;
import static spark.Service.ignite;

/**
 *
 * @author kucin
 */
public class RecipeServer {

    final int PORT = 6789;

    private Thread waitForInput;

    public static void main(String[] args) {
        RecipeServer server = new RecipeServer();
        server.startServer(args);
    }

    public void startServer(String... args) {
        Service publicService = ignite().port(PORT);

        System.out.println(String.format("Starting server with port: %s}", PORT));
        AuthEndpoint.setupEndpoints(publicService);
        RecipeEndpoint.setupEndpoints(publicService);

        // Clean up MySQL instance after each request
        publicService.after((req, res) -> {
            MySqlInstance.destroy();
        });

        // Clean up the instance on exception as well
        publicService.exception(Exception.class, (ex, req, res) -> {
            System.out.println("Exception encounter. Cleaning up sql connection");
            MySqlInstance.destroy();
            res.status(500);
            res.type("text/plain");
            res.body("Internal Server Error");
        });

        doWaitForInput(publicService);
    }

    private void stopServer(Service service) {
        System.out.println("Stopping the server...");
        service.stop();
    }

    public void doWaitForInput(Service publicService) {
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
            this.stopServer(publicService);
        });
        this.waitForInput.start();
    }

    public boolean isStopCommand(String s) {
        s = s.trim().toLowerCase();
        return s.equals("stop") || s.endsWith("quit") || s.equals("exit");
    }

}
