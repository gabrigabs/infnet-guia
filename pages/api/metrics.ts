import type { NextApiRequest, NextApiResponse } from 'next';
import client from 'prom-client';

const registry = new client.Registry();

client.collectDefaultMetrics({ register: registry });

export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Número total de requisições HTTP recebidas',
  labelNames: ['method', 'route'],
});

registry.registerMetric(httpRequestCounter);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  httpRequestCounter.inc({ method: req.method, route: '/metrics' });
  res.setHeader('Content-Type', registry.contentType);
  res.end(await registry.metrics());
}