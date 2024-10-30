import playwright from "playwright";
const url = "https://store.epicgames.com/en-US/free-games";

function removeTags(str: string) {
  if (str === null || str === "") return false;
  else str = str.toString();

  return str.replace(/(<([^>]+)>)/gi, "");
}

export async function EpicFreeGames() {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(url);

  await page.waitForTimeout(5000);

  // Mengambil semua elemen game gratis
  const freeGamesContainers = await page.$$(".css-1myhtyb .css-2mlzob");

  try {
    if (freeGamesContainers.length === 0) {
      console.log("Tidak ada game gratis yang ditemukan");
      await browser.close();
      return [];
    }

    const data = await Promise.all(freeGamesContainers.map(async (container) => {
      const name = await container.$eval("h6.eds_1ypbntd0.eds_1ypbntd7.eds_1ypbntdq", node => node.textContent);
      const cover = await container.$eval("img.css-1dsjpsr", node => (node as HTMLImageElement).src);
      const url = await container.$eval("a.css-g3jcms", node => (node as HTMLAnchorElement).href);
      const status = await container.$eval(".css-1magkk1 .css-1avc5a3 span", node => node.textContent);
      const dateHtml = await container.$eval('p.eds_1ypbntd0.eds_1ypbntd9.eds_1ypbntdl span', node => node.innerHTML);
      const date = removeTags(dateHtml);

      return {
        name,
        status,
        date,
        game_url: url,
        cover_url: cover,
      };
    }));
    await browser.close();
    return data;
  } catch (err) {
    console.error("Error:", err);
    await browser.close();
    throw err;
  }
}
