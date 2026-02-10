FROM node:20-alpine

WORKDIR /app

COPY mcp/travily/package.json mcp/travily/package.json
RUN cd mcp/travily && npm install --omit=dev

COPY mcp/travily mcp/travily

ENV TRAVLY_KEY=""

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "process.exit(process.env.TRAVLY_KEY ? 0 : 1)"

CMD ["node", "mcp/travily/server.js"]
