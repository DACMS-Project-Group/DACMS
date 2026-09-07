class SecurityToken {
    constructor({
        token_id = null,
        user_id,
        jwt_token,
        issued_at = new Date(),
        expires_at,
    }) {
        this.token_id = token_id;
        this.user_id = user_id;
        this.jwt_token = jwt_token;
        this.issued_at = issued_at;
        this.expires_at = expires_at;
    }

    static fromDb(row) {
        return new SecurityToken({
            token_id: row.TokenID,
            user_id: row.UserID,
            jwt_token: row.JWTToken,
            issued_at: row.IssuedAt ?? row.issued_at,
            expires_at: row.ExpiresAt ?? row.expires_at,
        });
    }

    toDb() {
        return {
            TokenID: this.token_id,
            UserID: this.user_id,
            JWTToken: this.jwt_token,
            IssuedAt: this.issued_at,
            ExpiresAt: this.expires_at,
        };
    }

    validate() {
        if (!this.user_id) {
            throw new Error("User ID is required.");
        }

        if (!this.jwt_token || this.jwt_token.trim() === "") {
            throw new Error("JWT token is required.");
        }

        if (!this.issued_at) {
            throw new Error("Issued at date is required.");
        }

        if (!this.expires_at) {
            throw new Error("Expires at date is required.");
        }
    }
}

export default SecurityToken;