import express from 'express';
import { schema } from '../db/RequestLog.js';

const router = express.Router();
const RequestLog = schema.meta.class; 

export default (orm) => {
  const em = orm.em.fork();

  // CREATE
  router.post('/', async (req, res) => {
    try {
      const log = em.create(RequestLog, {
        ...req.body,
        createdAt: new Date(),
      });
      await em.persistAndFlush(log);
      res.status(201).json(log);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ ALL (paginated)
  router.get('/', async (req, res) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const [logs, total] = await em.findAndCount(RequestLog, {}, {
        limit,
        offset: (page - 1) * limit,
        orderBy: { createdAt: 'DESC' },
      });
      res.json({ data: logs, total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ ONE
  router.get('/:id', async (req, res) => {
    try {
      const log = await em.findOne(RequestLog, { id: +req.params.id });
      if (!log) return res.status(404).json({ error: 'Not found' });
      res.json(log);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE
  router.put('/:id', async (req, res) => {
    try {
      const log = await em.findOne(RequestLog, { id: +req.params.id });
      if (!log) return res.status(404).json({ error: 'Not found' });
      em.assign(log, req.body);
      await em.persistAndFlush(log);
      res.json(log);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE
  router.delete('/:id', async (req, res) => {
    try {
      const log = await em.findOne(RequestLog, { id: +req.params.id });
      if (!log) return res.status(404).json({ error: 'Not found' });
      await em.removeAndFlush(log);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
