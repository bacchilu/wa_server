__all__ = ["Authentication"]


class Authentication:
    def login(self, username: str, password: str) -> bool:
        return username == "bacchilu@gmail.com" and password == "bacchilu"
