FROM python:3.14.0
LABEL maintainer="Luca Bacchi <bacchilu@gmail.com> (https://github.com/bacchilu)"

ARG USER_ID
ARG GROUP_ID
ARG USERNAME=appuser

RUN groupadd -g ${GROUP_ID} ${USERNAME}
RUN useradd -m -u ${USER_ID} -g ${USERNAME} ${USERNAME}

WORKDIR /app

COPY requirements.txt ./
COPY . .

RUN chown -R ${USERNAME}:${USERNAME} /app
USER ${USERNAME}

ENV PATH="/home/$USERNAME/.local/bin:$PATH"
RUN pip3 install -r requirements.txt

CMD ["python", "main.py"]
