FROM node:25.0.0

ARG LOCAL_UID=1000
ARG LOCAL_GID=1000
ARG USERNAME=appuser

RUN userdel -f node && if getent group node ; then groupdel node; fi
RUN groupadd -g ${LOCAL_GID} ${USERNAME}
RUN useradd -ms /bin/bash -l -u ${LOCAL_UID} -g ${USERNAME} ${USERNAME}
RUN install -d -m 0755 -o ${USERNAME} -g ${USERNAME} /home/${USERNAME}

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
