class TokenService {
    private token: string | null = null;
  
    /**
     * Save the token in memory and local storage for persistence across browser sessions.
     * @param newToken - The token to save.
     */
    saveToken(newToken: string): void {
      this.token = newToken; // Changes token in memory
      localStorage.setItem('access_token', newToken); // Persists token in local storage
    }
  
    /**
     * Get the token from memory or local storage.
     * @returns The token string or null if not found.
     */
    getToken(): string | null {
      if (this.token) return this.token; // Returns token from memory
      return localStorage.getItem('access_token'); // Returns token from local storage
    }
  
    /**
     * Clear the token from memory and local storage.
     */
    clearToken(): void {
      this.token = null; // Changes token in memory to null
      localStorage.removeItem('access_token'); // Removes token from local storage
    }
  }
  
  // Create an instance of TokenService to use
  const tokenService = new TokenService();
  export default tokenService;