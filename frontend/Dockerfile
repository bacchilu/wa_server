FROM node:25.2.0
LABEL maintainer="Luca Bacchi <bacchilu@gmail.com> (https://github.com/bacchilu)"

ARG USER_ID
ARG GROUP_ID
ARG USERNAME=appuser

RUN userdel -f node && if getent group node ; then groupdel node; fi
RUN groupadd -g ${GROUP_ID} ${USERNAME}
RUN useradd -ms /bin/bash -l -u ${USER_ID} -g ${USERNAME} ${USERNAME}

WORKDIR /app

COPY . .

RUN chown -R ${USERNAME}:${USERNAME} /app
USER ${USERNAME}

RUN npm install
RUN npm run build

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

EXPOSE 5173