import app from "./app";
import { waitForDb } from "./config/db";

const PORT = Number(process.env.PORT ?? 3000);

async function main() {
    await waitForDb();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

main().catch(console.error);