FROM node:20-alpine

WORKDIR /app

COPY mcp/travily/package.json mcp/travily/package.json
RUN cd mcp/travily && npm install --omit=dev

COPY mcp/travily mcp/travily

ENV TRAVLY_KEY=""

CMD ["node", "mcp/travily/server.js"]
