import wa


class TokenVerifyManager:
    def __call__(self, mode: str | None, challenge: str | None, token: str | None):
        verified_challenge = wa.verify_token(mode, token, challenge)
        return verified_challenge
