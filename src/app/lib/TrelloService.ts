// === TrelloService.ts ===
const urls = {
    trelloBaseUrl: 'https://api.trello.com/1/cards',
    trelloKey: '99218ddd4ee132e30e8b3c498a6a0bdc',
    trelloToken: 'ATTAd3fd24f2e2771705c99ca9beba78938d821d0aa8b05f4be639e3ce7f16a00072092CA084',
};
//  https://api.trello.com/1/boards/rxZMMaFL/lists?key=99218ddd4ee132e30e8b3c498a6a0bdc&token=ATTAd3fd24f2e2771705c99ca9beba78938d821d0aa8b05f4be639e3ce7f16a00072092CA084

export default class TrelloService {
  private baseUrl: string;
  private key: string;
  private token: string;

  constructor() {
    this.baseUrl = urls.trelloBaseUrl;
    this.key = urls.trelloKey;
    this.token = urls.trelloToken;
  }

  public async addCard(listId: string, name: string, desc: string) {
    const url = `${this.baseUrl}?key=${this.key}&token=${this.token}&idList=${listId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        desc,
      }),
    });

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status}`);
    }

    return response.json();
  }
}
