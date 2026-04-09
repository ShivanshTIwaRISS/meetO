export class Profile {
    private userId: string;
    private bio: string;
    private profilePicture: string;

    constructor(userId: string, bio: string = "", profilePicture: string = "") {
        this.userId = userId;
        this.bio = bio;
        this.profilePicture = profilePicture;
    }

    public getUserId(): string { return this.userId; }
    public getBio(): string { return this.bio; }
    public getProfilePicture(): string { return this.profilePicture; }

    public updateBio(newBio: string): void {
        this.bio = newBio;
    }

    public updateProfilePicture(newPictureUrl: string): void {
        this.profilePicture = newPictureUrl;
    }
}
