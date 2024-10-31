import { EpicFreeGames } from "./epic-free-games"

async function getGames() {
    try {
        const result = await EpicFreeGames();
        console.log("Game list Updated ✔", result);
        return result;
    } catch (error) {
        console.error("Error saat mengambil game:", error);
        throw error;
    }
}

export {
    getGames
}