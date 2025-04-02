import tokenService from "@/utils/persistence/token_storage";
import { Expert } from "@/models/expert";

class ApiService {
  private token: string | null = null;

  // Toggle this flag to switch between local and production
  private USE_LOCAL: boolean = true;

  private backendUrl: string = this.USE_LOCAL
    ? "http://localhost:8080"
    : "https://backend.pronexus.ai";

  private pythonUrl: string = this.USE_LOCAL
    ? "http://127.0.0.1:5000"
    : "https://marvelous-love-production.up.railway.app";

  public getBackendUrl(): string {
    return this.backendUrl;
  }

  constructor() {
    this.initToken(); // Initialize token on construction
  }

  public clearToken(): void {
    this.token = null;
  }

  private async initToken(): Promise<void> {
    try {
      const storedToken = tokenService.getToken();
      this.token = storedToken;
      if (!this.token) {
        console.error("No token found in storage");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      this.token = null;
    }
  }

  private async ensureToken(): Promise<void> {
    if (!this.token) {
      await this.initToken();

      // After init, check if we have a token
      if (!this.token) {
        throw new Error("No authentication token available");
      }
    }
  }

  public async generalPurposeRequest(
    action: string,
    endpoint: string,
    data: any = null
  ): Promise<Response | null> {
    let domain = this.backendUrl;

    // Ensure the provided action is valid
    const validActions = ["make", "update", "delete", "get"];
    if (!validActions.includes(action.toLowerCase())) {
      console.error(`Invalid HTTP method: ${action}`);
      return null;
    }

    const url = `${domain}/${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (
      endpoint !== "login" &&
      endpoint !== "register" &&
      !endpoint.startsWith("profile-questions")
    ) {
      await this.ensureToken();
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      let response: Response;

      switch (action.toLowerCase()) {
        case "make":
          response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
          });
          break;
        case "update":
          response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
          });
          break;
        case "delete":
          response = await fetch(url, {
            method: "DELETE",
            headers,
            body: JSON.stringify(data),
          });
          break;
        case "get":
          response = await fetch(url, {
            method: "GET",
            headers,
          });
          break;

        default:
          throw new Error(`Unsupported HTTP method: ${action}`);
      }

      if (response.ok) {
        return response;
      } else {
        console.error(`Error: ${response.status}`);
        console.error(response);
        return response;
      }
    } catch (error: any) {
      console.error("Error during request:", error.message);
      return null;
    }
  }

  public async generalPurposePythonRequest({
    toAddress = null,
    projectId = null,
    userEmail = null,
    content = null,
    expert = null,
    expertId = null,
    newAvailabilities = null,
    newScreeningQuestions = null,
    timezone = null,
    network = null,
    linkedInLink = null,
    expertIds = null,
    endpoint,
    profileTypeId,
    feature,
    type,
    comment,
    multipleExperts = false,
  }: GeneralPurposePythonRequestOptions): Promise<any | null> {
    const url = `${this.pythonUrl}/${endpoint}`;
    const body = JSON.stringify({
      toAddress,
      userEmail,
      linkedInLink,
      projectId,
      content,
      expert,
      expertId,
      newAvailabilities,
      newScreeningQuestions,
      timezone,
      network,
      expertIds,
      profileTypeId,
      feature,
      type,
      comment,
      multipleExperts,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (response.status === 200) {
        return response;
      } else if (response.status === 404) {
        const errorData = await response.json();
        console.error(`Expert failed to add: ${errorData.message}`);
        return null;
      } else {
        console.error(`Request failed with status: ${response.status}`);
        return null;
      }
    } catch (e) {
      console.error(`Error making request: ${e}`);
      return null;
    }
  }
}

const apiService = new ApiService();
export default apiService;

interface GeneralPurposePythonRequestOptions {
  toAddress?: string;
  projectId?: string;
  userEmail?: string;
  content?: string;
  expert?: Expert;
  expertId?: string;
  newAvailabilities?: boolean;
  newScreeningQuestions?: boolean;
  timezone?: string;
  network?: string;
  linkedInLink?: string;
  endpoint: string; // required
  expertIds?: string[];
  profileTypeId?: string;
  feature?: string;
  type?: string;
  comment?: string;
  multipleExperts?: boolean;
}
