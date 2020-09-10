FROM stayfunfrontend.azurecr.io/node

RUN mkdir -p /usr/src/nuxt-frontend
WORKDIR /usr/src/nuxt-frontend
COPY . .

ENV NUXT_ENV_PROXY_URL=https://tst-stayfun-proxy.azurewebsites.net
ENV NUXT_ENV_APP_INSIGHT_KEY=db39af12-29b1-4a4c-9742-9d62072cbda4
ENV NUXT_ENV_ZENDESK_KEY=5o67kZfbLoMX5AFZ4QctJi2cIF9ivSYP

RUN npm install --production && npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
