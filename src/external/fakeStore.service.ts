import axios from "axios";

export class FakeStoreService {

  private baseUrl = "https://fakestoreapi.com";

  async getProduct(id: number) {

    const response = await axios.get(
      `${this.baseUrl}/products/${id}`
    );

    return response.data;
  }

}