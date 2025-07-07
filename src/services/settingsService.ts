// src/services/settingsService.ts

interface UpdateProfileData {
  userName?: string;
  userMail?: string;
  userPassword?: string;
  password: string; // senha atual para validação
}

interface UpdateArtistNameData {
  artistName: string;
}

interface UpdateBioData {
  bio: string;
}

interface UpdateLinkData {
  link: string;
}

interface UpdateAvatarData {
  avatarUrl: string;
}

interface SavePixData {
  pixKey: string;
}

interface DeleteAccountData {
  userPassword: string;
}

class SettingsService {
  private baseURL = "http://localhost:3000";

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    token: string,
    data?: any
  ) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return response;
  }

  // ← 1. PROFILE (userName, email, senha)
  async updateProfile(data: UpdateProfileData, token: string) {
    return this.makeRequest("/users/profile", "PATCH", token, data);
  }

  // ← 2. NOME ARTÍSTICO
  async updateArtistName(data: UpdateArtistNameData, token: string) {
    return this.makeRequest("/users/artist-name", "PATCH", token, data);
  }

  // ← 3. BIO
  async updateBio(data: UpdateBioData, token: string) {
    return this.makeRequest("/users/bio", "PATCH", token, data);
  }

  // ← 4. AVATAR
  async updateAvatar(data: UpdateAvatarData, token: string) {
    return this.makeRequest("/users/update-avatar", "PATCH", token, data);
  }

  // ← 5. INSTAGRAM (Link 1)
  async updateInstagram(data: UpdateLinkData, token: string) {
    return this.makeRequest("/users/link1", "PATCH", token, {
      userLink1: data,
    });
  }

  // ← 6. SPOTIFY (Link 2)
  async updateSpotify(data: UpdateLinkData, token: string) {
    return this.makeRequest("/users/link2", "PATCH", token, {
      userLink2: data,
    });
  }

  // ← 7. YOUTUBE (Link 3)
  async updateYoutube(data: UpdateLinkData, token: string) {
    return this.makeRequest("/users/link3", "PATCH", token, {
      userLink3: data,
    });
  }

  // ← 8. PIX
  async savePix(data: SavePixData, token: string) {
    return this.makeRequest("/pix/save-pix", "POST", token, data);
  }

  // ← 9. DELETE ACCOUNT
  async deleteAccount(data: DeleteAccountData, token: string) {
    return this.makeRequest("/users/delete", "DELETE", token, data);
  }

  // ← 10. MÉTODO PARA ATUALIZAR MÚLTIPLOS CAMPOS
  async updateMultipleFields(
    updates: {
      profile?: UpdateProfileData;
      artistName?: string;
      bio?: string;
      instagram?: string;
      spotify?: string;
      youtube?: string;
      soundCloud?: string;
      pix?: string;
    },
    token: string
  ) {
    const promises: Promise<Response>[] = [];

    // Profile (userName, email, senha)
    if (updates.profile) {
      promises.push(this.updateProfile(updates.profile, token));
    }

    // Nome artístico
    if (updates.artistName) {
      promises.push(this.updateArtistName({ artistName: updates.artistName }, token));
    }

    // Bio
    if (updates.bio) {
      promises.push(this.updateBio({ bio: updates.bio }, token));
    }

    // Instagram
    if (updates.instagram) {
      promises.push(this.updateInstagram({ link: updates.instagram }, token));
    }

    // Spotify
    if (updates.spotify) {
      promises.push(this.updateSpotify({ link: updates.spotify }, token));
    }

    // YouTube
    if (updates.youtube) {
      promises.push(this.updateYoutube({ link: updates.youtube }, token));
    }

    // PIX
    if (updates.pix) {
      promises.push(this.savePix({ pixKey: updates.pix }, token));
    }

    return Promise.all(promises);
  }
}

// ← Exportar instância única (Singleton)
export const settingsService = new SettingsService();

// ← Exportar tipos para uso em outros arquivos
export type {
  UpdateProfileData,
  UpdateArtistNameData,
  UpdateBioData,
  UpdateLinkData,
  UpdateAvatarData,
  SavePixData,
  DeleteAccountData,
};